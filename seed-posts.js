const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Get an existing user or create one
  let user = await prisma.user.findFirst();
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        passwordHash: 'dummy',
        username: 'testuser',
      }
    });
  }

  console.log('Seeding posts for user:', user.id);

  const posts = [
    {
      title: 'Just got back from an amazing trip to Japan!',
      body: 'We spent 2 weeks exploring Tokyo, Kyoto, and Osaka. The food was incredible and the public transport made getting around so easy. Highly recommend getting a JR Pass if you plan on traveling between cities.',
      userId: user.id,
    },
    {
      title: 'Any recommendations for a weekend in Rome?',
      body: 'I have a short weekend trip coming up and I want to make the most of it. What are the absolute must-dos? We already have tickets for the Colosseum.',
      userId: user.id,
    },
    {
      title: 'Budget travel tips for Southeast Asia',
      body: 'I managed to travel for 3 months on less than $3000. Here are some of my top tips: 1. Eat local street food. 2. Use overnight buses to save on accommodation. 3. Negotiate tuk-tuk prices before getting in.',
      userId: user.id,
    }
  ];

  for (const post of posts) {
    await prisma.communityPost.create({
      data: post
    });
  }

  console.log('Successfully seeded community posts');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
