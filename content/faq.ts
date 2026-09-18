export interface FaqItem {
  id: string;
  pergunta: string;
  resposta: string;
}

export const faq: FaqItem[] = [
  {
    id: 'card',
    pergunta: 'Como funciona o card de benefícios?',
    resposta:
      'Após assinar, você recebe acesso ao seu card digital no app. Na hora de usar um benefício, basta apresentar o card (print ou tela do celular) no estabelecimento parceiro. Simples, rápido e sem complicação.',
  },
  {
    id: 'frequencia',
    pergunta: 'Posso usar os benefícios quantas vezes quiser?',
    resposta:
      'Sim! Você pode usar cada benefício uma vez por período (mensal, semestral ou anual conforme o seu plano). Com +120 parceiros disponíveis, dá pra curtir algo diferente praticamente toda semana.',
  },
  {
    id: 'duas-pessoas',
    pergunta: 'O clube funciona para duas pessoas?',
    resposta:
      'Depende do parceiro — muitos benefícios são válidos para até 2 pessoas. A descrição de cada experiência indica claramente quantas pessoas estão inclusas no benefício.',
  },
  {
    id: 'cancelamento',
    pergunta: 'Posso cancelar a qualquer momento?',
    resposta:
      'Sim, você pode cancelar quando quiser direto pela plataforma, sem necessidade de ligar ou enviar e-mail. O acesso continua ativo até o fim do período já pago.',
  },
  {
    id: 'novidades',
    pergunta: 'Novos parceiros e experiências são adicionados?',
    resposta:
      'Toda semana novos parceiros e experiências são adicionados à plataforma. Você recebe uma notificação sempre que algo novo do seu interesse for disponibilizado.',
  },
  {
    id: 'planos',
    pergunta: 'Qual a diferença entre os planos?',
    resposta:
      'O acesso às experiências é o mesmo em todos os planos. A diferença é o preço: quanto maior o período, maior o desconto. O plano anual sai por R$ 32,90/mês — 41% mais barato que o mensal.',
  },
];
