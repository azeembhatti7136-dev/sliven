import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Agar Sanity webhook se json data aa raha hai
    const body = await request.json();
    console.log('Sanity Webhook Triggered with body:', JSON.stringify(body, null, 2));

    // Forcefully main pages ko revalidate karein
    revalidatePath('/', 'layout');
    revalidatePath('/collections', 'layout');
    revalidatePath('/products', 'layout');
    revalidatePath('/pages', 'layout');

    return NextResponse.json({
      revalidated: true,
      message: 'Paths revalidated successfully',
      time: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Revalidation Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to revalidate',
      message: error.message
    }, { status: 500 });
  }
}