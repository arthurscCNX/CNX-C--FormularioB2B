export const site = {
  nome: 'Clube Curta Mais',
  titulo: 'Clube Curta Mais — O clube de experiências de Goiânia',
  descricao:
    'Entre para o Clube Curta Mais e tenha acesso a centenas de experiências em Goiânia com benefícios exclusivos todo mês: gastronomia, lazer, turismo, bem-estar e muito mais.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://clube.curtamais.com.br',
  whatsapp: '5562999520608',
  telefone: '6239310505',
  telefoneFormatado: '(62) 3931-0505',
  cidade: 'Goiânia',
} as const;

/** Monta o link do WhatsApp já com a mensagem preenchida. */
export const whatsappLink = (mensagem: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
