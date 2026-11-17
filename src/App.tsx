import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { updateSeo } from './lib/seo';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Accommodation } from './components/sections/Accommodation';
import { Amenities } from './components/sections/Amenities';
import { Gallery } from './components/gallery/Gallery';
import { Pricing } from './components/sections/Pricing';
import { Contact } from './components/sections/Contact';

export default function App() {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    updateSeo(i18n.language === 'en' ? 'en' : 'bg');
  }, [i18n.language]);
  useEffect(() => {
    if (window.location.pathname === '/') {
      try {
        if (localStorage.getItem('bananov-rai-language') === 'en') {
          void i18n.changeLanguage('en');
          window.history.replaceState({}, '', `/en/${window.location.hash}`);
        }
      } catch {
        /* Optional preference. */
      }
    }
    const onPop = () => {
      void i18n.changeLanguage(window.location.pathname.startsWith('/en') ? 'en' : 'bg');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [i18n]);
  return (
    <>
      <a
        href="#main"
        className="skip-link"
      >
        {t('nav.skip')}
      </a>
      <Header />
      <main
        id="main"
        tabIndex={-1}
      >
        <Hero />
        <Suspense fallback={null}>
          <About />
        </Suspense>
        <Suspense fallback={null}>
          <Accommodation />
        </Suspense>
        <Suspense fallback={null}>
          <Amenities />
        </Suspense>
        <Suspense fallback={null}>
          <Gallery />
        </Suspense>
        <Suspense fallback={null}>
          <Pricing />
        </Suspense>
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
