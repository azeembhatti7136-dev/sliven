// src/app/contact/page.tsx
import { client } from '@/lib/sanity';
import Image from 'next/image';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { urlFor } from '@/lib/sanity';
import Hero from '@/components/Hero';
import ContactForm from '@/components/ContactForm';
import FAQ from '@/components/FAQ';
import ContentBoxes from '@/components/ContentBoxes';
import ImageTextSection from '@/components/ImageTextSection';

export const dynamic = 'force-dynamic';

async function getContactData() {
  return client.fetch(`*[_type == "contact"][0]{
    title, subtitle, heroImage, email, phone, address, mapEmbed,
    socialLinks[] { platform, url },
    modules[] {
      _type, _key,
      _type == "hero" => { backgroundImage, imageFit, overlayOpacity, "title": title.text, "subtitle": subtitle.text, showButton, buttonText, buttonLink, horizontalPosition, verticalPosition, height },
      _type == "faq" => { sectionLabel, "title": title.text, subtitle, faqs[] { _key, question, "answer": answer.text }, columns, backgroundColor },
      _type == "contentBox" => { sectionLabel, "title": title.text, subtitle, boxes[] { _key, layout, image, imageAlt, "boxTitle": boxTitle.text, "boxDescription": boxDescription.text, features, buttonText, buttonLink, backgroundColor, roundedCorners }, sectionBackground },
      _type == "imageTextSection" => { "title": title.text, subtitle, sections[] { _key, layout, "title": title.text, "description": description.text, image, imageAlt, buttonText, buttonLink }, backgroundColor }
    },
    seo
  }`);
}

export default async function ContactPage() {
  const contact = await getContactData();

  if (!contact) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Contact page not configured yet.</p></div>;
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[400px] bg-gray-900 overflow-hidden">
        {contact.heroImage && <Image src={urlFor(contact.heroImage).width(1920).height(600).url()} alt="Contact" fill className="object-cover opacity-50" priority sizes="100vw" />}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">{contact.title}</h1>
            {contact.subtitle && <p className="text-xl opacity-80 max-w-2xl">{contact.subtitle}</p>}
          </div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {contact.email && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                <Mail className="w-8 h-8 text-amber-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <a href={`mailto:${contact.email}`} className="text-gray-700 hover:text-amber-600">{contact.email}</a>
              </div>
            )}
            {contact.phone && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <Phone className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                <a href={`tel:${contact.phone}`} className="text-gray-700 hover:text-blue-600">{contact.phone}</a>
              </div>
            )}
            {contact.address && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <MapPin className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                <p className="text-gray-700 text-sm">{contact.address}</p>
              </div>
            )}
            {contact.socialLinks?.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <Globe className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Follow Us</h3>
                <div className="flex flex-wrap gap-2">
                  {contact.socialLinks.map((s: any) => (
                    <a key={s._key} href={s.url} target="_blank" className="text-sm text-gray-700 bg-white px-3 py-1 rounded-full hover:shadow">{s.platform}</a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm 
              title={[{_type: 'block', children: [{_type: 'span', text: 'Send Us a Message'}], style: 'h2'}]}
              subtitle="We'll get back to you within 24 hours"
              showInfo={false}
            />
          </div>
        </div>
      </section>

      {/* Google Map */}
      {contact.mapEmbed && (
        <section className="h-[400px]">
          <iframe src={contact.mapEmbed} width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" />
        </section>
      )}

      {/* Modules */}
      {contact.modules?.map((module: any) => {
        if (module._type === 'hero') return <Hero key={module._key} {...module} />;
        if (module._type === 'faq') return <FAQ key={module._key} {...module} />;
        if (module._type === 'contentBox') return <ContentBoxes key={module._key} {...module} />;
        if (module._type === 'imageTextSection') return <ImageTextSection key={module._key} {...module} />;
        return null;
      })}
    </main>
  );
}