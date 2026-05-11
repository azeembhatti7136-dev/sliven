// src/app/about/page.tsx
import { client } from '@/lib/sanity';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity';
import { Users, Target, Eye } from 'lucide-react';

import Hero from '@/components/Hero';
import VideoWithText from '@/components/VideoWithText';
import FeaturesSection from '@/components/FeaturesSection';
import ImageTextSection from '@/components/ImageTextSection';
import ImageGallery from '@/components/ImageGallery';
import ContentBoxes from '@/components/ContentBoxes';
import CardGrid from '@/components/CardGrid';
import ContactForm from '@/components/ContactForm';
import FAQ from '@/components/FAQ';
import Timeline from '@/components/Timeline';
import PartnerSlider from '@/components/PartnerSlider';
import StepsCard from '@/components/StepsCard';
import Testimonial from '@/components/Testimonial';
import FeaturedProduct from '@/components/FeaturedProduct';

export const dynamic = 'force-dynamic';

async function getAboutData() {
  return client.fetch(`*[_type == "about"][0]{
    title, subtitle, heroImage, content, mission, vision,
    team[] { name, role, image },
    modules[] {
      _type, _key,
      _type == "hero" => { backgroundImage, imageFit, overlayOpacity, "title": title.text, "subtitle": subtitle.text, showButton, buttonText, buttonLink, horizontalPosition, verticalPosition, height },
      _type == "faq" => { sectionLabel, "title": title.text, subtitle, faqs[] { _key, question, "answer": answer.text }, columns, backgroundColor },
      _type == "videoWithText" => { title, layout, "titleRichText": titleRichText.text, "descriptionRichText": descriptionRichText.text, videoUrl, videoType, videoThumbnail, backgroundColor },
      _type == "featuresSection" => { sectionTitle, "title": title.text, subtitle, features[] { _key, icon, title, description, backgroundColor }, backgroundColor },
      _type == "imageTextSection" => { "title": title.text, subtitle, sections[] { _key, layout, "title": title.text, "description": description.text, image, imageAlt, buttonText, buttonLink }, backgroundColor },
      _type == "imageGallery" => { sectionLabel, "title": title.text, subtitle, images[] { _key, asset, alt, caption }, columns, gap, backgroundColor },
      _type == "contentBox" => { sectionLabel, "title": title.text, subtitle, boxes[] { _key, layout, image, imageAlt, "boxTitle": boxTitle.text, "boxDescription": boxDescription.text, features, buttonText, buttonLink, backgroundColor, roundedCorners }, sectionBackground },
      _type == "cardGrid" => { sectionLabel, "title": title.text, subtitle, cards[] { _key, image, imageAlt, cardTitle, cardDescription, link, backgroundColor }, sectionBackground },
      _type == "contactForm" => { sectionLabel, "title": title.text, subtitle, contactImage, backgroundColor, showInfo, email, phone, address },
      _type == "timeline" => { sectionLabel, "title": title.text, subtitle, steps[] { _key, stepNumber, title, description, image }, backgroundColor },
      _type == "partnerSlider" => { sectionLabel, "title": title.text, subtitle, logos[] { _key, image, name, link }, backgroundColor },
      _type == "stepsCard" => { sectionLabel, "title": title.text, subtitle, steps[] { _key, stepNumber, title, description, icon }, backgroundColor },
      _type == "testimonial" => { sectionLabel, "title": title.text, subtitle, testimonials[] { _key, name, role, avatar, rating, quote }, backgroundColor },
      _type == "featuredProduct" => { sectionLabel, "title": title.text, subtitle, product-> { _id, title, slug, price, compareAtPrice, "images": images[] { _key, asset->, alt }, features, stock, tags, quoteSettings }, layout, showFeatures, backgroundColor }
    },
    seo
  }`);
}

export default async function AboutPage() {
  const about = await getAboutData();

  if (!about) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">About page not configured yet.</p></div>;
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gray-900 overflow-hidden">
        {about.heroImage && <Image src={urlFor(about.heroImage).width(1920).height(600).url()} alt="About" fill className="object-cover opacity-50" priority sizes="100vw" />}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">{about.title}</h1>
            {about.subtitle && <p className="text-xl opacity-80 max-w-2xl">{about.subtitle}</p>}
          </div>
        </div>
      </section>

      {/* Modules */}
      {about.modules?.map((module: any) => {
        if (module._type === 'hero') return <Hero key={module._key} {...module} />;
        if (module._type === 'videoWithText') return <VideoWithText key={module._key} {...module} />;
        if (module._type === 'featuresSection') return <FeaturesSection key={module._key} {...module} />;
        if (module._type === 'imageTextSection') return <ImageTextSection key={module._key} {...module} />;
        if (module._type === 'imageGallery') return <ImageGallery key={module._key} {...module} />;
        if (module._type === 'contentBox') return <ContentBoxes key={module._key} {...module} />;
        if (module._type === 'cardGrid') return <CardGrid key={module._key} {...module} />;
        if (module._type === 'contactForm') return <ContactForm key={module._key} {...module} />;
        if (module._type === 'faq') return <FAQ key={module._key} {...module} />;
        if (module._type === 'timeline') return <Timeline key={module._key} {...module} />;
        if (module._type === 'partnerSlider') return <PartnerSlider key={module._key} {...module} />;
        if (module._type === 'stepsCard') return <StepsCard key={module._key} {...module} />;
        if (module._type === 'testimonial') return <Testimonial key={module._key} {...module} />;
        if (module._type === 'featuredProduct') return <FeaturedProduct key={module._key} {...module} />;
        return null;
      })}

      {/* Mission & Vision (Legacy) */}
      {(about.mission || about.vision) && (
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-10">
            {about.mission && <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100"><Target className="w-10 h-10 text-amber-600 mb-4" /><h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2><p className="text-gray-700">{about.mission}</p></div>}
            {about.vision && <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100"><Eye className="w-10 h-10 text-blue-600 mb-4" /><h2 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h2><p className="text-gray-700">{about.vision}</p></div>}
          </div>
        </section>
      )}

      {/* Legacy Content */}
      {about.content && (
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <PortableText value={about.content} />
        </section>
      )}

      {/* Legacy Team */}
      {about.team?.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12"><Users className="w-10 h-10 text-amber-600 mx-auto mb-4" /><h2 className="text-3xl font-bold text-gray-900">Our Team</h2></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {about.team.map((member: any) => (
                <div key={member._key} className="bg-white rounded-2xl p-6 text-center shadow-md border border-gray-100">
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                    {member.image ? <Image src={urlFor(member.image).width(200).height(200).url()} alt={member.name} fill className="object-cover" sizes="96px" /> : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-amber-500">{member.name?.charAt(0)}</div>}
                  </div>
                  <h3 className="font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}