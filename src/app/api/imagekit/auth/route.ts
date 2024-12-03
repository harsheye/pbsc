import ImageKit from 'imagekit';
import { NextResponse } from 'next/server';

const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || '';
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '';
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '';

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint
});

export async function GET() {
  try {
    const token = imagekit.getAuthenticationParameters();
    return NextResponse.json(token);
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 