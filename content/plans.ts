export type CicloCobranca = 'mensal' | 'anual';

export interface Plan {
  id: 'singular' | 'familia';
  nome: string;
  /** Valor por mês na cobrança mensal. */
  precoMensal: number;
  /** Valor por mês quando cobrado anualmente. */
  precoAnualPorMes: number;
  descricao: string;
  /** Recebe o selo "Mais popular" e o botão sólido. */
  destaque: boolean;
  ctaLabel: string;
  incluiLabel: string;
  beneficios: string[];
}

export const plans: Plan[] = [
  {
    id: 'singular',
    nome: 'Singular',
    precoMensal: 55.9,
    precoAnualPorMes: 32.9,
    descricao:
      'Para quem quer curtir Goiânia do seu jeito, com benefícios exclusivos todo mês.',
    destaque: false,
    ctaLabel: 'Começar agora',
    incluiLabel: 'O que está incluído',
    beneficios: [
      '1 membro',
      'Experiências ilimitadas',
      'Card digital para resgate',
      'Todas as categorias desbloqueadas',
      'Suporte via WhatsApp',
    ],
  },
  {
    id: 'familia',
    nome: 'Família',
    precoMensal: 89.9,
    precoAnualPorMes: 52.9,
    descricao:
      'Para grupos que querem curtir juntos. Adicione membros e economize mais a cada um.',
    destaque: true,
    ctaLabel: 'Quero ser membro',
    incluiLabel: 'Tudo do Singular, mais',
    beneficios: [
      // O primeiro item é dinâmico: "{n} membros incluídos".
      'Experiências ilimitadas para todos',
      'Cards digitais individuais',
      'Acesso antecipado a novidades',
      'Suporte prioritário via WhatsApp',
    ],
  },
];

/** Economia do ciclo anual frente ao mensal, exibida no seletor. */
export const economiaAnualPercentual = 41;

/**
 * Desconto progressivo do plano Família por quantidade de membros.
 * O índice 0 corresponde a 2 membros (mínimo), o índice 8 a 10 (máximo).
 *
 * preço_total = membros × precoBase × (1 - desconto)
 * precoBase   = metade do plano Família (mensal 44,95 · anual 26,45)
 *
 * O desconto para em 32% para preservar a margem mínima do produto.
 */
export const membros = {
  min: 2,
  max: 10,
  descontos: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.28, 0.3, 0.32],
} as const;

/** Preço total do plano Família para uma dada quantidade de membros. */
export function precoFamilia(qtdMembros: number, ciclo: CicloCobranca): number {
  const familia = plans.find((p) => p.id === 'familia')!;
  const precoBase =
    (ciclo === 'anual' ? familia.precoAnualPorMes : familia.precoMensal) / 2;
  const desconto = membros.descontos[qtdMembros - membros.min] ?? 0;
  return qtdMembros * precoBase * (1 - desconto);
}
