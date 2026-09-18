'use client';

import { useState } from 'react';
import { plans } from '@/content/plans';
import s from './styles.module.css';

/** Gasto médio por ocasião, em reais, e desconto médio do clube na categoria. */
const categorias = [
  {
    id: 'rest',
    rotulo: '🍽️ Refeições / saídas por mês',
    preco: 65,
    desconto: 0.35,
    min: 1,
    max: 12,
    inicial: 4,
    marcas: ['1x', '4x', '8x', '12x'],
  },
  {
    id: 'lazer',
    rotulo: '🎭 Lazer & entretenimento / mês',
    preco: 80,
    desconto: 0.4,
    min: 1,
    max: 8,
    inicial: 2,
    marcas: ['1x', '2x', '4x', '8x'],
  },
  {
    id: 'bem',
    rotulo: '💆 Bem-estar & beleza / mês',
    preco: 90,
    desconto: 0.45,
    min: 0,
    max: 6,
    inicial: 1,
    marcas: ['0x', '1x', '3x', '6x'],
  },
] as const;

const moeda = (n: number) =>
  `R$ ${n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const moedaCentavos = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Calculator() {
  const mensalidade = plans[0].precoMensal;
  const [valores, setValores] = useState<Record<string, number>>(
    Object.fromEntries(categorias.map((c) => [c.id, c.inicial])),
  );

  const semClube = categorias.reduce(
    (total, c) => total + valores[c.id] * c.preco,
    0,
  );
  const economiaBruta = categorias.reduce(
    (total, c) => total + valores[c.id] * c.preco * c.desconto,
    0,
  );
  const economia = Math.max(0, economiaBruta - mensalidade);

  return (
    <section className={s['calc-section']}>
      <div className={s['calc-inner']}>
        <div className={s['calc-text']}>
          <div className={s['calc-badge']}>💰 Calculadora de economia</div>
          <h2>
            Descubra quanto você <span>vai economizar</span> sendo membro
          </h2>
          <p>
            Ajuste os controles ao lado com seus hábitos de consumo e veja em
            tempo real quanto o clube coloca no seu bolso todo mês.
          </p>
        </div>

        <div className={s['calc-card']}>
          {categorias.map((c) => (
            <div className={s['slider-wrap']} key={c.id}>
              <label className={s['calc-label']} htmlFor={`sl-${c.id}`}>
                {c.rotulo}
                <span>{valores[c.id]}x</span>
              </label>
              <input
                id={`sl-${c.id}`}
                type="range"
                min={c.min}
                max={c.max}
                value={valores[c.id]}
                onChange={(e) =>
                  setValores((v) => ({ ...v, [c.id]: Number(e.target.value) }))
                }
              />
              <div className={s['slider-ticks']}>
                {c.marcas.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
          ))}

          <div className={s['calc-divider']} />

          <div className={s['calc-result']}>
            <div className={s['result-row']}>
              <span>Valor que pagaria sem o clube</span>
              <span className={s.value}>{moeda(semClube)}</span>
            </div>
            <div className={s['result-row']}>
              <span>Valor do plano mensal</span>
              <span className={s.value}>{moedaCentavos(mensalidade)}</span>
            </div>
            <div className={s['result-total']}>
              <span className={s.label}>Você economiza</span>
              <span
                className={s.saving}
                style={{
                  color: economia > 0 ? '#FF6B00' : 'rgba(255,255,255,0.4)',
                }}
              >
                {moeda(economia)}
              </span>
            </div>
          </div>

          <a href="#plansSection" className={s['calc-cta']}>
            Quero economizar assim
            <svg viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
