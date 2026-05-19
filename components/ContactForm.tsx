// src/components/ContactForm.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Send, Loader2, CheckCircle, Mail, Phone, MapPin, 
  MessageSquare, User, AtSign, FileText 
} from 'lucide-react';
import { toast } from 'sonner';
import RichTextRenderer from './RichTextRenderer';
function getImageUrl(image: any, width: number = 800, height?: number): string {
  if (!image?.asset?._ref) return '';
  const ref = image.asset._ref;
  const parts = ref.split('-');
  const id = parts[1];
  const fmt = parts[3] || 'jpg';
  const h = height || Math.round(width * 0.75);
  return `https://cdn.sanity.io/images/d2zeiu5j/production/${id}-${width}x${h}.${fmt}`;
}

// âŒ DELETE: import { client } from '@/lib/sanity';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  sectionLabel?: string;
  title: any;
  subtitle?: string;
  contactImage?: any;
  contactImageUrl?: string; // ðŸ‘ˆ ADD
  backgroundColor?: string;
  showInfo?: boolean;
  email?: string;
  phone?: string;
  address?: string;
}

export default function ContactForm({
  sectionLabel,
  title,
  subtitle,
  contactImage,
  contactImageUrl, // ðŸ‘ˆ ADD
  backgroundColor = '#f9fafb',
  showInfo = true,
  email,
  phone,
  address,
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const isDark = backgroundColor === '#111827';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900';
  const labelColor = isDark ? 'text-gray-300' : 'text-gray-700';

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // ðŸ‘‡ API route se Sanity mein data save karo
      const response = await fetch('/api/submit-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setIsSuccess(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      
      setTimeout(() => {
        setIsSuccess(false);
        reset();
      }, 3000);
    } catch (error) {
      console.error('Contact submission error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={{ backgroundColor }} className="relative overflow-hidden">
      {/* Decorative Background */}
      {!isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-40" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section Header */}
        <div className="text-center mb-16">
          {sectionLabel && (
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200">
                {sectionLabel}
              </span>
            </div>
          )}

          <div className={textColor}>
            <RichTextRenderer content={title} textColor={textColor} headingColor={textColor} />
          </div>

          {subtitle && (
            <p className={`mt-4 ${subtitleColor} max-w-2xl mx-auto text-lg leading-relaxed`}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info Sidebar */}
          {showInfo && (
            <div className="lg:col-span-2 space-y-6">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <h3 className={`text-xl font-bold mb-6 ${textColor}`}>Get in Touch</h3>
                
                <div className="space-y-5">
                  {email && (
                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                        <p className={`text-sm font-medium mt-1 ${textColor}`}>{email}</p>
                      </div>
                    </div>
                  )}

                  {phone && (
                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                        <p className={`text-sm font-medium mt-1 ${textColor}`}>{phone}</p>
                      </div>
                    </div>
                  )}

                  {address && (
                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Address</p>
                        <p className={`text-sm font-medium mt-1 leading-relaxed ${textColor}`}>{address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Side Image */}
              {contactImageUrl && ( // ðŸ‘ˆ Use URL directly
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg">
                  <Image
                    src={contactImageUrl}
                    alt="Contact"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <div className={showInfo ? 'lg:col-span-3' : 'lg:col-span-5'}>
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${textColor}`}>Message Sent!</h3>
                  <p className={subtitleColor}>Thank you for reaching out. We'll respond shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                          {...register('name')}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${inputBg} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                        Email Address *
                      </label>
                      <div className="relative">
                        <AtSign className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                          {...register('email')}
                          type="email"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${inputBg} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Phone */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                          {...register('phone')}
                          type="tel"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${inputBg} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm`}
                          placeholder="+91 9876543210"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                        Subject *
                      </label>
                      <div className="relative">
                        <FileText className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                          {...register('subject')}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${inputBg} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm`}
                          placeholder="How can we help?"
                        />
                      </div>
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                      Message *
                    </label>
                    <div className="relative">
                      <MessageSquare className={`absolute left-4 top-4 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <textarea
                        {...register('message')}
                        rows={5}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border ${inputBg} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm resize-none`}
                        placeholder="Tell us about your requirements..."
                      />
                    </div>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

