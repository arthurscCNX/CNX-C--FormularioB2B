import { Sora, DM_Sans } from 'next/font/google';

/**
 * As fontes são baixadas no build e servidas pelo próprio domínio.
 * O site legado as buscava no Google Fonts a cada visita.
 */
export const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});
