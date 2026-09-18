import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PartnerForm from '@/components/form/PartnerForm';
import { montserrat } from '../fonts';
import { site } from '@/content/site';
import s from '@/components/form/PartnerForm/styles.module.css';

export const metadata: Metadata = {
  title: 'Seja parceiro — Clube Curta Mais',
  description:
    'Cadastre seu estabelecimento no Clube Curta Mais e leve o seu negócio para milhares de assinantes em Goiânia.',
};

export default function FormularioB2B() {
  return (
    <div className={`${s.page} ${montserrat.variable}`}>
      <div className={s.wrap}>
        <div className={s.brandbar}>
          <Link href="/">
            <Image
              className={s.mark}
              src="/assets/img/simbolo.png"
              alt={site.nome}
              width={26}
              height={26}
              priority
            />
          </Link>
        </div>

        <div className={s.hero}>
          <div className={s.eyebrow}>Cadastro de parceiros</div>
          <h1>
            Leve o seu negócio para milhares de assinantes do Clube Curta Mais
          </h1>
          <p>
            Preencha as informações abaixo para cadastrar seu estabelecimento na
            plataforma. Esses dados serão usados para divulgação da marca e
            apresentação do benefício aos assinantes.
          </p>
          <div className={s.trustrow}>
            <span>Sem taxa de adesão</span>
            <i>·</i>
            <span>Sem burocracia</span>
            <i>·</i>
            <span>Leva cerca de 10 minutos</span>
          </div>
        </div>

        <PartnerForm />
      </div>
    </div>
  );
}
