// src/app/pages/[slug]/page.tsx
import { PortableText } from '@portabletext/react';
import { client } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import Hero from '@/components/Hero';
import VideoWithText from '@/components/VideoWithText';
import FeaturesSection from '@/components/FeaturesSection';
import FeaturedCollections from '@/components/FeaturedCollections';
import ImageTextSection from '@/components/ImageTextSection';
import PopularProducts from '@/components/PopularProducts';
import ImageGallery from '@/components/ImageGallery';
import ContentBoxes from '@/components/ContentBoxes';
import CardGrid from '@/components/CardGrid';
import ContactForm from '@/components/ContactForm';
import CollectionProducts from '@/components/CollectionProducts';
import FAQ from '@/components/FAQ';
import FeaturedProduct from '@/components/FeaturedProduct';
import Timeline from '@/components/Timeline';
import PartnerSlider from '@/components/PartnerSlider';
import StepsCard from '@/components/StepsCard';
import Testimonial from '@/components/Testimonial';
export const dynamic = 'force-dynamic';
async function getPageData(slug: string) {
  return client.fetch(`
    *[_type == "page" && slug.current == $slug][0] {
      _id, title, slug, showHero,
      hero {
        backgroundImage, imageFit, overlayOpacity, title, subtitle,
        showButton, buttonText, buttonLink, horizontalPosition, verticalPosition, height
      },
      body,
      modules[] {
        _type, _key,
        _type == "hero" => { backgroundImage, imageFit, overlayOpacity, title, subtitle, showButton, buttonText, buttonLink, horizontalPosition, verticalPosition, height },
        _type == "faq" => { sectionLabel, "title": title.text, subtitle, faqs[] { _key, question, "answer": answer.text }, columns, backgroundColor },
        _type == "videoWithText" => { title, layout, "titleRichText": titleRichText.text, "descriptionRichText": descriptionRichText.text, videoUrl, videoType, videoThumbnail, backgroundColor },
        _type == "featuresSection" => { sectionTitle, "title": title.text, subtitle, features[] { _key, icon, title, description, backgroundColor }, backgroundColor },
        _type == "featuredCollections" => { sectionLabel, "title": title.text, subtitle, collections[]-> { _id, title, slug, description, image, "products": products[]-> { _id, title } }, layout, backgroundColor },
        _type == "imageTextSection" => { "title": title.text, subtitle, sections[] { _key, layout, "title": title.text, "description": description.text, image, imageAlt, buttonText, buttonLink }, backgroundColor },
        _type == "popularProducts" => { sectionLabel, "title": title.text, subtitle, products[]-> { _id, title, slug, price, compareAtPrice, "images": images[] { _key, asset->, alt }, "image": images[0], features, stock, tags, quoteSettings }, showViewAll, viewAllText, backgroundColor },
        _type == "imageGallery" => { sectionLabel, "title": title.text, subtitle, images[] { _key, asset, alt, caption }, columns, gap, backgroundColor },
        _type == "collectionProducts" => { sectionLabel, "title": title.text, subtitle, productsPerPage, backgroundColor },
        _type == "contentBox" => { sectionLabel, "title": title.text, subtitle, boxes[] { _key, layout, image, imageAlt, "boxTitle": boxTitle.text, "boxDescription": boxDescription.text, features, buttonText, buttonLink, backgroundColor, roundedCorners }, sectionBackground },
        _type == "cardGrid" => { sectionLabel, "title": title.text, subtitle, cards[] { _key, image, imageAlt, cardTitle, cardDescription, link, backgroundColor }, sectionBackground },
        _type == "contactForm" => { sectionLabel, "title": title.text, subtitle, contactImage, backgroundColor, showInfo, email, phone, address },
        _type == "featuredProduct" => { sectionLabel, "title": title.text, subtitle, product-> { _id, title, slug, price, compareAtPrice, "images": images[] { _key, asset->, alt }, features, stock, tags, quoteSettings }, layout, showFeatures, backgroundColor },
        _type == "timeline" => { sectionLabel, "title": title.text, subtitle, steps[] { _key, stepNumber, title, description, image }, backgroundColor },
        _type == "partnerSlider" => { sectionLabel, "title": title.text, subtitle, logos[] { _key, image, name, link }, backgroundColor },
        _type == "stepsCard" => { sectionLabel, "title": title.text, subtitle, steps[] { _key, stepNumber, title, description, icon }, backgroundColor },
        _type == "testimonial" => { sectionLabel, "title": title.text, subtitle, testimonials[] { _key, name, role, avatar, rating, quote }, backgroundColor }
      }
    }
  `, { slug });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageData(slug);
  if (!page) notFound();

  return (
    <main className="min-h-screen bg-white">
      {page.showHero && page.hero && <Hero {...page.hero} />}

      {!page.showHero && (
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900">{page.title}</h1>
          </div>
        </div>
      )}

      {page.modules?.map((module: any) => {
        if (module._type === 'hero') return <Hero key={module._key} {...module} />;
        if (module._type === 'videoWithText') return <VideoWithText key={module._key} {...module} />;
        if (module._type === 'featuresSection') return <FeaturesSection key={module._key} {...module} />;
        if (module._type === 'featuredCollections') return <FeaturedCollections key={module._key} {...module} />;
        if (module._type === 'imageTextSection') return <ImageTextSection key={module._key} {...module} />;
        if (module._type === 'popularProducts') return <PopularProducts key={module._key} {...module} />;
        if (module._type === 'imageGallery') return <ImageGallery key={module._key} {...module} />;
        if (module._type === 'contentBox') return <ContentBoxes key={module._key} {...module} />;
        if (module._type === 'cardGrid') return <CardGrid key={module._key} {...module} />;
        if (module._type === 'contactForm') return <ContactForm key={module._key} {...module} />;
        if (module._type === 'collectionProducts') return <CollectionProducts key={module._key} {...module} products={[]} />;
        if (module._type === 'faq') return <FAQ key={module._key} {...module} />;
        if (module._type === 'featuredProduct') return <FeaturedProduct key={module._key} {...module} />;
        if (module._type === 'timeline') return <Timeline key={module._key} {...module} />;
        if (module._type === 'partnerSlider') return <PartnerSlider key={module._key} {...module} />;
        if (module._type === 'stepsCard') return <StepsCard key={module._key} {...module} />;
        if (module._type === 'testimonial') return <Testimonial key={module._key} {...module} />;
        return null;
      })}

      {page.body && (
        <div className="max-w-4xl mx-auto px-4 py-16">
          <PortableText value={page.body} />
        </div>
      )}
    </main>
  );
}