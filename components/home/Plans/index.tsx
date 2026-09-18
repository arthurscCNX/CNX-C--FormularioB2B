'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  plans,
  membros,
  economiaAnualPercentual,
  precoFamilia,
  type CicloCobranca,
} from '@/content/plans';
import { whatsappLink } from '@/content/site';
import s from './styles.module.css';

/** Altura de cada célula do rolo, em pixels. Vem do CSS legado. */
const ALTURA_INTEIRO = 68;
const ALTURA_CENTAVOS = 32;
const ATRASO_CARTAO = 180;
const LIMPA_ATRASO = 900;

const [singular, familia] = plans;

const reais = (v: number) => v.toFixed(2).split('.')[0];
const centavos = (v: number) => v.toFixed(2).split('.')[1];
const comVirgula = (v: number) => v.toFixed(2).replace('.', ',');

/**
 * Mostra um número como dígitos que rolam. Cada coluna é uma tira de 0 a 9
 * deslocada para o dígito certo; a transição do CSS faz a rolagem.
 */
function Roller({
  valor,
  altura,
  centavos: ehCentavos = false,
}: {
  valor: string;
  altura: number;
  centavos?: boolean;
}) {
  const col = ehCentavos ? 'cents-col' : 'digit-col';
  const tira = ehCentavos ? 'cents-strip' : 'digit-strip';
  const celula = ehCentavos ? 'cents-cell' : 'digit-cell';
  const proporcaoFonte = ehCentavos ? 0.84 : 0.85;
  const proporcaoLargura = ehCentavos ? 0.72 : 0.62;

  return (
    <>
      {valor.split('').map((digito, i) => (
        <div key={i} className={s[col]} style={{ height: altura }}>
          <div
            className={s[tira]}
            style={{ transform: `translateY(-${Number(digito) * altura}px)` }}
          >
            {Array.from({ length: 10 }, (_, d) => (
              <span
                key={d}
                className={s[celula]}
                style={{
                  lineHeight: `${altura}px`,
                  fontSize: altura * proporcaoFonte,
                  minWidth: altura * proporcaoLargura,
                }}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function Preco({ valor }: { valor: number }) {
  return (
    <div className={s['plan-price']}>
      <span className={s.currency}>R$</span>
      <div className={s['digit-roller']}>
        <Roller valor={reais(valor)} altura={ALTURA_INTEIRO} />
      </div>
      <span className={s['price-sep']}>,</span>
      <div className={s['price-cents']}>
        <div className={s['cents-roller']}>
          <Roller valor={centavos(valor)} altura={ALTURA_CENTAVOS} centavos />
        </div>
      </div>
    </div>
  );
}

const Check = () => (
  <svg viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function Plans() {
  const secao = useRef<HTMLElement>(null);
  const botaoMensal = useRef<HTMLButtonElement>(null);
  const botaoAnual = useRef<HTMLButtonElement>(null);

  const [ciclo, setCiclo] = useState<CicloCobranca>('mensal');
  const [qtdMembros, setQtdMembros] = useState<number>(membros.min);
  const [pilula, setPilula] = useState({ left: 0, width: 0 });
  const [visivel, setVisivel] = useState(false);
  const [semAtraso, setSemAtraso] = useState(false);

  const anual = ciclo === 'anual';

  // Pílula do seletor acompanha a largura real do botão ativo.
  useLayoutEffect(() => {
    const medir = () => {
      const m = botaoMensal.current;
      const a = botaoAnual.current;
      if (!m || !a) return;
      setPilula(
        anual
          ? { left: m.offsetWidth + 4, width: a.offsetWidth }
          : { left: 0, width: m.offsetWidth },
      );
    };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [anual]);

  // Entrada escalonada quando a seção aparece.
  useEffect(() => {
    const el = secao.current;
    if (!el) return;
    let tempo: ReturnType<typeof setTimeout>;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas[0]?.isIntersecting) return;
        observador.disconnect();
        setVisivel(true);
        tempo = setTimeout(() => setSemAtraso(true), LIMPA_ATRASO);
      },
      { threshold: 0.1 },
    );
    observador.observe(el);
    return () => {
      observador.disconnect();
      clearTimeout(tempo);
    };
  }, []);

  const visivelSe = (cond: boolean) => (cond ? s['is-visible'] : '');
  const atraso = (i: number) => ({
    transitionDelay: semAtraso ? '0ms' : `${i * ATRASO_CARTAO}ms`,
  });

  // Plano Singular
  const precoSingular = anual
    ? singular.precoAnualPorMes
    : singular.precoMensal;
  const economiaSingular =
    (singular.precoMensal - singular.precoAnualPorMes) * 12;

  // Plano Família
  const totalFamilia = precoFamilia(qtdMembros, ciclo);
  const porMembro = totalFamilia / qtdMembros;
  const desconto =
    membros.descontos[
      Math.min(qtdMembros - membros.min, membros.descontos.length - 1)
    ];
  const descontoMaximo = membros.descontos[membros.descontos.length - 1];
  const economiaFamilia =
    (precoFamilia(qtdMembros, 'mensal') - precoFamilia(qtdMembros, 'anual')) *
    12;

  const periodo = anual ? '/mês (cobrado anualmente)' : '/mês';

  return (
    <section className={s['plans-section']} id="plansSection" ref={secao}>
      <div className={s['plans-inner']}>
        <div className={`${s['plans-header']} ${visivelSe(visivel)}`}>
          <h2>
            Escolha o plano <span>ideal pra você</span>
          </h2>
          <p>
            Acesso imediato a centenas de experiências em Goiânia. Sem
            burocracia, sem fidelidade.
          </p>
        </div>

        <div className={`${s['plans-toggle']} ${visivelSe(visivel)}`}>
          <div className={s['toggle-wrap']}>
            <div
              className={s['toggle-pill']}
              style={{ left: pilula.left, width: pilula.width }}
            />
            <button
              ref={botaoMensal}
              type="button"
              className={`${s['toggle-btn']} ${!anual ? s.active : ''}`}
              onClick={() => setCiclo('mensal')}
            >
              Mensal
            </button>
            <button
              ref={botaoAnual}
              type="button"
              className={`${s['toggle-btn']} ${anual ? s.active : ''}`}
              onClick={() => setCiclo('anual')}
            >
              Anual{' '}
              <span className={s['toggle-save']}>
                Economize {economiaAnualPercentual}%
              </span>
            </button>
          </div>
        </div>

        <div className={s['plans-grid']}>
          {/* ── Singular ── */}
          <div
            className={`${s['plan-card']} ${visivelSe(visivel)}`}
            style={atraso(0)}
          >
            <p className={s['plan-name']}>{singular.nome}</p>
            <Preco valor={precoSingular} />
            <p className={s['plan-period']}>{periodo}</p>

            <div
              className={`${s['plan-annual-info']} ${anual ? s.show : ''}`}
            >
              <span className={s['plan-annual-label']}>Cobrado anualmente</span>
              <span className={s['plan-annual-economy']}>
                Você economiza R$ {comVirgula(economiaSingular)} por ano
              </span>
            </div>
            <div
              className={s['plan-spacer']}
              style={{ marginBottom: anual ? 0 : 24 }}
            />

            <p className={s['plan-desc']}>{singular.descricao}</p>
            <a
              href={whatsappLink(
                `Olá! Quero assinar o plano ${singular.nome} do Clube Curta Mais.`,
              )}
              className={`${s['plan-btn']} ${s['plan-btn-outline']}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {singular.ctaLabel}
            </a>
            <div className={s['plan-divider']} />
            <p className={s['plan-includes-label']}>{singular.incluiLabel}</p>
            <ul className={s['plan-features']}>
              {singular.beneficios.map((b) => (
                <li key={b}>
                  <Check />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Família ── */}
          <div
            className={`${s['plan-card']} ${s.popular} ${visivelSe(visivel)}`}
            style={atraso(1)}
          >
            <div className={s['plan-badge']}>Mais popular</div>
            <p className={s['plan-name']}>{familia.nome}</p>
            <Preco valor={totalFamilia} />
            <p className={s['plan-period']}>{periodo}</p>

            <div
              className={`${s['plan-annual-info']} ${anual ? s.show : ''}`}
            >
              <span className={s['plan-annual-label']}>Cobrado anualmente</span>
              <span className={s['plan-annual-economy']}>
                Você economiza R$ {comVirgula(economiaFamilia)} por ano
              </span>
            </div>
            <div
              className={s['plan-spacer']}
              style={{ marginBottom: anual ? 0 : 24 }}
            />

            <p className={s['plan-desc']}>{familia.descricao}</p>
            <a
              href={whatsappLink(
                `Olá! Quero assinar o plano ${familia.nome} do Clube Curta Mais para ${qtdMembros} membros.`,
              )}
              className={`${s['plan-btn']} ${s['plan-btn-solid']}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {familia.ctaLabel}
            </a>

            <div className={s['member-selector']}>
              <p className={s['member-selector-label']}>
                Quantidade de membros
              </p>
              <div className={s['member-stepper']}>
                <button
                  type="button"
                  className={s['step-btn']}
                  aria-label="Remover um membro"
                  disabled={qtdMembros <= membros.min}
                  onClick={() => setQtdMembros((n) => Math.max(membros.min, n - 1))}
                >
                  −
                </button>
                <span className={s['step-value']}>{qtdMembros}</span>
                <button
                  type="button"
                  className={s['step-btn']}
                  aria-label="Adicionar um membro"
                  disabled={qtdMembros >= membros.max}
                  onClick={() => setQtdMembros((n) => Math.min(membros.max, n + 1))}
                >
                  +
                </button>
              </div>

              <div className={s['member-discount-bar']}>
                <div className={s['discount-bar-track']}>
                  <div
                    className={s['discount-bar-fill']}
                    style={{ width: `${(desconto / descontoMaximo) * 100}%` }}
                  />
                </div>
                <div className={s['discount-bar-labels']}>
                  <span
                    className={`${s['discount-tag']} ${desconto > 0 ? s['has-discount'] : ''}`}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                    <span>
                      {desconto > 0
                        ? `${Math.round(desconto * 100)}% de desconto`
                        : 'Sem desconto adicional'}
                    </span>
                  </span>
                  <span
                    className={`${s['price-per-member']} ${desconto > 0 ? s['has-discount'] : ''}`}
                  >
                    R$ {comVirgula(porMembro)}/membro
                  </span>
                </div>
              </div>
            </div>

            <div className={s['plan-divider']} />
            <p className={s['plan-includes-label']}>{familia.incluiLabel}</p>
            <ul className={s['plan-features']}>
              <li>
                <Check />
                <span>{qtdMembros} membros incluídos</span>
              </li>
              {familia.beneficios.map((b) => (
                <li key={b}>
                  <Check />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
