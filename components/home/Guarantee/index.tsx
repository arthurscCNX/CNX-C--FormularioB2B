'use client';

import { useEffect, useRef, useState } from 'react';
import s from './styles.module.css';

export default function Guarantee() {
  const secao = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = secao.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas[0]?.isIntersecting) return;
        observador.disconnect();
        setVisivel(true);
      },
      { threshold: 0.2 },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <section className={s['guarantee-section']} id="guaranteeSection" ref={secao}>
      <div
        className={`${s['guarantee-inner']} ${visivel ? s['is-visible'] : ''}`}
      >
        <div className={s['guarantee-icon']}>
          <svg viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <div className={s['guarantee-text']}>
          <h3>
            Garantia de <span>7 dias</span> sem risco
          </h3>
          <p>
            Assine hoje, explore as experiências e se por qualquer motivo você
            não ficar satisfeito nos primeiros 7 dias, devolvemos 100% do seu
            dinheiro. Sem perguntas, sem burocracia. Você não tem nada a perder.
          </p>
        </div>
      </div>
    </section>
  );
}
