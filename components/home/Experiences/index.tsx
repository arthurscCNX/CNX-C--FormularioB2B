/* eslint-disable @next/next/no-img-element --
   As fotos ainda vêm do Unsplash. Viram next/image na Tarefa 15, quando as
   fotos reais dos parceiros substituírem as de banco de imagens (P2). */

import { experiences, experiencesCta } from '@/content/experiences';
import s from './styles.module.css';

const IconeLocal = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const IconeEstrela = () => (
  <svg viewBox="0 0 16 16">
    <path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4 4.3 12.4l.7-4.1-3-2.9 4.2-.8z" />
  </svg>
);

export default function Experiences() {
  return (
    <section className={s['exp-section']} id="experiencias">
      <div className={s['exp-inner']}>
        <div className={s['exp-header']}>
          <div className={s['exp-header-left']}>
            <div className={s['exp-badge']}>Top experiências</div>
            <h2>
              As mais curtidas <span>esse mês</span>
            </h2>
            <p>
              Experiências selecionadas a dedo pela nossa curadoria em Goiânia
            </p>
          </div>
          <a href="#plansSection" className={s['btn-see-all']}>
            {experiencesCta.verTodas}
          </a>
        </div>

        <div className={s['exp-grid']}>
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className={`${s['exp-card']} ${exp.grande ? s.large : ''}`}
            >
              <div className={s['exp-img']}>
                <img src={exp.imagem} alt={exp.alt} />
                <div className={s['exp-cat']}>{exp.categoria}</div>
                <div className={s['exp-top']}>Top #{exp.topo}</div>
              </div>
              <div className={s['exp-body']}>
                <p className={s['exp-name']}>{exp.titulo}</p>
                <div className={s['exp-place']}>
                  <IconeLocal />
                  {exp.local}
                </div>
                <div className={s['exp-benefit']}>
                  <IconeEstrela />
                  <div className={s['exp-benefit-text']}>
                    <span className={s['b-label']}>Benefício exclusivo</span>
                    <span className={s['b-val']}>{exp.beneficio}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={s['exp-cta']}>
          <p>{experiencesCta.texto}</p>
          <a href="#plansSection" className={s['btn-solid']}>
            {experiencesCta.label}
            <svg viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
