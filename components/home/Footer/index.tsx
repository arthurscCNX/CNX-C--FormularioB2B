import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/content/site';
import s from './styles.module.css';

const IconeTelefone = () => (
  <svg viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" />
  </svg>
);

const IconeWhatsapp = ({ preenchido = false }: { preenchido?: boolean }) => (
  <svg viewBox="0 0 24 24">
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      {...(preenchido ? { fill: 'currentColor', stroke: 'none' } : {})}
    />
  </svg>
);

const linksClube = [
  { href: '#experiencias', rotulo: 'Experiências' },
  { href: '#plansSection', rotulo: 'Assine' },
  { href: '/formulario-cadastro', rotulo: 'Seja parceiro' },
  { href: '#', rotulo: 'Sobre nós' },
];

const linksSuporte = [
  { href: '#howSection', rotulo: 'Como funciona?' },
  { href: '#faqSection', rotulo: 'FAQ' },
  { href: '#', rotulo: 'Termos & Condições' },
  { href: '#', rotulo: 'Políticas de privacidade' },
];

/** Âncora da mesma página continua <a>; rota do site usa Link. */
function LinkOuAncora({ href, children }: { href: string; children: string }) {
  if (href.startsWith('#')) return <a href={href}>{children}</a>;
  return <Link href={href}>{children}</Link>;
}

export default function Footer() {
  const whatsappUrl = `https://wa.me/${site.whatsapp}`;

  return (
    <footer className={s.footer}>
      <div className={s['footer-inner']}>
        <div className={s['footer-logo']}>
          <Link href="/" className={s['logo-wrap']}>
            <div className={s['logo-icon']}>
              <Image
                src="/assets/img/simbolo.png"
                alt={site.nome}
                width={48}
                height={48}
              />
            </div>
          </Link>
        </div>

        <div className={s['footer-cols']}>
          <div className={s['col-about']}>
            <p className={s['col-title']}>Quem somos?</p>
            <p>
              <strong>Clube C+</strong> o primeiro clube de assinaturas do país
              especializado em experiências e com curadoria, com a mais completa
              e confiável plataforma de informação, cultura, gastronomia,
              entretenimento e negócios de Goiás.
            </p>
            <span className={s.hashtag}>#clubecurtamais</span>
          </div>

          <div className={s['col-links']}>
            <p className={s['col-title']}>Clube C+</p>
            <ul>
              {linksClube.map((l) => (
                <li key={l.rotulo}>
                  <LinkOuAncora href={l.href}>{l.rotulo}</LinkOuAncora>
                </li>
              ))}
            </ul>
          </div>

          <div className={s['col-links']}>
            <p className={s['col-title']}>Suporte</p>
            <ul>
              {linksSuporte.map((l) => (
                <li key={l.rotulo}>
                  <LinkOuAncora href={l.href}>{l.rotulo}</LinkOuAncora>
                </li>
              ))}
            </ul>
          </div>

          <div className={s['col-contact']}>
            <p className={s['col-title']}>Contato</p>
            <ul>
              <li>
                <IconeTelefone />
                <a href={`tel:${site.telefone}`}>{site.telefoneFormatado}</a>
              </li>
              <li>
                <IconeWhatsapp preenchido />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  (62) 9 9952-0608
                </a>
              </li>
              <li>
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <div className={s['contact-address']}>
                  <strong>{site.endereco.nome}</strong>
                  {site.endereco.linhas.map((linha) => (
                    <span key={linha}>{linha}</span>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className={s['footer-bottom']}>
          <span className={s.copy}>
            © {new Date().getFullYear()} curtamais · Todos os Direitos
            Reservados.
          </span>

          <div className={s.socials}>
            {/* TODO(P10): Instagram e TikTok sem URL real; link morto como no legado. */}
            <a href={site.redes.instagram || '#'} aria-label="Instagram">
              <svg viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href={site.redes.tiktok || '#'} aria-label="TikTok">
              <svg viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
              </svg>
            </a>
            <a
              href={whatsappUrl}
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconeWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
