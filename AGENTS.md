# LP Clube Curta Mais

Landing page institucional do Clube Curta Mais (Goiânia) mais o formulário de cadastro
de parceiros B2B. Projeto de cliente, tocado pela ConexaX.

`CLAUDE.md` importa este arquivo — os dois dizem a mesma coisa.

## O que este projeto é, e o que não é

Site de captação: convence o visitante, manda o membro interessado para o WhatsApp e o
estabelecimento parceiro para o formulário B2B. A venda e a cobrança acontecem fora
daqui.

**Não tem** banco de dados, login, área do membro, checkout nem painel administrativo.
Se uma tarefa parecer pedir qualquer um desses, é sinal de que o escopo mudou —
perguntar ao Yuri antes de construir.

## Stack

Next.js 16 (App Router) · TypeScript · CSS Modules · Vercel na região `gru1`.

- **Sem Tailwind.** O estilo veio portado de CSS escrito à mão e vive em CSS Modules,
  uma pasta por componente. Tokens globais só em `app/globals.css`.
- **Sem Supabase.** Não há o que persistir.
- Fontes por `next/font/google` (Sora para títulos, DM Sans para corpo), baixadas no
  build e servidas pelo próprio domínio.

## Marca

Cliente Curta Mais, **não** ConexaX: laranja `--orange: #FF6B00` sobre fundo
`--bg: #0a0a0a`. O verde da ConexaX não entra aqui. Nunca escrever cor na mão — usar os
tokens de `app/globals.css`.

## Regras de conteúdo

- **Texto de negócio não mora em JSX.** Preço, depoimento, experiência, pergunta do FAQ
  e número — tudo em `content/*.ts`, para o Yuri editar sozinho.
- **Nada de dado fictício na tela.** Sem dado real, estado vazio explicando a ausência.
  Foi por isso que `content/partners.ts` nasceu vazio.
- Os números do site são reais: +500 membros satisfeitos, +120 parceiros exclusivos,
  R$ +611 de economia média por membro.

## Pastas

| Pasta | O que guarda |
|---|---|
| `app/` | rotas, layout, tokens globais, rotas de API |
| `components/home/` | uma pasta por seção, com `index.tsx` e `styles.module.css` |
| `content/` | o conteúdo editável |
| `legacy/` | o site em HTML de onde tudo é portado — **apagar só ao fim da migração** |
| `public/assets/img/` | imagens herdadas; o caminho `/assets/img/...` é usado pelo legado |
| `docs/superpowers/` | especificação e plano de implementação |

## Integração com o sistema de gestão

O cadastro de parceiro **não** vai direto do navegador para o
`gestao.curtamais.com.br` — passa por `app/api/parceiros/route.ts`, que guarda a
credencial no servidor. `GESTAO_API_URL` e `GESTAO_API_TOKEN` são server-only e
**nunca** levam prefixo `NEXT_PUBLIC_`.

## Git e deploy

- Trabalho na branch `dev`. **Produção sai da `main` e só com autorização expressa do
  Yuri.**
- Commits em português, autoria `yuri@conexax.com.br`.
- Verificação antes de todo commit: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Não há suíte de testes automatizados, por decisão do Yuri. A bateria completa fica
  para imediatamente antes do primeiro deploy de produção, e é ele quem pede.
