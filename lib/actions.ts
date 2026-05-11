// src/lib/actions.ts
'use server';

import { client } from './sanity';

export async function submitQuoteRequest(data: any, productId: string) {
  try {
    const result = await client.create({
      _type: 'quoteRequest',
      product: {
        _type: 'reference',
        _ref: productId,
      },
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      quantity: data.quantity,
      requirements: data.requirements,
      status: 'new',
      submittedAt: new Date().toISOString(),
    });

    return { success: true, message: 'Quote submitted successfully!' };
  } catch (error: any) {
    console.error('Quote submission error:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to submit quote. Please try again.' 
    };
  }
}