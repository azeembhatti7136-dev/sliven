import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Next.js ko dynamically render force karne ke liye (important for webhooks)
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check karein ke request body empty to nahi
    let body;
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    console.log('Sanity Webhook Triggered with body:', JSON.stringify(body, null, 2));

    // Forcefully essential routes ko clear karein
    revalidatePath('/', 'layout');
    revalidatePath('/collections', 'layout');
    revalidatePath('/products', 'layout');
    revalidatePath('/pages', 'layout');

    return NextResponse.json({
      revalidated: true,
      message: 'Paths revalidated successfully',
      time: new Date().toISOString()
    }, { status: 200 });

  } catch (error: any) {
    console.error('Revalidation Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to revalidate',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}