export interface Experience {
  id: string;
  /** Posição no ranking exibido no card ("Top #1"). */
  topo: number;
  categoria: string;
  titulo: string;
  local: string;
  beneficio: string;
  /**
   * Hoje é uma URL do Unsplash, herdada do site legado. Na Tarefa 15 vira um
   * arquivo local em /public com a foto real do parceiro (pendência P2).
   */
  imagem: string;
  alt: string;
  /** Ocupa duas colunas na grade. */
  grande: boolean;
}

export const experiences: Experience[] = [
  {
    id: 'jantar-gourmet',
    topo: 1,
    categoria: 'Gastronomia',
    titulo: 'Jantar Gourmet para 2 com entrada + sobremesa',
    local: 'Setor Marista, Goiânia',
    beneficio: '50% de desconto no jantar completo para 2 pessoas',
    imagem:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    alt: 'Gastronomia',
    grande: true,
  },
  {
    id: 'show-vip',
    topo: 2,
    categoria: 'Entretenimento',
    titulo: 'Ingresso VIP para show ao vivo',
    local: 'Centro, Goiânia',
    beneficio: '1 ingresso grátis na compra de 1',
    imagem:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    alt: 'Show',
    grande: false,
  },
  {
    id: 'massagem-ofuro',
    topo: 3,
    categoria: 'Bem-estar',
    titulo: 'Massagem relaxante 60 min + ofurô',
    local: 'Setor Bueno, Goiânia',
    beneficio: '40% off na sessão completa',
    imagem:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
    alt: 'Spa',
    grande: false,
  },
  {
    id: 'chapada',
    topo: 4,
    categoria: 'Turismo',
    titulo: 'Passeio ecoturismo Chapada dos Veadeiros',
    local: 'Goiás',
    beneficio: '35% de desconto + guia exclusivo incluído',
    imagem:
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    alt: 'Turismo',
    grande: true,
  },
  {
    id: 'crossfit',
    topo: 5,
    categoria: 'Fitness',
    titulo: 'Aula experimental de crossfit + avaliação física',
    local: 'Setor Oeste, Goiânia',
    beneficio: '1 semana grátis + kit de boas-vindas',
    imagem:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    alt: 'Academia',
    grande: false,
  },
  {
    id: 'brunch',
    topo: 6,
    categoria: 'Gastronomia',
    titulo: 'Brunch especial com café da manhã premium',
    local: 'Jardim Goiás, Goiânia',
    beneficio: '2 brunches pelo preço de 1 aos fins de semana',
    imagem:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    alt: 'Café',
    grande: false,
  },
];

/**
 * Texto do rodapé da seção. Fica separado de content/stats.ts de propósito:
 * o "+120" daqui conta experiências, o de lá conta parceiros. São números
 * distintos que hoje coincidem — ligá-los faria um mudar junto com o outro.
 */
export const experiencesCta = {
  texto: '+120 experiências disponíveis agora para membros',
  label: 'Quero acessar tudo',
  verTodas: 'Ver todas →',
} as const;
