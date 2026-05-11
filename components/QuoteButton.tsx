// src/components/QuoteButton.tsx
'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import QuoteFormModal from './QuoteFormModal';

interface QuoteButtonProps {
  productId: string;
  productName: string;
  productImage?: any;        // 👈 ADD
  productSku?: string;        // 👈 ADD
  productCollection?: string; // 👈 ADD
  buttonText?: string;
  className?: string;
}

export default function QuoteButton({
  productId,
  productName,
  productImage,         // 👈 ADD
  productSku,           // 👈 ADD
  productCollection,    // 👈 ADD
  buttonText = 'Get Quote',
  className = '',
}: QuoteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 ${className}`}
      >
        <MessageSquare className="w-4 h-4" />
        {buttonText}
      </button>

      <QuoteFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        productName={productName}
        productImage={productImage}           // 👈 PASS
        productSku={productSku}               // 👈 PASS
        productCollection={productCollection} // 👈 PASS
      />
    </>
  );
}