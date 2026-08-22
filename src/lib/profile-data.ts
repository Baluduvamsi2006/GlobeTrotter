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

export async function getProfileData(userId: string) {
    const [user, savedDestinations] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: profileSelect }),
        prisma.place.findMany({
            where: { tripPlaces: { some: { trip: { userId } } } },
            select: { id: true, name: true, city: true, country: true, photoUrl: true },
            take: 6,
            orderBy: { createdAt: "desc" },
        }),
    ]);

    return { user, savedDestinations };
}