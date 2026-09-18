import { z } from 'zod';

export const CATEGORIAS = [
  'Gastronomia',
  'Lazer',
  'Turismo',
  'Entretenimento',
  'Bem-estar',
  'Serviços',
  'Hospedagem',
] as const;

export const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const;

export const DIA_POR_EXTENSO: Record<(typeof DIAS)[number], string> = {
  Seg: 'Segunda-feira',
  Ter: 'Terça-feira',
  Qua: 'Quarta-feira',
  Qui: 'Quinta-feira',
  Sex: 'Sexta-feira',
  Sáb: 'Sábado',
  Dom: 'Domingo',
};

export const MAX_FOTOS = 10;
/** Teto por arquivo aceito pelo servidor, já com folga sobre o que o cliente envia. */
export const MAX_BYTES_ARQUIVO = 4 * 1024 * 1024;
export const TIPOS_IMAGEM_ACEITOS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/heic',
  'image/heif',
] as const;

/** Tetos de tamanho. O cliente não limita, então quem limita é o servidor. */
const MAX_CURTO = 300;
const MAX_LONGO = 5000;

const obrigatorio = (campo: string, max = MAX_CURTO) =>
  z
    .string()
    .trim()
    .min(1, `Informe ${campo}.`)
    .max(max, `Texto muito longo (máximo de ${max} caracteres).`);

const opcional = (max = MAX_CURTO) =>
  z
    .string()
    .trim()
    .max(max, `Texto muito longo (máximo de ${max} caracteres).`)
    .default('');

/**
 * Contrato de envio do cadastro de parceiro.
 *
 * As mesmas regras valem no navegador e no servidor. O nível de exigência é o
 * do formulário legado: nem mais rígido, nem mais frouxo — mudar isso é decisão
 * do Yuri, não minha.
 */
export const partnerSchema = z.object({
  // 1 — Dados do estabelecimento
  nome_estabelecimento: obrigatorio('o nome do estabelecimento'),
  nome_responsavel: obrigatorio('o nome do responsável pelo cadastro'),
  telefone_responsavel: obrigatorio('o telefone do responsável'),
  email: z.string().trim().max(MAX_CURTO).email('E-mail inválido.'),
  categoria: z.enum(CATEGORIAS, { message: 'Selecione uma categoria.' }),
  endereco_completo: obrigatorio('o endereço completo'),
  cidade: obrigatorio('a cidade'),
  cep: obrigatorio('o CEP'),
  dias_funcionamento: obrigatorio('ao menos um dia de funcionamento'),
  horario_funcionamento: obrigatorio('o horário de funcionamento'),
  horario_excecoes: opcional(MAX_LONGO),

  // 2 — Informações comerciais
  ticket_medio: obrigatorio('o ticket médio'),
  vouchers_mes: obrigatorio('a quantidade de vouchers por mês'),

  // 3 — Benefício oferecido
  beneficio_oferecido: obrigatorio('o benefício oferecido'),
  descricao_funcionamento: obrigatorio('como o benefício funciona', MAX_LONGO),
  condicoes_especificas: opcional(MAX_LONGO),
  dias_horarios_beneficio: obrigatorio('os dias e horários do benefício'),
  excecoes_produtos: opcional(MAX_LONGO),
  consumo_minimo: opcional(),
  combinavel_outras_promocoes: z.enum(['Sim', 'Não'], {
    message: 'Selecione uma opção.',
  }),
  como_validar: obrigatorio('como o assinante valida o benefício', MAX_LONGO),

  // 4 — Canal de atendimento
  whatsapp_atendimento: obrigatorio('o WhatsApp de atendimento'),
  orientacoes_assinante: opcional(MAX_LONGO),

  // 5 — Redes sociais (todos opcionais)
  instagram: opcional(),
  facebook: opcional(),
  tiktok: opcional(),
  site_oficial: opcional(),
  google_maps: opcional(),

  // 7 — Descrição da marca
  sobre_estabelecimento: obrigatorio('a descrição do estabelecimento', MAX_LONGO),
  descricao_experiencia: obrigatorio('a descrição da experiência', MAX_LONGO),
  diferencial: obrigatorio('o diferencial da marca', MAX_LONGO),
  principais_produtos_servicos: obrigatorio('os principais produtos ou serviços', MAX_LONGO),

  // 8 — Observações
  observacoes: opcional(MAX_LONGO),

  // 9 — Responsável
  responsavel_nome: obrigatorio('o nome do responsável'),
  responsavel_cargo: obrigatorio('o cargo do responsável'),
  responsavel_whatsapp: obrigatorio('o WhatsApp do responsável'),

  // 10 — Aceites
  aceite_divulgacao: z.literal('true', {
    message: 'É necessário autorizar o uso das informações.',
  }),
  aceite_condicoes: z.literal('true', {
    message: 'É necessário concordar com as condições.',
  }),

  // Metadados
  enviado_em: z.string().max(40),
  origem: z.literal('formulario_b2b_site'),
});

export type PartnerInput = z.infer<typeof partnerSchema>;

/**
 * Campo-armadilha: fica escondido e um humano nunca o preenche. Se vier com
 * conteúdo, o envio é de robô.
 */
export const CAMPO_ARMADILHA = 'website';
