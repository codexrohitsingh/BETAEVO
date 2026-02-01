
import { NextResponse } from 'next/server';
import { setupAccessories } from '@/app/actions/setup-accessories';

export async function GET() {
  const result = await setupAccessories();
  return NextResponse.json(result);
}
