'use client';

import { useEffect, useRef, useState } from 'react';
import s from './styles.module.css';

/** Atraso entre a entrada de um passo e a do seguinte. */
const ATRASO_PASSO = 180;
/** Atraso extra do número dentro do círculo. */
const ATRASO_NUMERO = 200;
const ATRASO_ICONE = 120;

const passos = [
  {
    nome: 'Assine',
    descricao: 'Faça sua assinatura e escolha o melhor plano para você.',
    destaque: false,
    icone: (
      <>
        <rect
          x="10"
          y="14"
          width="60"
          height="38"
          rx="4"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2.5"
        />
        <path
          d="M28 52v8M52 52v8M22 60h36"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect x="18" y="22" width="20" height="14" rx="2" fill="#FF6B00" opacity="0.8" />
        <rect x="42" y="22" width="20" height="6" rx="1.5" fill="rgba(255,255,255,0.25)" />
        <rect x="42" y="32" width="14" height="4" rx="1.5" fill="rgba(255,255,255,0.15)" />
      </>
    ),
  },
  {
    nome: 'Encontre experiências',
    descricao: 'Escolha qual experiência você quer curtir hoje.',
    destaque: true,
    icone: (
      <>
        <rect x="8" y="18" width="46" height="32" rx="3" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" />
        <rect x="14" y="24" width="16" height="10" rx="2" fill="#FF6B00" opacity="0.9" />
        <rect x="34" y="24" width="14" height="4" rx="1.5" fill="rgba(255,255,255,0.25)" />
        <rect x="34" y="32" width="10" height="4" rx="1.5" fill="rgba(255,255,255,0.15)" />
        <rect x="14" y="38" width="34" height="4" rx="1.5" fill="rgba(255,255,255,0.10)" />
        <circle cx="62" cy="46" r="7" stroke="#FF6B00" strokeWidth="2" />
        <path d="M58 46c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#FF6B00" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M62 46v4" stroke="#FF6B00" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M58 56l2-4h4l2 4"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    nome: 'Resgate o card',
    descricao:
      'Você vai precisar dele na hora da experiência (pode ser print no celular).',
    destaque: false,
    icone: (
      <>
        <rect x="10" y="24" width="48" height="32" rx="4" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" />
        <rect x="10" y="32" width="48" height="8" fill="rgba(255,255,255,0.08)" />
        <rect x="18" y="44" width="16" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
        <rect x="38" y="44" width="10" height="4" rx="2" fill="#FF6B00" opacity="0.7" />
        <rect x="54" y="14" width="10" height="8" rx="1" stroke="#FF6B00" strokeWidth="1.8" />
        <path d="M59 14v8M54 17h10" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    nome: 'Curta a experiência',
    descricao: null,
    destaque: true,
    icone: (
      <>
        <rect x="20" y="46" width="40" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
        <path d="M24 50v10M56 50v10" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="28" cy="28" r="6" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
        <path d="M20 46c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="52" cy="28" r="6" stroke="#FF6B00" strokeWidth="2" />
        <path d="M44 46c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="44" r="3" fill="#FF6B00" opacity="0.6" />
      </>
    ),
  },
];

export default function HowItWorks() {
  const secao = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);
  const [ctaVisivel, setCtaVisivel] = useState(false);

  useEffect(() => {
    const el = secao.current;
    if (!el) return;

    let tempo: ReturnType<typeof setTimeout>;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas[0]?.isIntersecting) return;
        observador.disconnect();
        setVisivel(true);
        // o CTA entra depois do último passo
        tempo = setTimeout(
          () => setCtaVisivel(true),
          passos.length * ATRASO_PASSO + 400,
        );
      },
      { threshold: 0.15 },
    );

    observador.observe(el);
    return () => {
      observador.disconnect();
      clearTimeout(tempo);
    };
  }, []);

  const visivelSe = (cond: boolean) => (cond ? s['is-visible'] : '');

  return (
    <section className={s['how-section']} id="howSection" ref={secao}>
      <div className={s['how-inner']}>
        <h2 className={`${s['how-title']} ${visivelSe(visivel)}`}>
          Como funciona?
        </h2>

        <div className={s['steps-wrapper']}>
          <svg
            className={`${s['dashed-path']} ${visivelSe(visivel)}`}
            viewBox="0 0 1200 220"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M 150 110 C 200 50, 250 170, 300 110 C 350 50, 400 170, 450 110 C 500 50, 550 170, 600 110 C 650 50, 700 170, 750 110 C 800 50, 850 170, 900 110 C 950 50, 1000 170, 1050 110"
              stroke="#FF6B00"
              strokeWidth="2"
              strokeDasharray="10 8"
              strokeOpacity="0.4"
            />
            <circle cx="100" cy="110" r="6" fill="#FF6B00" opacity="0.7" />
            <circle cx="1100" cy="110" r="6" fill="#FF6B00" opacity="0.7" />
          </svg>

          {passos.map((passo, i) => {
            const base = i * ATRASO_PASSO;
            return (
              <div
                key={passo.nome}
                className={`${s.step} ${passo.destaque ? s.featured : ''} ${visivelSe(visivel)}`}
                style={{ transitionDelay: `${base}ms` }}
              >
                <div className={s['step-circle']}>
                  <div
                    className={s['step-number']}
                    style={{ transitionDelay: `${base + ATRASO_NUMERO}ms` }}
                  >
                    {i + 1}
                  </div>
                  <div
                    className={s['step-icon']}
                    style={{ transitionDelay: `${base + ATRASO_ICONE}ms` }}
                  >
                    <svg viewBox="0 0 80 80" fill="none">
                      {passo.icone}
                    </svg>
                  </div>
                </div>
                <p className={s['step-name']}>{passo.nome}</p>
                <p className={s['step-desc']}>
                  {passo.descricao ?? (
                    <>
                      Depois compartilhe conosco por{' '}
                      {/* TODO(P10): o legado trazia link morto aqui e o perfil
                          real do Instagram ainda não foi informado. */}
                      <a href="#">instagram</a>{' '}
                      ou{' '}
                      <a href="mailto:contato@curtamais.com.br">
                        contato@curtamais.com.br
                      </a>
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </div>

        <div className={`${s['how-cta']} ${visivelSe(ctaVisivel)}`}>
          <p>
            Entre para o Clube Curta Mais e tenha acesso a infinitas
            experiências
          </p>
          <a href="#plansSection" className={s['btn-cta']}>
            Assine agora
            <svg viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
