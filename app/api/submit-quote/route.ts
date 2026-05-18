import { NextResponse } from 'next/server';
import { client } from '@/lib/sanityClient.server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    await client.create({
      _type: 'quoteRequest',
      product: { _type: 'reference', _ref: data.productId },
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      quantity: data.quantity,
      requirements: data.requirements,
      status: 'new',
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}