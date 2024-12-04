import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Media from '@/models/Media';
import { handleDatabaseError } from '@/middleware/errorHandler';

export async function GET() {
  try {
    await dbConnect();
    const media = await Media.find().sort({ uploadedAt: -1 });
    return NextResponse.json(media);
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const media = await Media.create(body);
    return NextResponse.json(media);
  } catch (error) {
    return handleDatabaseError(error);
  }
} 