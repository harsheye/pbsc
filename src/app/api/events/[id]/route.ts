import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { handleDatabaseError } from '@/middleware/errorHandler';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await dbConnect();
    const event = await Event.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(event);
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    await Event.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleDatabaseError(error);
  }
} 