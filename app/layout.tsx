import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { sora, dmSans } from './fonts';
import { site } from '@/content/site';
import { faq } from '@/content/faq';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.titulo,
  description: site.descricao,
  alternates: { canonical: '/' },
  icons: { icon: '/assets/img/simbolo.png' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: site.nome,
    title: site.titulo,
    description: site.descricao,
    url: site.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.titulo,
    description: site.descricao,
  },
};

/** Dados estruturados: ajudam o Google a entender quem é o negócio. */
const organizacao = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.nome,
  url: site.url,
  logo: `${site.url}/assets/img/simbolo.png`,
  telephone: `+55${site.telefone}`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.endereco.linhas[1],
    addressLocality: site.cidade,
    addressRegion: 'GO',
    addressCountry: 'BR',
  },
};

const perguntasFrequentes = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.pergunta,
    acceptedAnswer: { '@type': 'Answer', text: item.resposta },
  })),
};

/**
 * JSON dentro de <script> precisa escapar "<" e os separadores de linha do
 * Unicode. Sem isso, um "</script>" no conteúdo fecharia a tag e o que viesse
 * depois seria interpretado como marcação.
 */
function jsonSeguro(valor: unknown): string {
  return JSON.stringify(valor)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonSeguro(organizacao) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonSeguro(perguntasFrequentes) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
