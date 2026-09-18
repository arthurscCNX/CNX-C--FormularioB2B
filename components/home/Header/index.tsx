'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import s from './styles.module.css';

const links = [
  { href: '#', rotulo: 'Sobre', ativo: false },
  { href: '#howSection', rotulo: 'Como Funciona?', ativo: false },
  { href: '#experiencias', rotulo: 'Experiências', ativo: true },
  { href: '/formulario-b2b', rotulo: 'Seja Parceiro', ativo: false },
];

/** Âncora da mesma página continua <a>; rota do site usa Link. */
function LinkOuAncora({
  href,
  ...resto
}: React.ComponentProps<'a'> & { href: string }) {
  if (href.startsWith('#')) return <a href={href} {...resto} />;
  return <Link href={href} {...resto} />;
}

export default function Header() {
  /** No legado isto era um checkbox oculto lido por seletor CSS. */
  const [aberto, setAberto] = useState(false);

  // Trava a rolagem do fundo enquanto o menu está aberto.
  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [aberto]);

  // Esc fecha o menu.
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false);
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [aberto]);

  return (
    <>
      <div className={`${s['cplus-header']} ${aberto ? s.open : ''}`}>
        <nav className={s['cplus-navbar']}>
          <Link href="/" className={s['cplus-logo']}>
            <Image
              src="/assets/img/simbolo.png"
              alt="Clube Curta Mais"
              width={40}
              height={40}
              priority
            />
          </Link>

          <div className={s['cplus-links']}>
            {links.map((l) => (
              <LinkOuAncora
                key={l.rotulo}
                href={l.href}
                className={l.ativo ? s['is-active'] : undefined}
              >
                {l.rotulo}
              </LinkOuAncora>
            ))}
          </div>

          <div className={s['cplus-right']}>
            <a href="#plansSection" className={s['cplus-cta']}>
              Quero Ser Membro
            </a>
          </div>

          <button
            type="button"
            className={s['cplus-hamburger']}
            aria-label="Menu"
            aria-expanded={aberto}
            onClick={() => setAberto((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </div>

      <div
        className={`${s['cplus-drawer']} ${aberto ? s['open-drawer'] : ''}`}
        aria-hidden={!aberto}
      >
        <button
          type="button"
          className={s['cplus-drawer__close']}
          aria-label="Fechar menu"
          onClick={() => setAberto(false)}
        >
          ✕
        </button>
        <div className={s['cplus-drawer__links']}>
          {links.map((l) => (
            <LinkOuAncora
              key={l.rotulo}
              href={l.href}
              className={l.ativo ? s['is-active'] : undefined}
              onClick={() => setAberto(false)}
            >
              {l.rotulo}
            </LinkOuAncora>
          ))}
          {/* segue <button> como no legado: a regra `.cplus-drawer__links a`
              sobrescreveria o estilo se virasse link */}
          <button
            type="button"
            className={s['cplus-drawer__cta']}
            onClick={() => {
              setAberto(false);
              document
                .getElementById('plansSection')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Quero Ser Membro
          </button>
        </div>
      </div>
    </>
  );
}
