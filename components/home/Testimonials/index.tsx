'use client';

import { useEffect, useRef, useState } from 'react';
import { testimonials, reputacao } from '@/content/testimonials';
import { stats } from '@/content/stats';
import s from './styles.module.css';

/** Atraso de entrada de cada cartão, na ordem em que aparecem. */
const ATRASO_CARTAO = 150;
/** Depois disso o atraso é zerado, para o hover responder na hora. */
const LIMPA_ATRASO = 900;
const ATRASO_CTA = 600;

const Estrela = () => (
  <svg viewBox="0 0 24 24">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const estrelas = (quantas: number) =>
  Array.from({ length: quantas }, (_, i) => <Estrela key={i} />);

export default function Testimonials() {
  const secao = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);
  const [ctaVisivel, setCtaVisivel] = useState(false);
  const [semAtraso, setSemAtraso] = useState(false);

  const membros = stats[0];

  useEffect(() => {
    const el = secao.current;
    if (!el) return;

    const tempos: ReturnType<typeof setTimeout>[] = [];
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas[0]?.isIntersecting) return;
        observador.disconnect();
        setVisivel(true);
        tempos.push(setTimeout(() => setCtaVisivel(true), ATRASO_CTA));
        tempos.push(setTimeout(() => setSemAtraso(true), LIMPA_ATRASO));
      },
      { threshold: 0.12 },
    );

    observador.observe(el);
    return () => {
      observador.disconnect();
      tempos.forEach(clearTimeout);
    };
  }, []);

  const visivelSe = (cond: boolean) => (cond ? s['is-visible'] : '');

  return (
    <section className={s['reviews-section']} id="reviewsSection" ref={secao}>
      <div className={s['reviews-inner']}>
        <div className={`${s['reviews-header']} ${visivelSe(visivel)}`}>
          <h2>
            Quem já é membro, <span>aprova</span>
          </h2>
          <p>
            Mais de {membros.valor} pessoas já transformaram como aproveitam
            Goiânia
          </p>
          <div className={s['google-bar']}>
            <div className={s.stars}>{estrelas(5)}</div>
            <span>
              {reputacao.nota.toFixed(1).replace('.', ',')} no {reputacao.fonte}
            </span>
            <span className={s['g-sep']}>·</span>
            <span>+{reputacao.totalAvaliacoes} avaliações</span>
          </div>
        </div>

        <div className={s['reviews-grid']}>
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`${s['review-card']} ${t.destaque ? s.featured : ''} ${visivelSe(visivel)}`}
              style={{
                transitionDelay: semAtraso ? '0ms' : `${i * ATRASO_CARTAO}ms`,
              }}
            >
              <div className={s['review-stars']}>{estrelas(t.nota)}</div>
              <p className={s['review-text']}>&ldquo;{t.texto}&rdquo;</p>
              <div className={s['review-exp']}>
                <svg viewBox="0 0 16 16">
                  <path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4 4.3 12.4l.7-4.1-3-2.9 4.2-.8z" />
                </svg>
                {t.categoria}
              </div>
              <div className={s['review-author']}>
                <div
                  className={s['author-avatar']}
                  style={{ background: t.corAvatar }}
                >
                  {t.iniciais}
                </div>
                <div className={s['author-info']}>
                  <span className={s['author-name']}>{t.nome}</span>
                  <span className={s['author-plan']}>{t.plano}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`${s['reviews-cta']} ${visivelSe(ctaVisivel)}`}>
          <p>
            Junte-se a {membros.sufixo}
            {membros.valor} membros que já estão curtindo mais por menos
          </p>
          <a href="#plansSection" className={s['btn-solid']}>
            Quero ser membro
            <svg viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
