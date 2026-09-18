import { partnersGrid, partnersMarquee, partnersCta } from '@/content/partners';
import s from './styles.module.css';

export default function Partners() {
  return (
    <section className={s['partners-section']}>
      <div className={s['partners-inner']}>
        <div className={s['partners-header']}>
          <h2>Você já conhece esses lugares</h2>
          <p>
            Agora imagine acessar todos eles com{' '}
            <strong>benefícios exclusivos</strong> todo mês.
          </p>
        </div>

        <div className={s['partners-grid']}>
          {partnersGrid.map((p) => (
            <div className={s['partner-card']} key={p.id}>
              <span className={s['partner-placeholder']}>{p.nome}</span>
            </div>
          ))}
        </div>

        <div className={s['partners-marquee']}>
          <div className={s['marquee-track']}>
            {/* a lista é repetida para o laço do carrossel não ter emenda */}
            {[...partnersMarquee, ...partnersMarquee].map((p, i) => (
              <div className={s['marquee-card']} key={`${p.id}-${i}`}>
                <span>{p.nome}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={s['partners-cta']}>
          <p>{partnersCta.texto}</p>
          <a href="#plansSection" className={s['btn-outline']}>
            {partnersCta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
