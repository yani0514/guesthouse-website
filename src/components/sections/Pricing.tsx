import { ArrowUpRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { property } from '../../data/property';

export function Pricing() {
  const { t } = useTranslation();
  const price = property.pricing;
  return (
    <section
      id="prices"
      tabIndex={-1}
      className="section pricing-section"
      aria-labelledby="prices-title"
    >
      <div className="wrap pricing-grid">
        <div>
          <p className="eyebrow">{t('prices.eyebrow')}</p>
          <h2 id="prices-title">{t('prices.title')}</h2>
          <p>{t('prices.detail')}</p>
          <p>{t('prices.groups')}</p>
        </div>
        <div className="price-panel">
          <p className="eyebrow">{t('prices.label')}</p>
          <p className="price-value">
            {price.minIndicativePricePerPerson}–{price.maxIndicativePricePerPerson}
            <span>€</span>
          </p>
          <p className="price-unit">{t('prices.unit')}</p>
          <a
            href="#contact"
            className="button button-primary"
          >
            {t('prices.cta')}
            <ArrowUpRight size={19} />
          </a>
          <p className="payment-note">
            <Check size={17} />
            {t('prices.payment')}
          </p>
        </div>
      </div>
    </section>
  );
}
