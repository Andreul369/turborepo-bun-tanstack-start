import { createFileRoute } from '@tanstack/react-router';
import { blogPosts } from '@/assets/data/blog-posts';
import Blog from '@/components/blocks/blog-component/blog-component';
import CTA from '@/components/blocks/cta-section/cta-section';
import HeroSection from '@/components/blocks/hero-section/hero-section';
import Footer from '@/components/footer';
import Header from '@/components/header';
// import { ThemeToggle } from '@/components/theme-toggle';

export const Route = createFileRoute('/')({ component: App });

const navigationData = [
  {
    title: 'Home',
    href: '/#home',
  },
  {
    title: 'Categories',
    href: '/#categories',
  },
  {
    title: 'Team',
    href: '#',
  },
  {
    title: 'About Us',
    href: '#',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL}#website`,
      name: 'Ink - Blog Landing Page',
      description:
        'Ink is a free Shadcn UI Blog Landing Page template to publish articles, insights, and categories with a clean, fast, and readable layout.',
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      inLanguage: 'en-US',
    },
  ],
};

function App() {
  return (
    <>
      <Header navigationData={navigationData} />

      <main className="flex flex-col">
        <HeroSection blogData={blogPosts} />
        <Blog />
        <CTA />
        {/* Add JSON-LD to your page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </main>

      <Footer />
    </>
  );
}
