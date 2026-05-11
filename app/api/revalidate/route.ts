// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Revalidate home page
    revalidatePath('/', 'layout');
    revalidatePath('/collections', 'layout');
    revalidatePath('/products', 'layout');
    revalidatePath('/pages', 'layout');
    
    console.log('Revalidated:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Revalidated successfully' 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to revalidate' 
    }, { status: 500 });
  }
}