import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 1. Create a dummy user
  const user1 = await prisma.user.upsert({
    where: { email: 'demo@globetrotter.com' },
    update: {},
    create: {
      email: 'demo@globetrotter.com',
      firstName: 'Demo',
      lastName: 'User',
      passwordHash: 'dummy_hash',
      city: 'San Francisco',
      country: 'USA',
    },
  });

  console.log('Created user:', user1.email);

  // 2. Create sample places (Destinations and Activities)
  const placesData = [
    {
      name: 'Eiffel Tower',
      city: 'Paris',
      country: 'France',
      region: 'Europe',
      placeType: 'Activity',
      description: 'Iconic iron lattice tower on the Champ de Mars.',
      photoUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Louvre Museum',
      city: 'Paris',
      country: 'France',
      region: 'Europe',
      placeType: 'Activity',
      description: 'World\'s largest art museum and a historic monument.',
      photoUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Kyoto',
      city: 'Kyoto',
      country: 'Japan',
      region: 'Asia',
      placeType: 'City',
      description: 'Former capital of Japan, famous for numerous classical Buddhist temples.',
      photoUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Lisbon',
      city: 'Lisbon',
      country: 'Portugal',
      region: 'Europe',
      placeType: 'City',
      description: 'Hilly, coastal capital city of Portugal.',
      photoUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Paragliding in Interlaken',
      city: 'Interlaken',
      country: 'Switzerland',
      region: 'Europe',
      placeType: 'Activity',
      description: 'Experience the thrill of flying over the Swiss Alps.',
      photoUrl: 'https://images.unsplash.com/photo-1506015391300-4150f1522cba?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Colosseum',
      city: 'Rome',
      country: 'Italy',
      region: 'Europe',
      placeType: 'Activity',
      description: 'Oval amphitheatre in the centre of the city of Rome.',
      photoUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'New York City',
      city: 'New York',
      country: 'USA',
      region: 'North America',
      placeType: 'City',
      description: 'The city that never sleeps.',
      photoUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Scuba Diving at Great Barrier Reef',
      city: 'Cairns',
      country: 'Australia',
      region: 'Oceania',
      placeType: 'Activity',
      description: 'Explore the world\'s largest coral reef system.',
      photoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    }
  ];

  for (const p of placesData) {
    const createdPlace = await prisma.place.create({
      data: p
    });
    console.log(`Created Place: ${createdPlace.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
