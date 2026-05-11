// src/app/collections/[slug]/page.tsx
import { client } from '@/lib/sanity';
import ProductCard from '@/components/ProductCard';
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
import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
async function getCollectionData(slug: string) {
  return client.fetch(`
    *[_type == "simpleCollection" && slug.current == $slug][0] {
      _id, title, slug, description, image,
      // 👇 CHANGE THIS - collections array support
      "products": *[_type == "simpleProduct" && references(^._id)] | order(title asc) {
        _id, title, slug, price, compareAtPrice,
        "images": images[] { _key, asset->, alt },
        "image": images[0],
        features, stock, tags, quoteSettings,
        // Sabse pehli collection lo breadcrumb ke liye
        "collection": collections[0]->{_id, title, slug}
      },
      modules[] {
        _type, _key,
        _type == "hero" => { backgroundImage, imageFit, overlayOpacity, title, subtitle, showButton, buttonText, buttonLink, horizontalPosition, verticalPosition, height },
        _type == "faq" => { sectionLabel, "title": title.text, subtitle, faqs[] { _key, question, "answer": answer.text }, columns, backgroundColor },
        _type == "videoWithText" => { title, layout, "titleRichText": titleRichText.text, "descriptionRichText": descriptionRichText.text, videoUrl, videoType, videoThumbnail, backgroundColor },
        _type == "featuresSection" => { sectionTitle, "title": title.text, subtitle, features[] { _key, icon, title, description, backgroundColor }, backgroundColor },
        _type == "featuredCollections" => { sectionLabel, "title": title.text, subtitle, collections[]-> { _id, title, slug, description, image, "products": products[]-> { _id, title } }, layout, backgroundColor },
        _type == "imageTextSection" => { "title": title.text, subtitle, sections[] { _key, layout, "title": title.text, "description": description.text, image, imageAlt, buttonText, buttonLink }, backgroundColor },
        _type == "popularProducts" => { sectionLabel, "title": title.text, subtitle, products[]-> { _id, title, slug, price, compareAtPrice, "images": images[] { _key, asset->, alt }, "image": images[0], features, stock, tags, quoteSettings, "collection": collections[0]->{_id, title, slug} }, showViewAll, viewAllText, backgroundColor },
        _type == "imageGallery" => { sectionLabel, "title": title.text, subtitle, images[] { _key, asset, alt, caption }, columns, gap, backgroundColor },
        _type == "collectionProducts" => { sectionLabel, "title": title.text, subtitle, productsPerPage, backgroundColor },
        _type == "contentBox" => { sectionLabel, "title": title.text, subtitle, boxes[] { _key, layout, image, imageAlt, "boxTitle": boxTitle.text, "boxDescription": boxDescription.text, features, buttonText, buttonLink, backgroundColor, roundedCorners }, sectionBackground },
        _type == "cardGrid" => { sectionLabel, "title": title.text, subtitle, cards[] { _key, image, imageAlt, cardTitle, cardDescription, link, backgroundColor }, sectionBackground },
        _type == "contactForm" => { sectionLabel, "title": title.text, subtitle, contactImage, backgroundColor, showInfo, email, phone, address }
      }
    }
  `, { slug });
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollectionData(slug);
  if (!collection) notFound();

  return (
    <main className="min-h-screen bg-white">
      {collection.modules?.map((module: any) => {
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
        if (module._type === 'collectionProducts') 
  return (
    <CollectionProducts 
      key={module._key} 
      {...module} 
      productsPerPage={8}  // 👈 Force 8 products per page
      products={collection.products || []} 
    />
  );
        if (module._type === 'faq') return <FAQ key={module._key} {...module} />;
        return null;
      })}
    </main>
  );
}

export async function generateStaticParams() {
  const { getAllCollections } = await import('@/lib/queries');
  return (await getAllCollections()).map((c: any) => ({ slug: c.slug.current }));
}