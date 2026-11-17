import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Brand } from '../ui/Brand';
import type { Language } from '../../types/property';
import { languagePath } from '../../lib/urls';

const sectionIds = [
  'home',
  'about',
  'accommodation',
  'amenities',
  'gallery',
  'prices',
  'contact',
] as const;

export function Header() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector('a')?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target) &&
        !menuButton.current?.contains(event.target)
      )
        setOpen(false);
    };
    const query = matchMedia('(min-width: 1200px)');
    const onWide = () => {
      if (query.matches) setOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOutside);
    query.addEventListener('change', onWide);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOutside);
      query.removeEventListener('change', onWide);
    };
  }, [open]);

  function changeLanguage(language: Language) {
    if (i18n.language === language) return;
    void i18n.changeLanguage(language);
    window.history.pushState({}, '', languagePath(language, window.location.hash));
    try {
      localStorage.setItem('bananov-rai-language', language);
    } catch {
      /* Storage can be unavailable. */
    }
    setOpen(false);
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner wrap">
        <a
          href="#home"
          className="brand-link"
        >
          <Brand />
        </a>
        <nav
          className="desktop-nav"
          aria-label={t('nav.label')}
        >
          {sectionIds.map((id) => (
            <a
              key={id}
              href={`#${id}`}
            >
              {t(`nav.${id}`)}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <div
            className="language-switch"
            role="group"
            aria-label={t('common.language')}
          >
            {(['bg', 'en'] as const).map((language) => (
              <button
                key={language}
                type="button"
                lang={language}
                aria-label={language === 'bg' ? 'BG — Български' : 'EN — English'}
                aria-pressed={i18n.language === language}
                onClick={() => changeLanguage(language)}
              >
                {language.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            className="header-contact"
            href="#contact"
          >
            {t('nav.contact')}
            <ArrowUpRight size={16} />
          </a>
          <button
            ref={menuButton}
            className="menu-toggle icon-button"
            type="button"
            aria-label={t(open ? 'nav.close' : 'nav.open')}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <nav
        id="mobile-menu"
        ref={menuRef}
        className="mobile-nav"
        hidden={!open}
        aria-label={t('nav.label')}
      >
        {sectionIds.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => {
              setOpen(false);
              document.getElementById(id)?.focus({ preventScroll: true });
            }}
          >
            {t(`nav.${id}`)}
            <ArrowUpRight size={18} />
          </a>
        ))}
      </nav>
    </header>
  );
}
