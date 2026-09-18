/* eslint-disable @next/next/no-img-element --
   As três fotos ainda vêm do Unsplash. Viram next/image na Tarefa 15, quando
   as fotos reais dos parceiros substituírem as de banco de imagens (P2). */

import { whatsappLink } from '@/content/site';
import { stats } from '@/content/stats';
import s from './styles.module.css';

const avatares = ['H', 'V', 'F', 'J'];

export default function Hero() {
  const membros = stats[0];

  return (
    <section className={s['spotlight-container']}>
      <div className={s['spotlight-overlay']}>
        <div className={`${s.spotlight} ${s['spotlight-left']}`} />
        <div className={`${s.spotlight} ${s['spotlight-mid']}`} />
        <div className={`${s.spotlight} ${s['spotlight-right']}`} />
      </div>

      <div className={s['spotlight-content']}>
        <div className={s['hero-inner']}>
          <div className={s['hero-text']}>
            <div className={s.badge}>Clube de experiências exclusivas</div>

            <h1 className={s['hero-title']}>
              Os melhores lugares
              <span className={s.highlight}>e programas</span>
              da cidade
            </h1>

            <p className={s['hero-desc']}>
              Entre para o clube e descubra experiências exclusivas escolhidas
              especialmente para você, com benefícios que só membros têm acesso.
            </p>

            <div className={s['hero-cta']}>
              <a
                href={whatsappLink('Olá! Quero ser membro do Clube Curta Mais.')}
                className={s['btn-primary']}
                target="_blank"
                rel="noopener noreferrer"
              >
                Quero Ser Membro
              </a>
              <a href="#experiencias" className={s['btn-secondary']}>
                Ver Experiências
              </a>
            </div>

            <div className={s['social-proof']}>
              <div className={s.members}>
                <div className={s.avatars}>
                  {avatares.map((letra, i) => (
                    <div key={letra} className={`${s.av} ${s[`av-${i + 1}`]}`}>
                      {letra}
                    </div>
                  ))}
                  <div className={`${s.av} ${s['av-plus']}`}>+</div>
                </div>
                <span>
                  {membros.sufixo}
                  {membros.valor} membros satisfeitos
                </span>
              </div>
            </div>
          </div>

          <div className={s['hero-images']}>
            <div className={`${s['img-card']} ${s['img-main']}`}>
              <img
                src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=520&q=80"
                alt="Show ao vivo"
              />
            </div>
            <div className={`${s['img-card']} ${s['img-top-right']}`}>
              <img
                src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80"
                alt="Natureza"
              />
            </div>
            <div className={`${s['img-card']} ${s['img-bottom-right']}`}>
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"
                alt="Gastronomia"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
