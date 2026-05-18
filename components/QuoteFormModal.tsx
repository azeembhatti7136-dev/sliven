// src/components/QuoteFormModal.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { X, Send, Loader2, CheckCircle, Package } from 'lucide-react';
import { toast } from 'sonner';

function getImageUrl(image: any, width: number = 800, height?: number): string {
  if (!image?.asset?._ref) return '';
  const match = image.asset._ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  if (!match) return '';
  const id = match[1];
  const fmt = match[3] || 'jpg';
  const h = height || Math.round(width * 0.75);
  return `https://cdn.sanity.io/images/d2zeiu5j/production/${id}-${width}x${h}.${fmt}`;
}

import { QuoteFormData } from '@/types';

const quoteSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  company: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  requirements: z.string().optional(),
});

interface QuoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage?: any;
  productImageUrl?: string; // 👈 ADD: Pre-processed URL
  productSku?: string;
  productCollection?: string;
}

export default function QuoteFormModal({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  productImageUrl, // 👈 ADD
  productSku,
  productCollection,
}: QuoteFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { quantity: 1 },
  });

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);

    try {
      // 👇 API route se Sanity mein data save karo
      const response = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          ...data,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setIsSuccess(true);
      toast.success('Quote request submitted! We\'ll contact you soon.');
      
      setTimeout(() => {
        setIsSuccess(false);
        reset();
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Quote submission error:', error);
      toast.error('Failed to submit quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-black">Request a Quote</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Mini Card */}
        <div className="p-6 border-b border-gray-50 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200 flex-shrink-0">
              {productImageUrl ? ( // 👈 Use URL directly
                <Image src={productImageUrl} alt={productName} fill className="object-cover" sizes="64px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300"><Package className="w-8 h-8" /></div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-black text-sm truncate">{productName}</h3>
              {productSku && <p className="text-xs text-gray-500">SKU: {productSku}</p>}
              {productCollection && <p className="text-xs text-amber-600 font-medium">{productCollection}</p>}
            </div>
          </div>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-black">Quote Submitted!</h3>
            <p className="text-gray-500 mt-2">We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Full Name *</label>
              <input {...register('fullName')} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all" placeholder="John Doe" />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Email *</label>
                <input {...register('email')} type="email" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Phone *</label>
                <input {...register('phone')} type="tel" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all" placeholder="+92 300 7136735" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Company (Optional)</label>
              <input {...register('company')} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all" placeholder="Your company name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Quantity *</label>
              <input {...register('quantity', { valueAsNumber: true })} type="number" min="1" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all" />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Custom Requirements</label>
              <textarea {...register('requirements')} rows={3} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none" placeholder="Any specific requirements..." />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3.5 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-base">
              {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <><Send className="w-5 h-5" /> Submit Quote Request</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

