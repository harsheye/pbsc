import { writeFile, mkdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    try {
      // Create buffer from file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'images', category);
      await mkdir(uploadsDir, { recursive: true });

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
      const filename = `${timestamp}-${originalName}`;
      const filePath = path.join(uploadsDir, filename);

      // Save the file
      await writeFile(filePath, buffer);

      // Return the public URL
      const publicUrl = `/images/${category}/${filename}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileType: file.type,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        size: buffer.length
      });

    } catch (error) {
      console.error('File processing error:', error);
      return NextResponse.json(
        { error: 'Failed to process file' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
} 