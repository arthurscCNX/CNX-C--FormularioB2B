export interface Experience {
  id: string;
  /** Posição no ranking exibido no card ("Top #1"). */
  topo: number;
  categoria: string;
  titulo: string;
  local: string;
  beneficio: string;
  /** Caminho em /public. Ver pendência P2: hoje são fotos de banco de imagens. */
  imagem: string;
  alt: string;
}

export const experiences: Experience[] = [
  {
    id: 'jantar-gourmet',
    topo: 1,
    categoria: 'Gastronomia',
    titulo: 'Jantar Gourmet para 2 com entrada + sobremesa',
    local: 'Setor Marista, Goiânia',
    beneficio: '50% de desconto no jantar completo para 2 pessoas',
    imagem: '/img/experiencias/jantar-gourmet.jpg',
    alt: 'Jantar gourmet servido em restaurante',
  },
  {
    id: 'show-vip',
    topo: 2,
    categoria: 'Entretenimento',
    titulo: 'Ingresso VIP para show ao vivo',
    local: 'Centro, Goiânia',
    beneficio: '1 ingresso grátis na compra de 1',
    imagem: '/img/experiencias/show-vip.jpg',
    alt: 'Plateia em show ao vivo',
  },
  {
    id: 'massagem-ofuro',
    topo: 3,
    categoria: 'Bem-estar',
    titulo: 'Massagem relaxante 60 min + ofurô',
    local: 'Setor Bueno, Goiânia',
    beneficio: '40% off na sessão completa',
    imagem: '/img/experiencias/massagem-ofuro.jpg',
    alt: 'Ambiente de spa preparado para massagem',
  },
  {
    id: 'chapada',
    topo: 4,
    categoria: 'Turismo',
    titulo: 'Passeio ecoturismo Chapada dos Veadeiros',
    local: 'Goiás',
    beneficio: '35% de desconto + guia exclusivo incluído',
    imagem: '/img/experiencias/chapada.jpg',
    alt: 'Cachoeira na Chapada dos Veadeiros',
  },
  {
    id: 'crossfit',
    topo: 5,
    categoria: 'Fitness',
    titulo: 'Aula experimental de crossfit + avaliação física',
    local: 'Setor Oeste, Goiânia',
    beneficio: '1 semana grátis + kit de boas-vindas',
    imagem: '/img/experiencias/crossfit.jpg',
    alt: 'Treino de crossfit em academia',
  },
  {
    id: 'brunch',
    topo: 6,
    categoria: 'Gastronomia',
    titulo: 'Brunch especial com café da manhã premium',
    local: 'Jardim Goiás, Goiânia',
    beneficio: '2 brunches pelo preço de 1 aos fins de semana',
    imagem: '/img/experiencias/brunch.jpg',
    alt: 'Mesa de brunch com café da manhã',
  },
];
