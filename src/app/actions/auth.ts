'use server';

import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function registerUser(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    if (!email || !password || !firstName || !lastName) {
      return { error: 'Missing required fields' };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'User with this email already exists' };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: 'user',
      },
    });

    return { success: true, userId: user.id };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { error: error?.message || 'Something went wrong during registration.' };
  }
}
