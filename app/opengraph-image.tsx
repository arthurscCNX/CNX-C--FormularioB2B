import { ImageResponse } from 'next/og';
import { site } from '@/content/site';

export const alt = 'Clube Curta Mais — o clube de experiências de Goiânia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** É o que aparece quando alguém cola o link no WhatsApp. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0a0a0a',
          backgroundImage:
            'radial-gradient(circle at 78% 22%, rgba(255,107,0,0.30) 0%, rgba(10,10,10,0) 55%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#ff8020',
            fontWeight: 700,
          }}
        >
          {site.nome}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 26,
            fontSize: 74,
            lineHeight: 1.08,
            color: '#ffffff',
            fontWeight: 800,
            maxWidth: 900,
          }}
        >
          Os melhores lugares e programas da cidade
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 30,
            fontSize: 30,
            color: 'rgba(255,255,255,0.68)',
            maxWidth: 820,
          }}
        >
          Centenas de experiências em {site.cidade} com benefícios exclusivos
          todo mês.
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 44,
            height: 8,
            width: 180,
            borderRadius: 999,
            background: '#ff6b00',
          }}
        />
      </div>
    ),
    size,
  );
}
