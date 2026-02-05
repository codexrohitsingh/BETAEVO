import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const windowMs = 5 * 60 * 1000;
    const since = new Date(Date.now() - windowMs);
    const active = await prisma.userPresence.findMany({
      where: { lastSeen: { gte: since } },
      include: { user: true }
    });
    const count = active.length;
    const users = active.map(a => ({ email: a.user.email, lastSeen: a.lastSeen }));
    return NextResponse.json({ count, users });
  } catch {
    return NextResponse.json({ count: 0, users: [] }, { status: 200 });
  }
}
