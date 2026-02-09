 import { NextResponse } from 'next/server';
 import { setupSmartAudio } from '@/app/actions/setup-smart-audio';
 
 export async function GET() {
   const result = await setupSmartAudio();
   return NextResponse.json(result);
 }
