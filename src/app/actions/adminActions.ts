'use server';

import { prisma } from '../../lib/prisma';
import { auth } from '../../auth';
import { format, subDays } from 'date-fns';

export async function checkAdmin() {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    throw new Error('Unauthorized');
  }
}

export async function getAdminAnalytics() {
  await checkAdmin();

  // 1. User Roles Distribution (Pie Chart)
  const roleDistribution = await prisma.user.groupBy({
    by: ['role'],
    _count: { id: true }
  });
  const pieData = roleDistribution.map(r => ({
    name: r.role.toUpperCase(),
    value: r._count.id
  }));

  // 2. User Signups Over Last 7 Days (Line Chart)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), i);
    return format(d, 'yyyy-MM-dd');
  }).reverse();

  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: subDays(new Date(), 7)
      }
    },
    select: { createdAt: true }
  });

  const signupsByDate = users.reduce((acc, user) => {
    const dateStr = format(user.createdAt, 'yyyy-MM-dd');
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const lineData = last7Days.map(date => ({
    date: format(new Date(date), 'MMM dd'),
    users: signupsByDate[date] || 0
  }));

  // 3. Popular Cities (Bar Chart)
  const places = await prisma.tripPlace.findMany({
    include: { place: true }
  });

  const cityCounts = places.reduce((acc, tp) => {
    const city = tp.place.city;
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // If we don't have enough data, mock some for visual purposes for the hackathon
  let barData = Object.entries(cityCounts)
    .map(([city, visits]) => ({ name: city, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);

  if (barData.length === 0) {
    barData = [
      { name: 'Kyoto', visits: 120 },
      { name: 'Paris', visits: 98 },
      { name: 'New York', visits: 86 },
      { name: 'Lisbon', visits: 70 },
      { name: 'Rome', visits: 65 }
    ];
  }

  return { pieData, lineData, barData };
}

export async function getManageUsers() {
  await checkAdmin();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  return users;
}
