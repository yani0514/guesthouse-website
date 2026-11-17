import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { PropertyImage } from '../../types/property';
import { Photo } from '../ui/Photo';

export default function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: PropertyImage[];
  initialIndex: number;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();
  const [index, setIndex] = useState(initialIndex);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<number | null>(null);
  const reduced = useReducedMotion();
  const image = images[index];
  const move = (direction: number) =>
    setIndex((current) => (current + direction + images.length) % images.length);
  useEffect(() => {
    const node = dialog.current;
    const previousOverflow = document.body.style.overflow;
    node?.showModal();
    closeButton.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      node?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-labelledby="lightbox-caption"
      aria-describedby="lightbox-hint"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          move(-1);
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          move(1);
        }
        if (event.key === 'Tab') {
          const controls = event.currentTarget.querySelectorAll<HTMLButtonElement>('button');
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }}
    >
      <div className="lightbox-top">
        <span aria-live="polite">
          {t('gallery.position', { current: index + 1, total: images.length })}
        </span>
        <button
          ref={closeButton}
          className="icon-button"
          type="button"
          aria-label={t('gallery.close')}
          onClick={onClose}
        >
          <X size={26} />
        </button>
      </div>
      <div
        className="lightbox-stage"
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current !== null) {
            const difference = event.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(difference) > 60) move(difference < 0 ? 1 : -1);
            touchStart.current = null;
          }
        }}
      >
        <button
          className="icon-button lightbox-previous"
          type="button"
          onClick={() => move(-1)}
          aria-label={t('gallery.previous')}
        >
          <ChevronLeft size={28} />
        </button>
        <motion.figure
          key={image.id}
          initial={{ opacity: reduced ? 1 : 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
        >
          <Photo
            image={image}
            sizes="90vw"
            priority
          />
          <figcaption
            id="lightbox-caption"
            aria-live="polite"
          >
            {image.alt[i18n.language === 'en' ? 'en' : 'bg']}
          </figcaption>
        </motion.figure>
        <button
          className="icon-button lightbox-next"
          type="button"
          onClick={() => move(1)}
          aria-label={t('gallery.next')}
        >
          <ChevronRight size={28} />
        </button>
      </div>
      <p
        id="lightbox-hint"
        className="lightbox-hint"
      >
        {t('gallery.hint')}
      </p>
    </dialog>
  );
}
