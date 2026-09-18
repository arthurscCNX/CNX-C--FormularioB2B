import type { Metadata } from 'next';
import { sora, dmSans } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clube Curta Mais — O clube de experiências de Goiânia',
  description:
    'Entre para o Clube Curta Mais e tenha acesso a centenas de experiências em Goiânia com benefícios exclusivos todo mês: gastronomia, lazer, turismo, bem-estar e muito mais.',
  icons: { icon: '/assets/img/simbolo.png' },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
