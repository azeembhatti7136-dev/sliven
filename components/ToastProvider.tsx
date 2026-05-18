// src/components/ToastProvider.tsx
'use client';

import { Toaster } from 'sonner';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1f2937',
          color: '#fff',
          borderRadius: '12px',
          border: 'none',
        },
      }}
    />
  );
}
