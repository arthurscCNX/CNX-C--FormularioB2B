export interface Partner {
  id: string;
  nome: string;
  /** Caminho do logo em /public. */
  logo: string;
}

/**
 * ATENÇÃO — esta lista está vazia de propósito.
 *
 * O site legado exibia dezoito cartões escritos "Parceiro 01" a "Parceiro 18",
 * acompanhados do comentário "substitua as imagens pelos logos reais dos
 * parceiros". Era conteúdo de rascunho, não parceiro real, e a regra do projeto
 * é não mostrar dado fictício na tela.
 *
 * Enquanto a lista estiver vazia, o componente Partners exibe estado vazio.
 * Ver pendência P9 do plano.
 */
export const partners: Partner[] = [];

/** Os oito primeiros logos ocupam o carrossel; o restante, a grade fixa. */
export const partnersNoCarrossel = 8;
