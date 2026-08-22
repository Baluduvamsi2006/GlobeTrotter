'use server';

import { prisma } from '../../lib/prisma';
import { sendPasswordResetEmail } from '../../lib/email';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function requestPasswordReset(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  if (!email) return { error: 'Email is required' };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: 'No account found with this email address' };

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, resetUrl, user.firstName);

    return { success: true };
  } catch (error: any) {
    console.error('Password reset request error:', error);
    return { error: 'Failed to send reset email. Check your SMTP configuration.' };
  }
}

export async function verifyResetToken(token: string) {
  if (!token) return { valid: false, error: 'No token provided' };

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
    select: { id: true, email: true, firstName: true },
  });

  if (!user) return { valid: false, error: 'This reset link is invalid or has expired.' };
  return { valid: true, user };
}

export async function confirmPasswordReset(token: string, formData: FormData) {
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!newPassword || newPassword !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }
  if (newPassword.length < 8) return { error: 'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(newPassword)) return { error: 'Password must contain at least one uppercase letter' };
  if (!/[0-9]/.test(newPassword)) return { error: 'Password must contain at least one number' };
  if (!/[^A-Za-z0-9]/.test(newPassword)) return { error: 'Password must contain at least one special character' };

  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
  });

  if (!user) return { error: 'This reset link is invalid or has expired.' };

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null },
  });

  return { success: true };
}
