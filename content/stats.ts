export interface Stat {
  /** Valor final do contador animado. */
  valor: number;
  prefixo?: string;
  sufixo?: string;
  rotulo: string;
}

/** Números confirmados como reais pelo Yuri em 18/09/2026. */
export const stats: Stat[] = [
  { valor: 500, sufixo: '+', rotulo: 'Membros satisfeitos' },
  { valor: 120, sufixo: '+', rotulo: 'Parceiros exclusivos' },
  { valor: 611, prefixo: 'R$', sufixo: '+', rotulo: 'Economia média por membro' },
];
