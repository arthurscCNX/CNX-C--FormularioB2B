'use client';

import { useEffect, useRef, useState } from 'react';
import { stats } from '@/content/stats';
import s from './styles.module.css';

const DURACAO_CONTAGEM = 2200;
const INTERVALO_CARROSSEL = 2800;
const LARGURA_MOBILE = 768;

const icones = [
  <g key="membros">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </g>,
  <g key="parceiros">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </g>,
  <g key="economia">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </g>,
];

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/** Conta de zero até o valor quando entra na tela, uma única vez. */
function Contador({ valor }: { valor: number }) {
  const alvo = useRef<HTMLSpanElement>(null);
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    const el = alvo.current;
    if (!el) return;

    let quadro = 0;
    const observador = new IntersectionObserver(
      (entradas) => {
        const entrada = entradas[0];
        if (!entrada?.isIntersecting) return;
        observador.unobserve(el);

        let inicio: number | null = null;
        const passo = (ts: number) => {
          inicio ??= ts;
          const progresso = Math.min((ts - inicio) / DURACAO_CONTAGEM, 1);
          setAtual(valor * easeOutQuart(progresso));
          if (progresso < 1) quadro = requestAnimationFrame(passo);
          else setAtual(valor);
        };
        quadro = requestAnimationFrame(passo);
      },
      { threshold: 0.4 },
    );

    observador.observe(el);
    return () => {
      observador.disconnect();
      cancelAnimationFrame(quadro);
    };
  }, [valor]);

  return (
    <span ref={alvo} className={`${s['num-count']} ${s.visible}`}>
      {Math.floor(atual).toLocaleString('pt-BR')}
    </span>
  );
}

export default function Numbers() {
  const trilho = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);

  // Carrossel automático, só em tela estreita. Pausa ao tocar.
  useEffect(() => {
    const el = trilho.current;
    if (!el) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    let indice = 0;

    const irPara = (i: number) => {
      indice = (i + stats.length) % stats.length;
      const item = el.children[indice] as HTMLElement | undefined;
      if (!item) return;
      el.scrollTo({
        left: item.offsetLeft - el.offsetWidth / 2 + item.offsetWidth / 2,
        behavior: 'smooth',
      });
      setAtivo(indice);
    };

    const comecar = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(() => irPara(indice + 1), INTERVALO_CARROSSEL);
    };
    const parar = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    const aoSoltar = () => {
      setTimeout(() => {
        const centro = el.scrollLeft + el.offsetWidth / 2;
        let maisPerto = 0;
        let menorDistancia = Infinity;
        Array.from(el.children).forEach((filho, i) => {
          const item = filho as HTMLElement;
          const d = Math.abs(item.offsetLeft + item.offsetWidth / 2 - centro);
          if (d < menorDistancia) {
            menorDistancia = d;
            maisPerto = i;
          }
        });
        indice = maisPerto;
        setAtivo(maisPerto);
        comecar();
      }, 400);
    };

    let noMobile = false;
    const conferir = () => {
      const agoraMobile = window.innerWidth <= LARGURA_MOBILE;
      if (agoraMobile && !noMobile) {
        noMobile = true;
        irPara(0);
        comecar();
      }
      if (!agoraMobile && noMobile) {
        noMobile = false;
        parar();
      }
    };

    el.addEventListener('touchstart', parar, { passive: true });
    el.addEventListener('touchend', aoSoltar, { passive: true });
    window.addEventListener('resize', conferir);
    conferir();

    return () => {
      parar();
      el.removeEventListener('touchstart', parar);
      el.removeEventListener('touchend', aoSoltar);
      window.removeEventListener('resize', conferir);
    };
  }, []);

  return (
    <section className={s['numbers-section']} id="numbersSection">
      <div className={s['numbers-inner']} ref={trilho}>
        {stats.map((stat, i) => (
          <div className={s['number-item']} key={stat.rotulo}>
            <div className={s['number-icon']}>
              <svg viewBox="0 0 24 24">{icones[i]}</svg>
            </div>
            <div className={s['number-value']}>
              {stat.prefixo && (
                <span className={s['num-prefix']}>{stat.prefixo}</span>
              )}
              {stat.sufixo && (
                <span className={s['num-suffix']}>{stat.sufixo}</span>
              )}
              <Contador valor={stat.valor} />
            </div>
            <p className={s['number-label']}>{stat.rotulo}</p>
          </div>
        ))}
      </div>

      {/* os pontos só aparecem no celular, via CSS */}
      <div className={s['carousel-dots']}>
        {stats.map((stat, i) => (
          <div
            key={stat.rotulo}
            className={`${s['carousel-dot']} ${i === ativo ? s.active : ''}`}
          />
        ))}
      </div>
    </section>
  );
}
