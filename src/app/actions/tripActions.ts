'use server';

import { prisma } from '../../lib/prisma';
import { auth } from '../../auth';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

export async function createTrip(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'You must be logged in to create a trip.' };
  }

  const name = formData.get('name') as string;
  const place = formData.get('place') as string; // Will ignore for now, could save to description
  const start_date = formData.get('startDate') as string;
  const end_date = formData.get('endDate') as string;
  const description = formData.get('description') as string;
  const coverPhoto = formData.get('coverPhoto') as File;

  if (!name || !start_date || !end_date) {
    return { error: 'Please fill out all required fields.' };
  }

  const startDateObj = new Date(start_date);
  const endDateObj = new Date(end_date);

  if (startDateObj > endDateObj) {
    return { error: 'Start date must be before or equal to end date.' };
  }

  let coverPhotoUrl = null;

  try {
    // 1. Handle file upload if present
    if (coverPhoto && coverPhoto.size > 0) {
      const buffer = Buffer.from(await coverPhoto.arrayBuffer());
      const filename = `${Date.now()}-${coverPhoto.name.replace(/\s+/g, '-')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      try {
        await fs.access(uploadDir);
      } catch {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      await fs.writeFile(path.join(uploadDir, filename), buffer);
      coverPhotoUrl = `/uploads/${filename}`;
    }

    // 2. Create the trip using Prisma and the Authenticated User's ID
    await prisma.trip.create({
      data: {
        userId: session.user.id,
        title: name,
        startDate: new Date(start_date),
        endDate: new Date(end_date),
      },
    });

    revalidatePath('/create-trip');
    revalidatePath('/trips');
    return { success: true, message: 'Trip created successfully!' };
  } catch (error) {
    console.error('Database error:', error);
    return { error: 'Failed to create trip. Please try again.' };
  }
}

export async function deleteTrip(tripId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  try {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: session.user.id }
    });

    if (!trip) {
      return { error: 'Trip not found or access denied.' };
    }

    await prisma.trip.delete({
      where: { id: tripId }
    });

    revalidatePath('/trips');
    return { success: true };
  } catch (error) {
    console.error('Error deleting trip:', error);
    return { error: 'Failed to delete trip.' };
  }
}
