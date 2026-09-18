export interface Partner {
  id: string;
  nome: string;
  /**
   * Caminho do logo em /public. Enquanto for indefinido, o cartão mostra o
   * nome como texto — é assim que o site se comporta hoje.
   */
  logo?: string;
}

/**
 * Os rótulos "Parceiro 01" a "Parceiro 18" vieram do site legado e continuam,
 * por decisão do Yuri em 18/09/2026, até os logos reais chegarem (pendência P9).
 * Para trocar: preencha `nome` e `logo` de cada item — nada mais precisa mudar.
 */
const rotulo = (n: number): Partner => ({
  id: `parceiro-${String(n).padStart(2, '0')}`,
  nome: `Parceiro ${String(n).padStart(2, '0')}`,
});

/** Grade fixa: dez cartões. */
export const partnersGrid: Partner[] = Array.from({ length: 10 }, (_, i) =>
  rotulo(i + 1),
);

/** Carrossel infinito: oito cartões, repetidos em tela para fechar o laço. */
export const partnersMarquee: Partner[] = Array.from({ length: 8 }, (_, i) =>
  rotulo(i + 11),
);

export const partnersCta = {
  texto: '+120 parceiros em Goiânia esperando por você',
  label: 'Ver todos os parceiros →',
} as const;
