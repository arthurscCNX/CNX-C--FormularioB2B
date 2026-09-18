'use client';

import { useEffect, useRef, useState } from 'react';
import { faq } from '@/content/faq';
import s from './styles.module.css';

const ATRASO_ITEM = 80;

export default function Faq() {
  const secao = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);
  const [semAtraso, setSemAtraso] = useState(false);
  /** Só uma pergunta fica aberta por vez, como no legado. */
  const [aberta, setAberta] = useState<string | null>(null);

  useEffect(() => {
    const el = secao.current;
    if (!el) return;
    let tempo: ReturnType<typeof setTimeout>;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas[0]?.isIntersecting) return;
        observador.disconnect();
        setVisivel(true);
        tempo = setTimeout(
          () => setSemAtraso(true),
          faq.length * ATRASO_ITEM + 500,
        );
      },
      { threshold: 0.08 },
    );
    observador.observe(el);
    return () => {
      observador.disconnect();
      clearTimeout(tempo);
    };
  }, []);

  const visivelSe = (cond: boolean) => (cond ? s['is-visible'] : '');

  return (
    <section className={s['faq-section']} id="faqSection" ref={secao}>
      <div className={s['faq-inner']}>
        <div className={`${s['faq-header']} ${visivelSe(visivel)}`}>
          <h2>Perguntas frequentes</h2>
          <p>Tudo que você precisa saber antes de assinar</p>
        </div>

        <div className={s['faq-list']}>
          {faq.map((item, i) => {
            const estaAberta = aberta === item.id;
            return (
              <div
                key={item.id}
                className={`${s['faq-item']} ${estaAberta ? s.open : ''} ${visivelSe(visivel)}`}
                style={{
                  transitionDelay: semAtraso ? '0ms' : `${i * ATRASO_ITEM}ms`,
                }}
              >
                <button
                  type="button"
                  className={s['faq-question']}
                  aria-expanded={estaAberta}
                  aria-controls={`resposta-${item.id}`}
                  onClick={() => setAberta(estaAberta ? null : item.id)}
                >
                  <span>{item.pergunta}</span>
                  <div className={s['faq-icon']}>
                    <svg viewBox="0 0 24 24">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                </button>
                <div className={s['faq-answer']} id={`resposta-${item.id}`}>
                  <p>{item.resposta}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
