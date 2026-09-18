'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  CATEGORIAS,
  DIAS,
  DIA_POR_EXTENSO,
  MAX_FOTOS,
  CAMPO_ARMADILHA,
} from '@/lib/schemas';
import {
  comprimirImagem,
  formatarTamanho,
  LIMITE_TOTAL_BYTES,
} from '@/lib/image-compress';
import { site } from '@/content/site';
import { AreaField, ChipGroup, Field, TextoField } from './fields';
import s from './styles.module.css';

const TOTAL_ETAPAS = 10;

const ROTULOS: Record<number, string> = {
  1: 'Dados do estabelecimento',
  2: 'Informações comerciais',
  3: 'Benefício oferecido',
  4: 'Canal de atendimento',
  5: 'Redes sociais',
  6: 'Fotos e materiais',
  7: 'Descrição da marca',
  8: 'Observações',
  9: 'Responsável',
  10: 'Revisão e aceite',
};

/** Campos de texto obrigatórios por etapa. */
const OBRIGATORIOS: Record<number, string[]> = {
  1: [
    'nome_estabelecimento',
    'nome_responsavel',
    'telefone_responsavel',
    'email',
    'endereco_completo',
    'cidade',
    'cep',
    'horario_funcionamento',
  ],
  2: ['ticket_medio', 'vouchers_mes'],
  3: [
    'beneficio_oferecido',
    'descricao_funcionamento',
    'dias_horarios_beneficio',
    'como_validar',
  ],
  4: ['whatsapp_atendimento'],
  5: [],
  6: [],
  7: [
    'sobre_estabelecimento',
    'descricao_experiencia',
    'diferencial',
    'principais_produtos_servicos',
  ],
  8: [],
  9: ['responsavel_nome', 'responsavel_cargo', 'responsavel_whatsapp'],
  10: [],
};

type Excecao = { id: number; dia: string; horario: string };

const mascaraTelefone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const mascaraCep = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

const Seta = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);
const SetaVolta = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M11 5l-7 7 7 7" />
  </svg>
);
const IconeUpload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 16V4M7 9l5-5 5 5" />
    <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
  </svg>
);

function Navegacao({
  etapa,
  voltar,
  avancar,
  rotuloAvancar = 'Continuar',
}: {
  etapa: number;
  voltar: () => void;
  avancar: () => void;
  rotuloAvancar?: string;
}) {
  return (
    <div className={s['step-nav']}>
      {etapa > 1 ? (
        <button type="button" className={`${s.btn} ${s['btn-ghost']}`} onClick={voltar}>
          <SetaVolta />
          Voltar
        </button>
      ) : (
        <span />
      )}
      <button type="button" className={`${s.btn} ${s['btn-primary']}`} onClick={avancar}>
        {rotuloAvancar}
        <Seta />
      </button>
    </div>
  );
}

function Cabecalho({
  numero,
  titulo,
  texto,
}: {
  numero: string;
  titulo: string;
  texto: string;
}) {
  return (
    <div className={s['step-head']}>
      <div className={s['step-marker']}>{numero}</div>
      <div>
        <h2>{titulo}</h2>
        <p>{texto}</p>
      </div>
    </div>
  );
}

export default function PartnerForm() {
  const topo = useRef<HTMLDivElement>(null);
  const [etapa, setEtapa] = useState(1);
  const [erros, setErros] = useState<Record<string, string>>({});

  const [dados, setDados] = useState<Record<string, string>>({});
  const [categoria, setCategoria] = useState<string | null>(null);
  const [dias, setDias] = useState<string[]>([]);
  const [combinavel, setCombinavel] = useState<string | null>(null);
  const [excecoes, setExcecoes] = useState<Excecao[]>([]);
  const [fotos, setFotos] = useState<File[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [comprimindo, setComprimindo] = useState(false);
  const [aceiteDivulgacao, setAceiteDivulgacao] = useState(false);
  const [aceiteCondicoes, setAceiteCondicoes] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');

  const campo = (nome: string) => dados[nome] ?? '';
  const mudar = (nome: string) => (v: string) => {
    setDados((d) => ({ ...d, [nome]: v }));
    setErros((e) => {
      if (!e[nome]) return e;
      const resto = { ...e };
      delete resto[nome];
      return resto;
    });
  };

  const totalBytes = useMemo(
    () => fotos.reduce((t, f) => t + f.size, 0) + (logo?.size ?? 0),
    [fotos, logo],
  );
  const acimaDoLimite = totalBytes > LIMITE_TOTAL_BYTES;

  const excecoesResumo = () =>
    excecoes
      .filter((e) => e.horario.trim())
      .map((e) => `${DIA_POR_EXTENSO[e.dia as keyof typeof DIA_POR_EXTENSO]}: ${e.horario.trim()}`)
      .join(' | ');

  function validar(n: number): boolean {
    const novos: Record<string, string> = {};

    for (const nome of OBRIGATORIOS[n]) {
      if (!campo(nome).trim()) novos[nome] = 'Campo obrigatório.';
    }
    if (n === 1) {
      const email = campo('email').trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        novos.email = 'E-mail inválido.';
      }
      if (!categoria) novos.categoria = 'Selecione uma categoria.';
      if (!dias.length) novos.dias = 'Selecione ao menos um dia.';
      const vazia = excecoes.find((e) => !e.horario.trim());
      if (vazia) {
        novos.excecoes = `Preencha o horário de exceção de ${DIA_POR_EXTENSO[vazia.dia as keyof typeof DIA_POR_EXTENSO]} ou remova a linha.`;
      }
    }
    if (n === 3 && !combinavel) novos.combinavel = 'Selecione uma opção.';
    if (n === 6) {
      if (!fotos.length) novos.fotos = 'Envie ao menos uma foto.';
      else if (acimaDoLimite) {
        novos.fotos = `O total de ${formatarTamanho(totalBytes)} passa do limite de envio. Remova algumas fotos e tente de novo.`;
      }
    }
    if (n === 10) {
      if (!aceiteDivulgacao)
        novos.aceite_divulgacao = 'É necessário autorizar o uso das informações.';
      if (!aceiteCondicoes)
        novos.aceite_condicoes = 'É necessário concordar com as condições.';
    }

    setErros(novos);
    return Object.keys(novos).length === 0;
  }

  function irPara(n: number) {
    setEtapa(n);
    topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function avancar() {
    if (!validar(etapa)) return;
    irPara(Math.min(etapa + 1, TOTAL_ETAPAS));
  }

  function voltar() {
    setErros({});
    irPara(Math.max(etapa - 1, 1));
  }

  async function receberFotos(lista: FileList | null) {
    if (!lista) return;
    setComprimindo(true);
    const escolhidas = Array.from(lista).slice(0, MAX_FOTOS);
    const comprimidas = await Promise.all(escolhidas.map(comprimirImagem));
    setFotos(comprimidas);
    setComprimindo(false);
    setErros((e) => {
      const resto = { ...e };
      delete resto.fotos;
      return resto;
    });
  }

  async function receberLogo(lista: FileList | null) {
    const arquivo = lista?.[0];
    if (!arquivo) return setLogo(null);
    setComprimindo(true);
    setLogo(await comprimirImagem(arquivo));
    setComprimindo(false);
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!validar(10)) return;

    setErroEnvio('');
    setEnviando(true);

    const fd = new FormData();
    Object.entries(dados).forEach(([k, v]) => fd.append(k, v.trim()));
    fd.append('categoria', categoria ?? '');
    fd.append('dias_funcionamento', dias.join(','));
    fd.append('horario_excecoes', excecoesResumo());
    fd.append('combinavel_outras_promocoes', combinavel ?? '');
    fd.append('aceite_divulgacao', String(aceiteDivulgacao));
    fd.append('aceite_condicoes', String(aceiteCondicoes));
    fd.append('enviado_em', new Date().toISOString());
    fd.append('origem', 'formulario_b2b_site');
    fd.append(CAMPO_ARMADILHA, '');
    if (logo) fd.append('logo', logo, logo.name);
    fotos.forEach((f) => fd.append('fotos', f, f.name));

    try {
      const res = await fetch('/api/parceiros', { method: 'POST', body: fd });
      const corpo = await res.json().catch(() => ({}));

      if (res.ok) {
        setEnviado(true);
        return;
      }
      if (res.status === 422 && corpo?.erros) {
        const vindos: Record<string, string> = {};
        Object.entries(corpo.erros as Record<string, string[]>).forEach(
          ([k, v]) => {
            if (v?.[0]) vindos[k] = v[0];
          },
        );
        setErros(vindos);
        setErroEnvio(
          'Alguns campos precisam de correção. Volte nas etapas indicadas.',
        );
        return;
      }
      if (res.status === 429) {
        setErroEnvio('Muitos envios seguidos. Aguarde alguns minutos e tente de novo.');
        return;
      }
      setErroEnvio(
        `Não conseguimos registrar seu cadastro agora. Fale com a gente pelo WhatsApp ${site.telefoneFormatado} e tentaremos resolver na hora.`,
      );
    } catch {
      setErroEnvio(
        'Não foi possível enviar seu cadastro. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setEnviando(false);
    }
  }

  function recomecar() {
    setDados({});
    setCategoria(null);
    setDias([]);
    setCombinavel(null);
    setExcecoes([]);
    setFotos([]);
    setLogo(null);
    setAceiteDivulgacao(false);
    setAceiteCondicoes(false);
    setErros({});
    setErroEnvio('');
    setEnviado(false);
    irPara(1);
  }

  const diasDisponiveis = (atual: string) => {
    const usados = excecoes.filter((e) => e.dia !== atual).map((e) => e.dia);
    return DIAS.filter((d) => dias.includes(d) && (d === atual || !usados.includes(d)));
  };

  if (enviado) {
    return (
      <div className={`${s.cardframe} ${s.success} ${s.show}`}>
        <div className={`${s.card} ${s.success} ${s.show}`}>
          <div className={s.check}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2>Cadastro enviado com sucesso!</h2>
          <p>
            Recebemos as informações do seu estabelecimento. Nossa equipe vai
            analisar o material e entrar em contato em breve para os próximos
            passos da parceria.
          </p>
          <button type="button" className={`${s.btn} ${s['btn-primary']}`} onClick={recomecar}>
            Enviar outro cadastro
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={s['progress-shell']} ref={topo}>
        <div className={s['progress-top']}>
          <span className={s['progress-step']}>
            Etapa <b>{etapa}</b> de <b>{TOTAL_ETAPAS}</b>
          </span>
          <span className={s['progress-label']}>{ROTULOS[etapa]}</span>
        </div>
        <div className={s['progress-track']}>
          <div
            className={s['progress-fill']}
            style={{ width: `${((etapa - 1) / (TOTAL_ETAPAS - 1)) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={enviar} noValidate>
        {/* campo-armadilha: invisível e fora da ordem de tabulação */}
        <input
          type="text"
          name={CAMPO_ARMADILHA}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px' }}
        />

        {etapa === 1 && (
          <section className={s.cardframe}>
            <div className={s.card}>
              <Cabecalho numero="01" titulo="Dados do estabelecimento" texto="Informações básicas para identificarmos seu negócio na plataforma." />
              <div className={s['field-grid']}>
                <TextoField span2 obrigatorio nome="nome_estabelecimento" label="Nome do estabelecimento / marca" placeholder="Ex: Buddha Spa" valor={campo('nome_estabelecimento')} aoMudar={mudar('nome_estabelecimento')} erro={erros.nome_estabelecimento} />
                <TextoField obrigatorio nome="nome_responsavel" label="Nome do responsável pelo cadastro" placeholder="Nome completo" valor={campo('nome_responsavel')} aoMudar={mudar('nome_responsavel')} erro={erros.nome_responsavel} />
                <TextoField obrigatorio nome="telefone_responsavel" label="Telefone / WhatsApp do responsável" placeholder="(00) 00000-0000" tipo="tel" inputMode="tel" valor={campo('telefone_responsavel')} aoMudar={(v) => mudar('telefone_responsavel')(mascaraTelefone(v))} erro={erros.telefone_responsavel} />
                <TextoField span2 obrigatorio nome="email" label="E-mail" placeholder="contato@seuestabelecimento.com" tipo="email" inputMode="email" valor={campo('email')} aoMudar={mudar('email')} erro={erros.email} />

                <ChipGroup obrigatorio label="Categoria do estabelecimento" opcoes={CATEGORIAS} selecionados={categoria ? [categoria] : []} aoAlternar={(v) => { setCategoria(v); setErros((e) => ({ ...e, categoria: '' })); }} erro={erros.categoria} />

                <TextoField span2 obrigatorio nome="endereco_completo" label="Endereço completo" placeholder="Rua, número, bairro, complemento" valor={campo('endereco_completo')} aoMudar={mudar('endereco_completo')} erro={erros.endereco_completo} />
                <TextoField obrigatorio nome="cidade" label="Cidade" placeholder="Ex: Goiânia" valor={campo('cidade')} aoMudar={mudar('cidade')} erro={erros.cidade} />
                <TextoField obrigatorio nome="cep" label="CEP" placeholder="00000-000" inputMode="numeric" maxLength={9} valor={campo('cep')} aoMudar={(v) => mudar('cep')(mascaraCep(v))} erro={erros.cep} />

                <ChipGroup obrigatorio multiplo label="Dias de funcionamento" opcoes={DIAS} selecionados={dias} aoAlternar={(v) => setDias((atual) => atual.includes(v) ? atual.filter((d) => d !== v) : [...atual, v])} erro={erros.dias} />

                <TextoField span2 obrigatorio nome="horario_funcionamento" label="Horário de funcionamento (padrão)" placeholder="Ex: 10h às 22h" hint="Esse é o horário considerado para todos os dias selecionados acima, a não ser que você adicione uma exceção abaixo." valor={campo('horario_funcionamento')} aoMudar={mudar('horario_funcionamento')} erro={erros.horario_funcionamento} />

                <Field span2 label="Horário diferente em algum dia?" hint="Opcional — ex: domingo ou sábado com horário reduzido." erro={erros.excecoes}>
                  <div className={s['excecoes-list']}>
                    {excecoes.map((ex) => (
                      <div className={s['excecao-row']} key={ex.id}>
                        <select value={ex.dia} aria-label="Dia da exceção" onChange={(e) => setExcecoes((l) => l.map((i) => i.id === ex.id ? { ...i, dia: e.target.value } : i))}>
                          {diasDisponiveis(ex.dia).map((d) => (
                            <option key={d} value={d}>{DIA_POR_EXTENSO[d]}</option>
                          ))}
                        </select>
                        <input type="text" placeholder="Ex: 12h às 18h" value={ex.horario} aria-label={`Horário para ${DIA_POR_EXTENSO[ex.dia as keyof typeof DIA_POR_EXTENSO]}`} onChange={(e) => setExcecoes((l) => l.map((i) => i.id === ex.id ? { ...i, horario: e.target.value } : i))} />
                        <button type="button" className={s['excecao-remove']} aria-label="Remover exceção" onClick={() => setExcecoes((l) => l.filter((i) => i.id !== ex.id))}>×</button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={`${s.btn} ${s['btn-ghost']} ${s['btn-add-excecao']}`}
                    disabled={!dias.length || excecoes.length >= dias.length}
                    onClick={() => {
                      const usados = excecoes.map((e) => e.dia);
                      const livre = DIAS.find((d) => dias.includes(d) && !usados.includes(d));
                      if (!livre) return;
                      setExcecoes((l) => [...l, { id: Date.now(), dia: livre, horario: '' }]);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                    Adicionar horário diferente
                  </button>
                </Field>
              </div>
              <Navegacao etapa={etapa} voltar={voltar} avancar={avancar} />
            </div>
          </section>
        )}

        {etapa === 2 && (
          <section className={s.cardframe}>
            <div className={s.card}>
              <Cabecalho numero="02" titulo="Informações comerciais" texto="Ajuda a equipe do Clube a dimensionar a divulgação do seu benefício." />
              <div className={s['field-grid']}>
                <TextoField obrigatorio nome="ticket_medio" label="Ticket médio por pessoa (R$)" placeholder="Ex: 80,00" inputMode="decimal" valor={campo('ticket_medio')} aoMudar={mudar('ticket_medio')} erro={erros.ticket_medio} />
                <TextoField obrigatorio nome="vouchers_mes" label="Vouchers disponibilizados por mês" placeholder="Ex: 50" tipo="number" hint="Quantidade de vouchers que seu estabelecimento deseja disponibilizar aos assinantes por mês." valor={campo('vouchers_mes')} aoMudar={mudar('vouchers_mes')} erro={erros.vouchers_mes} />
              </div>
              <Navegacao etapa={etapa} voltar={voltar} avancar={avancar} />
            </div>
          </section>
        )}

        {etapa === 3 && (
          <section className={s.cardframe}>
            <div className={s.card}>
              <Cabecalho numero="03" titulo="Benefício oferecido aos assinantes" texto="Descreva com detalhes como funciona o benefício — é o que os assinantes vão ler." />
              <div className={`${s['field-grid']} ${s.single}`}>
                <TextoField obrigatorio nome="beneficio_oferecido" label="Qual o benefício oferecido aos assinantes?" placeholder="Ex: 20% de desconto no valor da conta" valor={campo('beneficio_oferecido')} aoMudar={mudar('beneficio_oferecido')} erro={erros.beneficio_oferecido} />
                <AreaField obrigatorio nome="descricao_funcionamento" label="Descrição detalhada de como o benefício funciona" placeholder="Explique o passo a passo de como o assinante usufrui do benefício" valor={campo('descricao_funcionamento')} aoMudar={mudar('descricao_funcionamento')} erro={erros.descricao_funcionamento} />
                <AreaField nome="condicoes_especificas" label="O benefício possui alguma condição ou regra específica?" placeholder="Deixe em branco se não houver condições específicas" valor={campo('condicoes_especificas')} aoMudar={mudar('condicoes_especificas')} />
                <TextoField obrigatorio nome="dias_horarios_beneficio" label="Dias e horários em que o benefício pode ser utilizado" placeholder="Ex: válido de segunda a sexta, das 18h às 22h" valor={campo('dias_horarios_beneficio')} aoMudar={mudar('dias_horarios_beneficio')} erro={erros.dias_horarios_beneficio} />
                <AreaField nome="excecoes_produtos" label="O benefício é válido para todos os produtos/serviços ou possui exceções?" placeholder="Ex: não válido para bebidas alcoólicas" valor={campo('excecoes_produtos')} aoMudar={mudar('excecoes_produtos')} />
                <TextoField nome="consumo_minimo" label="Existe consumo mínimo ou valor mínimo para utilização?" placeholder="Ex: sem valor mínimo" valor={campo('consumo_minimo')} aoMudar={mudar('consumo_minimo')} />
                <ChipGroup obrigatorio pequeno label="O benefício pode ser utilizado com outras promoções?" opcoes={['Sim', 'Não']} selecionados={combinavel ? [combinavel] : []} aoAlternar={(v) => { setCombinavel(v); setErros((e) => ({ ...e, combinavel: '' })); }} erro={erros.combinavel} />
                <AreaField obrigatorio nome="como_validar" label="Como o assinante deve apresentar/validar o benefício no estabelecimento?" placeholder="Ex: apresentar o card do Clube C+ no aplicativo antes do pagamento" valor={campo('como_validar')} aoMudar={mudar('como_validar')} erro={erros.como_validar} />
              </div>
              <Navegacao etapa={etapa} voltar={voltar} avancar={avancar} />
            </div>
          </section>
        )}

        {etapa === 4 && (
          <section className={s.cardframe}>
            <div className={s.card}>
              <Cabecalho numero="04" titulo="Canal de atendimento ao assinante" texto="Esse contato será usado pelos assinantes em caso de dúvidas sobre o benefício." />
              <div className={`${s['field-grid']} ${s.single}`}>
                <TextoField obrigatorio nome="whatsapp_atendimento" label="WhatsApp do estabelecimento para atendimento aos assinantes" placeholder="(00) 00000-0000" tipo="tel" inputMode="tel" valor={campo('whatsapp_atendimento')} aoMudar={(v) => mudar('whatsapp_atendimento')(mascaraTelefone(v))} erro={erros.whatsapp_atendimento} />
                <AreaField nome="orientacoes_assinante" label="Orientações importantes para o assinante antes de utilizar o benefício" placeholder="Ex: recomendamos reserva antecipada aos finais de semana" valor={campo('orientacoes_assinante')} aoMudar={mudar('orientacoes_assinante')} />
              </div>
              <Navegacao etapa={etapa} voltar={voltar} avancar={avancar} />
            </div>
          </section>
        )}

        {etapa === 5 && (
          <section className={s.cardframe}>
            <div className={s.card}>
              <Cabecalho numero="05" titulo="Redes sociais e presença digital" texto="Todos os campos são opcionais — preencha o que tiver." />
              <div className={s['field-grid']}>
                <TextoField nome="instagram" label="Instagram" placeholder="@seuestabelecimento" valor={campo('instagram')} aoMudar={mudar('instagram')} />
                <TextoField nome="facebook" label="Facebook" placeholder="facebook.com/seuestabelecimento" valor={campo('facebook')} aoMudar={mudar('facebook')} />
                <TextoField nome="tiktok" label="TikTok" placeholder="@seuestabelecimento" valor={campo('tiktok')} aoMudar={mudar('tiktok')} />
                <TextoField nome="site_oficial" label="Site oficial" placeholder="www.seuestabelecimento.com" valor={campo('site_oficial')} aoMudar={mudar('site_oficial')} />
                <TextoField span2 nome="google_maps" label="Google Maps / link do estabelecimento" placeholder="Link do Google Maps" valor={campo('google_maps')} aoMudar={mudar('google_maps')} />
              </div>
              <Navegacao etapa={etapa} voltar={voltar} avancar={avancar} />
            </div>
          </section>
        )}

        {etapa === 6 && (
          <section className={s.cardframe}>
            <div className={s.card}>
              <Cabecalho numero="06" titulo="Fotos e materiais de divulgação" texto="Envie fotos em alta qualidade da fachada, ambientes e principais produtos/serviços — quanto melhor o material, melhor a divulgação." />
              <div className={`${s['field-grid']} ${s.single}`}>
                <Field label="Fotos do estabelecimento" obrigatorio erro={erros.fotos} htmlFor="fotos">
                  <div className={s.dropzone}>
                    <IconeUpload />
                    <div className={s['dz-title']}>Clique para enviar fotos</div>
                    <div className={s['dz-sub']}>
                      Preferencialmente {MAX_FOTOS} fotos: fachada, ambientes e pratos/serviços
                    </div>
                    <input id="fotos" type="file" accept="image/*" multiple onChange={(e) => receberFotos(e.target.files)} />
                  </div>
                  {fotos.length > 0 && (
                    <div className={s['file-count']}>
                      <b>{fotos.length}</b> de {MAX_FOTOS} fotos selecionadas
                      {fotos.length < 3 && ' — recomendamos pelo menos 3'}
                      {' · '}
                      {formatarTamanho(totalBytes)} no total
                    </div>
                  )}
                  <div className={s['thumb-grid']}>
                    {fotos.map((f, i) => (
                      <div className={s.thumb} key={`${f.name}-${i}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(f)} alt={`Foto ${i + 1}`} />
                        <button type="button" aria-label={`Remover foto ${i + 1}`} onClick={() => setFotos((l) => l.filter((_, j) => j !== i))}>×</button>
                      </div>
                    ))}
                  </div>
                </Field>

                <Field label="Logo da marca" htmlFor="logo">
                  <div className={s.dropzone}>
                    <IconeUpload />
                    <div className={s['dz-title']}>Clique para enviar o logo</div>
                    <div className={s['dz-sub']}>Se possível, em alta resolução e fundo transparente (PNG)</div>
                    <input id="logo" type="file" accept="image/*" onChange={(e) => receberLogo(e.target.files)} />
                  </div>
                  {logo && (
                    <div className={s['logo-preview']}>
                      <div className={s.thumb}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(logo)} alt="Logo enviado" />
                      </div>
                      <span className={s.hint}>{logo.name}</span>
                    </div>
                  )}
                </Field>

                {comprimindo && (
                  <p className={s.hint} aria-live="polite">
                    Preparando as imagens para envio...
                  </p>
                )}
              </div>
              <Navegacao etapa={etapa} voltar={voltar} avancar={avancar} />
            </div>
          </section>
        )}

        {etapa === 7 && (
          <section className={s.cardframe}>
            <div className={s.card}>
              <Cabecalho numero="07" titulo="Descrição da marca" texto="Um texto envolvente ajuda a atrair mais assinantes para o seu negócio." />
              <div className={`${s['field-grid']} ${s.single}`}>
                <AreaField obrigatorio nome="sobre_estabelecimento" label="Conte um pouco sobre o seu estabelecimento" placeholder="História, proposta e estilo do seu negócio" valor={campo('sobre_estabelecimento')} aoMudar={mudar('sobre_estabelecimento')} erro={erros.sobre_estabelecimento} />
                <AreaField obrigatorio nome="descricao_experiencia" label="Descrição da experiência oferecida" placeholder="O que o cliente vive ao visitar seu estabelecimento" valor={campo('descricao_experiencia')} aoMudar={mudar('descricao_experiencia')} erro={erros.descricao_experiencia} />
                <AreaField obrigatorio nome="diferencial" label="O que torna sua marca especial ou diferente?" placeholder="Seu principal diferencial competitivo" valor={campo('diferencial')} aoMudar={mudar('diferencial')} erro={erros.diferencial} />
                <AreaField obrigatorio nome="principais_produtos_servicos" label="Principais produtos/serviços oferecidos" placeholder="Liste os carros-chefe do seu cardápio ou catálogo" valor={campo('principais_produtos_servicos')} aoMudar={mudar('principais_produtos_servicos')} erro={erros.principais_produtos_servicos} />
              </div>
              <Navegacao etapa={etapa} voltar={voltar} avancar={avancar} />
            </div>
          </section>
        )}

        {etapa === 8 && (
          <section className={s.cardframe}>
            <div className={s.card}>
              <Cabecalho numero="08" titulo="Observações" texto="Alguma regra, condição ou orientação adicional que os assinantes devem saber?" />
              <div className={`${s['field-grid']} ${s.single}`}>
                <AreaField nome="observacoes" label="Observações adicionais" placeholder="Campo livre — opcional" alturaMinima={130} valor={campo('observacoes')} aoMudar={mudar('observacoes')} />
              </div>
              <Navegacao etapa={etapa} voltar={voltar} avancar={avancar} />
            </div>
          </section>
        )}

        {etapa === 9 && (
          <section className={s.cardframe}>
            <div className={s.card}>
              <Cabecalho numero="09" titulo="Responsável pelo estabelecimento" texto="Quem responde oficialmente pela parceria com o Clube Curta Mais." />
              <div className={s['field-grid']}>
                <TextoField span2 obrigatorio nome="responsavel_nome" label="Nome do responsável" placeholder="Nome completo" valor={campo('responsavel_nome')} aoMudar={mudar('responsavel_nome')} erro={erros.responsavel_nome} />
                <TextoField obrigatorio nome="responsavel_cargo" label="Cargo / função" placeholder="Ex: Sócio-proprietário" valor={campo('responsavel_cargo')} aoMudar={mudar('responsavel_cargo')} erro={erros.responsavel_cargo} />
                <TextoField obrigatorio nome="responsavel_whatsapp" label="WhatsApp" placeholder="(00) 00000-0000" tipo="tel" inputMode="tel" valor={campo('responsavel_whatsapp')} aoMudar={(v) => mudar('responsavel_whatsapp')(mascaraTelefone(v))} erro={erros.responsavel_whatsapp} />
              </div>
              <Navegacao etapa={etapa} voltar={voltar} avancar={avancar} rotuloAvancar="Revisar cadastro" />
            </div>
          </section>
        )}

        {etapa === 10 && (
          <section className={s.cardframe}>
            <div className={s.card}>
              <Cabecalho numero="10" titulo="Revisão e aceite" texto="Confira as informações antes de enviar o seu cadastro." />

              <Revisao
                dados={dados}
                categoria={categoria}
                dias={dias}
                excecoes={excecoesResumo()}
                combinavel={combinavel}
                fotos={fotos.length}
                logo={logo?.name ?? ''}
                irPara={irPara}
              />

              <div className={s.accept}>
                <input type="checkbox" id="aceite_divulgacao" checked={aceiteDivulgacao} onChange={(e) => setAceiteDivulgacao(e.target.checked)} />
                <label htmlFor="aceite_divulgacao">
                  Declaro que as informações fornecidas neste formulário estão
                  corretas e autorizo o Curta Mais a utilizar as informações,
                  imagens, logo e materiais enviados para a divulgação da marca
                  como parceira do Clube Curta Mais, nos canais relacionados ao
                  Clube.
                </label>
              </div>
              {erros.aceite_divulgacao && (
                <span className={`${s['chip-error']} ${s.show}`}>{erros.aceite_divulgacao}</span>
              )}

              <div className={s.accept}>
                <input type="checkbox" id="aceite_condicoes" checked={aceiteCondicoes} onChange={(e) => setAceiteCondicoes(e.target.checked)} />
                <label htmlFor="aceite_condicoes">
                  Estou de acordo com as condições do benefício informado e me
                  comprometo a respeitá-las durante o período de parceria, bem
                  como atender com excelência o assinante e validar o card para
                  controle de todos.
                </label>
              </div>
              {erros.aceite_condicoes && (
                <span className={`${s['chip-error']} ${s.show}`}>{erros.aceite_condicoes}</span>
              )}

              <div className={s['step-nav']}>
                <button type="button" className={`${s.btn} ${s['btn-ghost']}`} onClick={voltar} disabled={enviando}>
                  <SetaVolta />
                  Voltar
                </button>
                <button type="submit" className={`${s.btn} ${s['btn-primary']}`} disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Enviar cadastro'}
                  {!enviando && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {erroEnvio && (
                <div className={`${s['status-banner']} ${s.error} ${s.show}`} role="alert">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v5M12 16h.01" />
                  </svg>
                  <span>{erroEnvio}</span>
                </div>
              )}
            </div>
          </section>
        )}
      </form>

      <footer>
        <p>Clube Curta Mais · Formulário de cadastro de parceiros</p>
        <p>
          Dúvidas? Fale com a gente:{' '}
          <Link href={`tel:${site.telefone}`}>{site.telefoneFormatado}</Link>
        </p>
      </footer>
    </>
  );
}

type Grupo = { titulo: string; etapa: number; linhas: [string, string][] };

function Revisao({
  dados,
  categoria,
  dias,
  excecoes,
  combinavel,
  fotos,
  logo,
  irPara,
}: {
  dados: Record<string, string>;
  categoria: string | null;
  dias: string[];
  excecoes: string;
  combinavel: string | null;
  fotos: number;
  logo: string;
  irPara: (n: number) => void;
}) {
  const v = (k: string) => (dados[k] ?? '').trim();
  const mostrar = (x: string) => (x && x.length ? x : '—');

  const grupos: Grupo[] = [
    {
      titulo: 'Estabelecimento',
      etapa: 1,
      linhas: [
        ['Nome do estabelecimento', mostrar(v('nome_estabelecimento'))],
        ['Responsável pelo cadastro', mostrar(v('nome_responsavel'))],
        ['Telefone/WhatsApp', mostrar(v('telefone_responsavel'))],
        ['E-mail', mostrar(v('email'))],
        ['Categoria', mostrar(categoria ?? '')],
        ['Endereço', mostrar(v('endereco_completo'))],
        ['Cidade', mostrar(v('cidade'))],
        ['CEP', mostrar(v('cep'))],
        ['Horário padrão', mostrar(v('horario_funcionamento'))],
        ['Dias de funcionamento', mostrar(dias.join(', '))],
        ['Exceções de horário', mostrar(excecoes)],
      ],
    },
    {
      titulo: 'Comercial',
      etapa: 2,
      linhas: [
        ['Ticket médio', v('ticket_medio') ? `R$ ${v('ticket_medio')}` : '—'],
        ['Vouchers/mês', mostrar(v('vouchers_mes'))],
      ],
    },
    {
      titulo: 'Benefício',
      etapa: 3,
      linhas: [
        ['Benefício', mostrar(v('beneficio_oferecido'))],
        ['Como funciona', mostrar(v('descricao_funcionamento'))],
        ['Condições específicas', mostrar(v('condicoes_especificas'))],
        ['Dias e horários', mostrar(v('dias_horarios_beneficio'))],
        ['Exceções de produtos', mostrar(v('excecoes_produtos'))],
        ['Consumo mínimo', mostrar(v('consumo_minimo'))],
        ['Combina com outras promoções', mostrar(combinavel ?? '')],
        ['Como validar', mostrar(v('como_validar'))],
      ],
    },
    {
      titulo: 'Atendimento',
      etapa: 4,
      linhas: [
        ['WhatsApp de atendimento', mostrar(v('whatsapp_atendimento'))],
        ['Orientações ao assinante', mostrar(v('orientacoes_assinante'))],
      ],
    },
    {
      titulo: 'Redes sociais',
      etapa: 5,
      linhas: [
        ['Instagram', mostrar(v('instagram'))],
        ['Facebook', mostrar(v('facebook'))],
        ['TikTok', mostrar(v('tiktok'))],
        ['Site', mostrar(v('site_oficial'))],
        ['Google Maps', mostrar(v('google_maps'))],
      ],
    },
    {
      titulo: 'Fotos e materiais',
      etapa: 6,
      linhas: [
        ['Fotos selecionadas', fotos ? `${fotos} foto(s)` : '—'],
        ['Logo', logo || 'Não enviado'],
      ],
    },
    {
      titulo: 'Descrição da marca',
      etapa: 7,
      linhas: [
        ['Sobre o estabelecimento', mostrar(v('sobre_estabelecimento'))],
        ['Experiência oferecida', mostrar(v('descricao_experiencia'))],
        ['Diferencial', mostrar(v('diferencial'))],
        ['Produtos e serviços', mostrar(v('principais_produtos_servicos'))],
      ],
    },
    {
      titulo: 'Observações',
      etapa: 8,
      linhas: [['Observações adicionais', mostrar(v('observacoes'))]],
    },
    {
      titulo: 'Responsável pelo estabelecimento',
      etapa: 9,
      linhas: [
        ['Nome', mostrar(v('responsavel_nome'))],
        ['Cargo/função', mostrar(v('responsavel_cargo'))],
        ['WhatsApp', mostrar(v('responsavel_whatsapp'))],
      ],
    },
  ];

  return (
    <div>
      {grupos.map((g) => (
        <div className={s['review-group']} key={g.titulo}>
          <div className={s['review-group-head']}>
            <h3>{g.titulo}</h3>
            <button
              type="button"
              className={s['review-edit']}
              onClick={() => irPara(g.etapa)}
            >
              Editar
            </button>
          </div>
          <dl className={s['review-rows']}>
            {g.linhas.map(([rotulo, valor]) => (
              <div className={s['review-row']} key={rotulo}>
                <dt>{rotulo}</dt>
                <dd>{valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
