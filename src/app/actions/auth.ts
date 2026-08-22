'use server';

import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
  return null;
}

function validateUsername(username: string): string | null {
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 20) return 'Username must be 20 characters or less';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
  return null;
}

export async function registerUser(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const username = (formData.get('username') as string)?.trim();
    const securityQuestion = formData.get('securityQuestion') as string;
    const securityAnswer = (formData.get('securityAnswer') as string)?.trim().toLowerCase();

    if (!email || !password || !firstName || !lastName) {
      return { error: 'Missing required fields' };
    }

    if (password !== confirmPassword) {
      return { error: 'Passwords do not match' };
    }

    const pwError = validatePassword(password);
    if (pwError) return { error: pwError };

    if (username) {
      const unError = validateUsername(username);
      if (unError) return { error: unError };

      const existingUsername = await prisma.user.findUnique({ where: { username } });
      if (existingUsername) return { error: 'Username is already taken' };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: 'An account with this email already exists' };

    const passwordHash = await bcrypt.hash(password, 12);
    const securityAnswerHash = securityAnswer ? await bcrypt.hash(securityAnswer, 10) : null;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        username: username || null,
        role: 'user',
        securityQuestion: securityQuestion || null,
        securityAnswer: securityAnswerHash,
        phoneNumber: (formData.get('phoneNumber') as string) || null,
        city: (formData.get('city') as string) || null,
        country: (formData.get('country') as string) || null,
        additionalInfo: (formData.get('additionalInfo') as string) || null,
      },
    });

    return { success: true, userId: user.id };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { error: error?.message || 'Something went wrong during registration.' };
  }
}

export async function resetPassword(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const securityAnswer = (formData.get('securityAnswer') as string)?.trim().toLowerCase();
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!email || !securityAnswer || !newPassword) {
      return { error: 'All fields are required' };
    }

    if (newPassword !== confirmPassword) {
      return { error: 'Passwords do not match' };
    }

    const pwError = validatePassword(newPassword);
    if (pwError) return { error: pwError };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.securityAnswer) {
      return { error: 'No account found or no security question set' };
    }

    const answerMatch = await bcrypt.compare(securityAnswer, user.securityAnswer);
    if (!answerMatch) {
      return { error: 'Incorrect security answer' };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { email }, data: { passwordHash } });

    return { success: true };
  } catch (error: any) {
    console.error('Reset password error:', error);
    return { error: error?.message || 'Something went wrong.' };
  }
}

export async function getSecurityQuestion(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { securityQuestion: true },
    });
    if (!user) return { error: 'No account found with this email' };
    if (!user.securityQuestion) return { error: 'This account has no security question set' };
    return { question: user.securityQuestion };
  } catch {
    return { error: 'Something went wrong.' };
  }
}
