import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';
import { Brand } from '../ui/Brand';
import { property } from '../../data/property';

export function Footer() {
  const { t, i18n } = useTranslation();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <a href="#home">
              <Brand />
            </a>
            <p>{t('footer.description')}</p>
          </div>
          <nav
            aria-label={t('nav.label')}
            className="footer-nav"
          >
            {['about', 'accommodation', 'gallery', 'prices', 'contact'].map((id) => (
              <a
                href={`#${id}`}
                key={id}
              >
                {t(`nav.${id}`)}
              </a>
            ))}
          </nav>
          <a
            href="#home"
            className="back-top"
            aria-label={t('common.backTop')}
          >
            <ArrowUp size={22} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()}{' '}
            {i18n.language === 'bg' ? property.nameBg : property.nameEn}. {t('footer.rights')}
          </span>
          <details className="privacy">
            <summary>{t('footer.privacy')}</summary>
            <p>{t('footer.privacyText')}</p>
          </details>
        </div>
      </div>
    </footer>
  );
}
