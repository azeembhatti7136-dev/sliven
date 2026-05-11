// src/app/page.tsx

import { client } from '@/lib/sanity';

import Hero from '@/components/Hero';
import Link from 'next/link';

import VideoWithText from '@/components/VideoWithText';
import FeaturesSection from '@/components/FeaturesSection';
import FeaturedCollections from '@/components/FeaturedCollections';
import ImageTextSection from '@/components/ImageTextSection';
import PopularProducts from '@/components/PopularProducts';
import ImageGallery from '@/components/ImageGallery';
import ContentBoxes from '@/components/ContentBoxes';
import CardGrid from '@/components/CardGrid';
import ContactForm from '@/components/ContactForm';
import FeaturedProduct from '@/components/FeaturedProduct';
import FAQ from '@/components/FAQ';
import Timeline from '@/components/Timeline';
import PartnerSlider from '@/components/PartnerSlider';
import StepsCard from '@/components/StepsCard';
import Testimonial from '@/components/Testimonial';


export const dynamic = 'force-dynamic';
export const revalidate = 0;


// Fetch home page data
async function getHomePage() {
  return client.fetch(`
    *[_type == "home"][0] {
      hero {
        backgroundImage,
        overlayOpacity,
        title,
        subtitle,
        showButton,
        buttonText,
        buttonLink,
        textAlignment,
        height
      },
      modules[] {
        _type,
        _key,
        _type == "videoWithText" => {
          title,
          layout,
          "titleRichText": titleRichText.text,
          "descriptionRichText": descriptionRichText.text,
          videoUrl,
          videoType,
          videoThumbnail,
          backgroundColor
        },
        _type == "featuresSection" => {
          sectionTitle,
          "title": title.text,
          subtitle,
          features[] {
            _key,
            icon,
            title,
            description,
            backgroundColor
          },
          backgroundColor
        },
        _type == "testimonial" => {
  sectionLabel,
  "title": title.text,
  subtitle,
  testimonials[] { _key, name, role, avatar, rating, quote },
  backgroundColor
},
        _type == "stepsCard" => {
  sectionLabel,
  "title": title.text,
  subtitle,
  steps[] { _key, stepNumber, title, description, icon },
  backgroundColor
},
        _type == "timeline" => {
  sectionLabel,
  "title": title.text,
  subtitle,
  steps[] { _key, stepNumber, title, description, image },
  backgroundColor
},
        _type == "faq" => {
  sectionLabel,
  "title": title.text,
  subtitle,
  faqs[] {
    _key,
    question,
    "answer": answer.text
  },
  columns,
  backgroundColor
},
        _type == "imageTextSection" => {
  "title": title.text,
  subtitle,
  backgroundImage,      // 👈 ADD
  backgroundOpacity, 
  sections[] {
    _key,
    layout,
    "title": title.text,
    "description": description.text,
    image,
    imageAlt,
    buttonText,
    buttonLink
  },
  backgroundColor
},
_type == "contactForm" => {
  sectionLabel,
  "title": title.text,
  subtitle,
  contactImage,
  backgroundColor,
  showInfo,
  email,
  phone,
  address
},
_type == "imageGallery" => {
  sectionLabel,
  "title": title.text,
  subtitle,
  images[] {
    _key,
    asset,
    alt,
    caption
  },
  columns,
  gap,
  backgroundColor
},
_type == "popularProducts" => {
  sectionLabel,
  "title": title.text,
  subtitle,
  products[]-> {
    _id,
    title,
    name,
    slug,
    price,
    compareAtPrice,
    "images": images[] {
      _key,
      asset->,
      alt
    },
    "image": images[0],
    features,
    stock,
    tags,
    quoteSettings
  },
  showViewAll,
  viewAllText,
  backgroundColor
},
_type == "contentBox" => {
  sectionLabel,
  "title": title.text,
  subtitle,
  boxes[] {
    _key,
    layout,
    image,
    imageAlt,
    "boxTitle": boxTitle.text,
    "boxDescription": boxDescription.text,
    features,
    buttonText,
    buttonLink,
    backgroundColor,
    roundedCorners
  },
  sectionBackground
},
        _type == "featuredCollections" => {
  sectionLabel,
  "title": title.text,
  subtitle,
  collections[]-> {
    _id,
    title,
    slug,
    description,
    image,
    "products": products[]-> {
      _id,
      title
    }
  },
  layout,
  backgroundColor
},
_type == "featuredProduct" => {
  sectionLabel,
  "title": title.text,
  subtitle,
  product-> {
    _id,
    title,
    name,
    slug,
    sku,
    price,
    compareAtPrice,
    "images": images[] { _key, asset->, alt },
    description,
    features,
    stock,
    tags,
    quoteSettings
  },
  layout,
  showFeatures,
  showFullDescription,
  backgroundColor
},
_type == "cardGrid" => {
  sectionLabel,
  "title": title.text,
  subtitle,
  cards[] {
    _key,
    image,
    imageAlt,
    cardTitle,
    cardDescription,
    link,
    backgroundColor
  },
  sectionBackground
},
_type == "partnerSlider" => {
  sectionLabel,
  "title": title.text,
  subtitle,
  logos[] { _key, image, name, link },
  backgroundColor
},
        _type == "hero" => {
          backgroundImage,
          overlayOpacity,
          "title": title.text,        // 👈 Rich text
          "subtitle": subtitle.text,  // 👈 Rich text
          showButton,
          buttonText,
          buttonLink,
          textAlignment,
          height
        }
          
      }
    }
  `);
}

export default async function Home() {
  const homePage = await getHomePage();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      

      {/* Dynamic Hero from Sanity */}
      {homePage?.hero ? (
        <Hero {...homePage.hero} />
      ) : (
        <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              Get Custom Quotes for
              <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mt-2">
                Bulk Orders
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our products and request personalized quotes for your business needs.
            </p>
          </div>
        </section>
      )}

      {/* Render Modules */}
      {homePage?.modules?.map((module: any) => {
  if (module._type === 'featuresSection') {
    return <FeaturesSection key={module._key} {...module} />;
  }
  if (module._type === 'videoWithText') {
    return <VideoWithText key={module._key} {...module} />;
  }
  if (module._type === 'hero') {
    return <Hero key={module._key} {...module} />;
  }
  if (module._type === 'featuredCollections') {
  return <FeaturedCollections key={module._key} {...module} />;
}
if (module._type === 'imageTextSection') {
  return <ImageTextSection key={module._key} {...module} />;
}
if (module._type === 'popularProducts') {
  return <PopularProducts key={module._key} {...module} />;
}
if (module._type === 'imageGallery') {
  return <ImageGallery key={module._key} {...module} />;
}
if (module._type === 'contentBox') {
  return <ContentBoxes key={module._key} {...module} />;
}
if (module._type === 'cardGrid') {
  return <CardGrid key={module._key} {...module} />;
}
if (module._type === 'contactForm') {
  return <ContactForm key={module._key} {...module} />;
}
if (module._type === 'featuredProduct') {
  return <FeaturedProduct key={module._key} {...module} />;
}
if (module._type === 'faq') {
  return <FAQ key={module._key} {...module} />;
}
if (module._type === 'timeline') return <Timeline key={module._key} {...module} />;
if (module._type === 'partnerSlider') return <PartnerSlider key={module._key} {...module} />;
if (module._type === 'stepsCard') return <StepsCard key={module._key} {...module} />;
if (module._type === 'testimonial') return <Testimonial key={module._key} {...module} />;

  return null;
})}

      

      
      
    </main>
  );
}