import { useTranslation } from 'react-i18next';
import { property } from '../../data/property';

export function LeafMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 72"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M31 51C12 44 8 24 13 8c18 1 30 16 23 37"
        fill="currentColor"
        opacity=".85"
      />
      <path
        d="M33 48C30 26 43 12 58 14c1 19-8 31-25 34Z"
        fill="currentColor"
      />
      <path
        d="M20 18c8 12 13 27 12 42M49 23C40 33 34 44 32 59"
        stroke="var(--leaf-vein, #f4f0e5)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M12 64c8-6 13 6 21 0s13 6 21 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Brand() {
  const { t, i18n } = useTranslation();
  return (
    <span className="brand">
      <LeafMark />
      <span className="brand-text">
        <strong>{i18n.language === 'bg' ? property.nameBg : property.nameEn}</strong>
        <span>{t('brand.type')}</span>
      </span>
    </span>
  );
}
