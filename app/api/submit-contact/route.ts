import { NextResponse } from 'next/server';
import { client } from '@/lib/sanityClient.server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    await client.create({
      _type: 'contactSubmission',
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}