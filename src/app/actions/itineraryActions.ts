'use server';

import { prisma } from '../../lib/prisma';
import { auth } from '../../auth';
import { revalidatePath } from 'next/cache';

export async function saveItinerarySections(tripId: string, sections: any[]) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'You must be logged in to save an itinerary.' };
  }

  // Verify the trip belongs to the user
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: session.user.id }
  });

  if (!trip) {
    return { error: 'Trip not found or access denied.' };
  }

  try {
    // For simplicity, we'll delete existing sections and recreate them to match the new state
    await prisma.itinerarySection.deleteMany({
      where: { tripId }
    });

    // Re-create the sections
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      await prisma.itinerarySection.create({
        data: {
          tripId,
          title: section.title,
          description: section.type,
          dateFrom: section.startDate ? new Date(section.startDate) : null,
          dateTo: section.endDate ? new Date(section.endDate) : null,
          budget: section.budget || null,
          sortOrder: i,
          activities: {
            create: (section.activities || []).map((a: any, actIndex: number) => ({
              name: a.name,
              expense: a.expense || 0,
              sortOrder: actIndex,
              activityDate: section.startDate ? new Date(section.startDate) : null
            }))
          }
        }
      });
    }

    revalidatePath(`/build-itinerary`);
    revalidatePath(`/itinerary-view`);
    return { success: true, message: 'Itinerary saved successfully!' };
  } catch (error) {
    console.error('Error saving itinerary:', error);
    return { error: 'Failed to save itinerary.' };
  }
}
