import { DEFAULT_IMAGE } from '@/constants/images';

export async function GET() {
  try {
    const members = await Team.find();
    // Ensure all members have a valid image
    const sanitizedMembers = members.map(member => ({
      ...member.toObject(),
      image: member.image || DEFAULT_IMAGE
    }));
    return NextResponse.json(sanitizedMembers);
  } catch (error) {
    return NextResponse.error();
  }
} 