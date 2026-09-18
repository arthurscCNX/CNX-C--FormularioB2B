export interface Testimonial {
  id: string;
  texto: string;
  nota: number;
  /** Categoria da experiência citada, exibida como etiqueta. */
  categoria: string;
  nome: string;
  plano: string;
  iniciais: string;
  corAvatar: string;
  /** O primeiro card recebe tratamento visual de destaque. */
  destaque: boolean;
}

/** Selo de reputação exibido acima dos depoimentos. Ver pendência P8. */
export const reputacao = {
  nota: 5.0,
  fonte: 'Google',
  totalAvaliacoes: 87,
} as const;

export const testimonials: Testimonial[] = [
  {
    id: 'ana-m',
    texto:
      'Simplesmente o melhor investimento que fiz esse ano. Já economizei mais de R$ 400 só em jantas e ainda fui em dois shows. O card funciona perfeitinho, sem burocracia.',
    nota: 5,
    categoria: 'Gastronomia + Show',
    nome: 'Ana M.',
    plano: 'Membro Anual',
    iniciais: 'AM',
    corAvatar: '#e8744a',
    destaque: true,
  },
  {
    id: 'ricardo-s',
    texto:
      'Assino há 6 meses e já virou parte da minha rotina. Toda semana tem algo novo pra fazer em Goiânia. Vale muito mais do que o preço.',
    nota: 5,
    categoria: 'Turismo & Lazer',
    nome: 'Ricardo S.',
    plano: 'Membro Semestral',
    iniciais: 'RS',
    corAvatar: '#4a90d9',
    destaque: false,
  },
  {
    id: 'felipe-o',
    texto:
      'Fui com minha namorada em um spa incrível que nem sabia que existia. O desconto pagou o mês inteiro de assinatura. Recomendo demais!',
    nota: 5,
    categoria: 'Beleza & Bem-Estar',
    nome: 'Felipe O.',
    plano: 'Membro Mensal',
    iniciais: 'FO',
    corAvatar: '#6ac47e',
    destaque: false,
  },
];
