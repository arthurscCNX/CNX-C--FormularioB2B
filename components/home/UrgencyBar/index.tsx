'use client';

import { useEffect, useRef, useState } from 'react';
import { economiaAnualPercentual } from '@/content/plans';
import s from './styles.module.css';

const CHAVE_PRAZO = 'urgency_deadline';
const VINTE_E_QUATRO_HORAS = 24 * 60 * 60 * 1000;

/** Valores do HTML legado, usados até o relógio real assumir na montagem. */
const INICIAL = { h: '23', m: '59', s: '47' };

function partes(restante: number) {
  return {
    h: String(Math.floor(restante / 3_600_000)).padStart(2, '0'),
    m: String(Math.floor((restante % 3_600_000) / 60_000)).padStart(2, '0'),
    s: String(Math.floor((restante % 60_000) / 1000)).padStart(2, '0'),
  };
}

export default function UrgencyBar() {
  const barra = useRef<HTMLDivElement>(null);
  const [tempo, setTempo] = useState(INICIAL);
  const [expirado, setExpirado] = useState(false);
  /** No celular a faixa alterna entre o texto e o relógio a cada 4s. */
  const [mostrandoTexto, setMostrandoTexto] = useState(true);

  // Contagem regressiva. O prazo nasce na primeira visita e vive no navegador.
  useEffect(() => {
    let prazo = Number(localStorage.getItem(CHAVE_PRAZO));
    if (!prazo) {
      prazo = Date.now() + VINTE_E_QUATRO_HORAS;
      localStorage.setItem(CHAVE_PRAZO, String(prazo));
    }

    const tique = () => {
      const restante = prazo - Date.now();
      if (restante <= 0) {
        setExpirado(true);
        return;
      }
      setTempo(partes(restante));
    };

    tique();
    const id = setInterval(tique, 1000);
    return () => clearInterval(id);
  }, []);

  // Alternância texto ↔ relógio, só em tela estreita.
  useEffect(() => {
    const id = setInterval(() => {
      if (window.innerWidth > 640) return;
      setMostrandoTexto((v) => !v);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // A altura real da faixa vira --bar-h, que posiciona o cabeçalho flutuante.
  useEffect(() => {
    const medir = () => {
      const altura = barra.current?.offsetHeight ?? 0;
      if (altura) {
        document.documentElement.style.setProperty('--bar-h', `${altura}px`);
      }
    };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [expirado]);

  if (expirado) return null;

  return (
    <div
      ref={barra}
      className={`${s['urgency-bar']} ${mostrandoTexto ? s['show-text'] : s['show-timer']}`}
    >
      <div className={s['urgency-text']}>
        <svg viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        <span>
          <strong>Oferta especial:</strong> Plano anual com{' '}
          {economiaAnualPercentual}% de desconto encerra em
        </span>
      </div>

      <div className={s.countdown}>
        <div className={s['countdown-block']}>
          <span className={s.num}>{tempo.h}</span>
          <span className={s.label}>horas</span>
        </div>
        <span className={s['countdown-sep']}>:</span>
        <div className={s['countdown-block']}>
          <span className={s.num}>{tempo.m}</span>
          <span className={s.label}>min</span>
        </div>
        <span className={s['countdown-sep']}>:</span>
        <div className={s['countdown-block']}>
          <span className={s.num}>{tempo.s}</span>
          <span className={s.label}>seg</span>
        </div>
      </div>

      <a href="#plansSection" className={s['urgency-cta']}>
        Aproveitar →
      </a>
    </div>
  );
}
