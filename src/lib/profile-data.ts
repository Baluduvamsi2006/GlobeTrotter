import { prisma } from "@/lib/prisma";

export const profileSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    phoneNumber: true,
    city: true,
    country: true,
    additionalInfo: true,
    profilePhotoUrl: true,
    role: true,
} as const;

const tripSelect = {
    id: true,
    title: true,
    startDate: true,
    endDate: true,
    totalBudget: true,
    coverPhotoUrl: true,
    tripPlaces: {
        orderBy: { visitOrder: "asc" as const },
        take: 1,
        select: { place: { select: { city: true, country: true, photoUrl: true } } },
    },
} as const;

export async function getProfileData(userId: string) {
    const [user, savedDestinations, trips] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: profileSelect }),
        prisma.place.findMany({
            where: { tripPlaces: { some: { trip: { userId } } } },
            select: { id: true, name: true, city: true, country: true, photoUrl: true },
            take: 6,
            orderBy: { createdAt: "desc" },
        }),
        prisma.trip.findMany({ where: { userId }, select: tripSelect, orderBy: { startDate: "asc" } }),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const preplannedTrips = trips.filter((trip) => trip.endDate >= today);
    const completedTrips = trips.filter((trip) => trip.endDate < today).sort((a, b) => b.endDate.getTime() - a.endDate.getTime());

    return { user, savedDestinations, preplannedTrips, completedTrips };
}