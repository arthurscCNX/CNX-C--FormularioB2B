# LP Clube Curta Mais — Migração para stack de produção

**Data:** 2026-09-18
**Autor:** Yuri Miranda (decisões) + Claude (desenho)
**Status:** aprovado para implementação

---

## 1. Contexto

O projeto hoje é um site estático servido pela Vercel, composto de dois arquivos HTML
escritos à mão:

| Arquivo | Linhas | Conteúdo |
|---|---|---|
| `index.html` | 4.501 | Landing page institucional — 2.862 linhas de CSS e 635 de JS embutidos |
| `formularioB2B/index.html` | 1.197 | Formulário de cadastro de parceiro, 10 etapas, 38 campos |

O `index.html` foi reconstruído em 16/09/2026 a partir de um export WordPress
(`.wpress`), consolidando widgets HTML do Elementor numa página só. O formulário B2B
nasceu antes, separado, e por isso usa outra fonte (Montserrat) que o site (Sora + DM
Sans).

### Problemas do estado atual

1. **Monolito de 4.501 linhas.** Estilo, marcação e comportamento no mesmo arquivo.
   Qualquer alteração exige varrer o arquivo inteiro.
2. **O CTA principal não faz nada.** "Quero Ser Membro" e "Começar agora" apenas rolam
   a página. O site capta parceiro, mas não capta membro.
3. **O formulário B2B provavelmente não entrega.** `POST` direto do navegador para
   `https://gestao.curtamais.com.br/api/parceiros/cadastro`, que responde **401
   Unauthorized** (verificado em 18/09/2026). O envio não carrega credencial alguma.
4. **Fotos de banco de imagens.** Todas as imagens de parceiros e experiências vêm do
   Unsplash — conteúdo genérico, hospedado fora, sem licença verificada.
5. **Sem SEO nem Open Graph.** Colar o link no WhatsApp — principal canal do cliente —
   não gera prévia com capa.
6. **Sem configuração de região.** Não há `vercel.json`; funções rodariam em `iad1`.

---

## 2. Objetivo

Reconstruir o projeto como uma aplicação Next.js componentizada, mantendo o resultado
visual atual, tornando o envio do formulário B2B confiável e preparando o site para
busca e compartilhamento.

### Não-objetivos (decididos explicitamente)

| Fora de escopo | Motivo |
|---|---|
| Banco de dados / Supabase | Não há dado a persistir: sem login, sem checkout, sem catálogo dinâmico |
| Autenticação e área do membro | A venda acontece fora do site |
| Checkout e gateway de pagamento | Idem |
| Painel `/admin` | Conteúdo fica versionado no código, editado pelo Yuri |
| Redesign visual | O visual atual está aprovado e deve ser preservado |
| Bateria de testes automatizados | Reservada para o momento imediatamente anterior ao deploy de produção |

---

## 3. Decisões fechadas

| # | Decisão | Escolha | Razão |
|---|---|---|---|
| D1 | Stack | Next.js (App Router) + TypeScript + Vercel `gru1` | Mesma base dos demais projetos ConexaX; caminho aberto caso o escopo cresça |
| D2 | Banco de dados | Nenhum | Não há dado a persistir |
| D3 | Estilo | CSS Modules + tokens em CSS custom properties. **Sem Tailwind** | Como o CSS existente será portado, o Tailwind ficaria ocioso e criaria dois sistemas de estilo concorrentes |
| D4 | Visual | Portar o CSS atual, preservando a aparência | Visual já aprovado; reescrever custaria caro e arriscaria regressão |
| D5 | Conteúdo | Arquivos de dados em `content/*.ts` | Permite ao Yuri editar preço, parceiro ou depoimento sem tocar em JSX |
| D6 | Formulário B2B | Proxy server-side via Route Handler | A credencial do gestao não pode existir no navegador (ver §5) |
| D7 | CTA "Quero Ser Membro" | WhatsApp provisoriamente | Decisão de destino final adiada pelo Yuri |
| D8 | Números do site | São reais, mantidos | Confirmado pelo Yuri em 18/09/2026: +500 membros satisfeitos, +120 parceiros exclusivos, R$ +611 de economia média por membro |

---

## 4. Arquitetura

### 4.1 Estrutura de diretórios

```
app/
  layout.tsx                 fontes locais, metadata global, analytics
  page.tsx                   home — compõe as seções
  globals.css                reset + tokens (cores, fontes, raios, sombras)
  formulario-b2b/
    page.tsx                 casca da página do formulário
  api/
    parceiros/route.ts       proxy server-side para o gestao
  sitemap.ts
  robots.ts
  opengraph-image.tsx
components/
  home/
    UrgencyBar/              barra de urgência do topo
    Header/                  navbar + drawer mobile
    Hero/
    Numbers/                 contadores animados (500 / 120 / 611)
    Partners/
    Experiences/
    HowItWorks/
    Calculator/              calculadora de economia
    Testimonials/            depoimentos + barra do Google
    Plans/                   alternância mensal/anual + seletor de membros
    Guarantee/
    Faq/
    Footer/
  form/
    PartnerForm/             wizard de 10 etapas
content/
  stats.ts  partners.ts  experiences.ts  testimonials.ts
  plans.ts  faq.ts  site.ts
lib/
  schemas.ts                 validação Zod compartilhada
  image-compress.ts          compressão de imagem no cliente
public/img/
vercel.json
```

Cada componente é uma pasta com `index.tsx` + `styles.module.css`, recebendo o CSS
correspondente extraído do `index.html` atual. O isolamento do CSS Module elimina o
risco de um estilo vazar para outra seção — problema real num arquivo de 2.862 linhas.

### 4.2 Modelo de conteúdo

Nada de texto de negócio dentro de JSX. Cada seção lê de `content/`:

```ts
// content/plans.ts
export const plans = [
  { id: 'mensal', nome: 'Mensal', preco: 32.90, ... },
] as const;
```

Critério: **o Yuri deve conseguir alterar um preço, trocar uma foto ou acrescentar um
parceiro editando um único arquivo de dados**, sem abrir componente algum.

### 4.3 Renderização

Página estática, gerada no build. Nenhuma seção depende de dado em tempo de execução.
Os únicos trechos interativos (`'use client'`) são: drawer do menu, alternância de
planos, seletor de membros, calculadora, acordeão do FAQ, contadores animados e o
wizard do formulário.

---

## 5. Formulário B2B

### 5.1 Fluxo atual (quebrado)

```
navegador  ──POST multipart──▶  gestao.curtamais.com.br/api/parceiros/cadastro
                                 └─▶ 401 Unauthorized
```

Sem credencial, sem validação de servidor, sem proteção contra robô, e com a URL do
endpoint exposta no código-fonte da página.

### 5.2 Fluxo novo

```
navegador ──POST──▶ /api/parceiros (Route Handler, gru1) ──POST+credencial──▶ gestao
```

O Route Handler:

1. Valida o corpo com o schema Zod de `lib/schemas.ts` — o mesmo usado no cliente, de
   modo que as regras não divergem.
2. Rejeita envios com o campo honeypot preenchido.
3. Aplica limite por IP (proteção contra envio em massa).
4. Repassa ao gestao acrescentando a credencial lida de variável de ambiente
   (`GESTAO_API_URL`, `GESTAO_API_TOKEN`) — **jamais com prefixo `NEXT_PUBLIC_`**.
5. Traduz a resposta: sucesso, erro de validação (com os campos), ou indisponibilidade
   do gestao, com mensagem honesta ao parceiro.

### 5.3 Arquivos

O formulário aceita 1 logo e de 1 a 10 fotos. O limite de corpo de requisição da Vercel
é de 4,5 MB, e fotos de celular passam disso com folga.

Mitigação: `lib/image-compress.ts` redimensiona cada imagem no navegador (lado maior de
2.000 px, JPEG de qualidade 0,82) antes do envio, e o wizard mostra o tamanho total
acumulado. Se ainda assim o total exceder o teto, o envio é bloqueado com mensagem
explicando quantas fotos remover.

### 5.4 Dependência externa — **bloqueante para a etapa 3**

A implementação da etapa 3 exige, de quem mantém o `gestao.curtamais.com.br`:

- a URL definitiva da rota de cadastro;
- a forma de autenticação e a credencial correspondente;
- o formato esperado do corpo (`multipart/form-data` com os 38 campos + arquivos, ou
  outro) e o formato da resposta de erro.

O comentário no código atual (`TODO (time gestao.curtamais.com.br): substituir
ENDPOINT_URL pela rota real`) indica que essa integração nunca foi concluída.

**Até essa informação chegar**, a rota `/api/parceiros` é implementada com contrato
provisório e bandeira de ambiente: sem `GESTAO_API_TOKEN` configurado, ela valida o
envio, devolve sucesso ao usuário e registra o cadastro completo no log da função, para
que nenhum lead se perca durante o período de integração.

---

## 6. Performance e SEO

| Item | Hoje | Depois |
|---|---|---|
| Fontes | 3 famílias (Sora, DM Sans, Montserrat) buscadas no Google Fonts | `next/font` com arquivos locais, sem requisição externa nem salto de layout |
| Imagens | Unsplash, tamanho único, hospedagem externa | `next/image` — AVIF/WebP, tamanho por dispositivo, carregamento tardio |
| Metadata | Ausente | Metadata API: título, descrição, canônica por rota |
| Open Graph | Ausente | `opengraph-image` — prévia com capa ao colar o link no WhatsApp |
| Dados estruturados | Ausente | JSON-LD `Organization` + `FAQPage` |
| `sitemap.xml` / `robots.txt` | Ausentes | Gerados pelo Next |
| Medição | Nenhuma | Vercel Analytics + Speed Insights |

A unificação das três famílias tipográficas em duas fica registrada como sugestão, a ser
decidida pelo Yuri na etapa 4 — não é executada por conta própria, por alterar o visual
aprovado.

---

## 7. Deploy

- `vercel.json` com `"regions": ["gru1"]` — São Paulo, junto do público e do gestao.
- Branch `dev` → deploy de preview, onde o Yuri valida cada etapa.
- Branch `main` → produção, **somente com autorização expressa do Yuri**.
- Commits em português, autoria `yuri@conexax.com.br`.

### Compatibilidade de URLs

`/formularioB2B` pode já ter sido enviado a parceiros. A rota nova é
`/formulario-b2b`, e `/formularioB2B` passa a redirecionar permanentemente para ela.
Link antigo não pode quebrar.

---

## 8. Testes

Não há suíte automatizada neste escopo, por decisão do Yuri: a validação de cada etapa é
feita por ele no ambiente publicado. A bateria completa — segurança, ponta a ponta,
exploração de falhas — fica reservada ao momento imediatamente anterior ao primeiro
deploy de produção, e é disparada por solicitação dele.

Verificação mínima durante a implementação: `next build` limpo, `tsc --noEmit` sem erro e
lint sem aviso, a cada etapa entregue.

---

## 9. Etapas de entrega

Cada etapa termina com commit, push para `dev` e um endereço de preview para o Yuri
testar. A etapa seguinte só começa depois do retorno dele.

| Etapa | Entrega | Critério de aceite |
|---|---|---|
| 1 | Projeto Next.js, TypeScript, tokens, `vercel.json` em `gru1`, deploy de preview | O endereço abre |
| 2 | Home portada — 13 seções componentizadas, conteúdo em `content/`, CTA de membro apontando ao WhatsApp | Comparação lado a lado com o site atual, sem diferença visual |
| 3 | `/formulario-b2b` + `/api/parceiros` + compressão de imagem + redirecionamento do link antigo | Cadastro de teste completo, do início ao fim |
| 4 | SEO, Open Graph, JSON-LD, sitemap, analytics, substituição das fotos do Unsplash | Link colado no WhatsApp exibe a capa |

---

## 10. Pendências

| # | Pendência | Responsável | Bloqueia |
|---|---|---|---|
| P1 | Credencial, URL e contrato da API do gestao | Yuri / time do gestao | Etapa 3 (há contorno provisório) |
| P2 | Fotos reais de parceiros e experiências | Yuri | Etapa 4 |
| P3 | Destino final do CTA "Quero Ser Membro" | Yuri | Nada — WhatsApp cobre no interim |
| P4 | Cópia dos cadastros por e-mail (Resend) como rede de segurança | Yuri | Nada — proposto, não aprovado |
| P5 | Unificar as três famílias tipográficas em duas | Yuri | Nada — sugestão |
| P6 | Ativar ou descartar a barra flutuante `.sticky-cta` (CSS existe, HTML nunca existiu) | Yuri | Nada — CSS órfão |
| P7 | Domínio definitivo de produção (para canônica, sitemap e Open Graph) | Yuri | Etapa 4 |
| P8 | Autenticidade dos depoimentos e do selo de avaliação do Google | Yuri | Nada |
| P9 | Lista real de parceiros — o legado trazia apenas rótulos de rascunho | Yuri | Etapa 2 |

---

## 11. Riscos

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Regressão visual ao portar o CSS | Média | Portar seção por seção, comparando com o site atual a cada uma |
| API do gestao nunca ser disponibilizada | Média | Contorno de §5.4 mantém os leads registrados; P4 vira necessidade se persistir |
| Fotos estourarem o limite de 4,5 MB | Alta sem tratamento | Compressão no cliente + bloqueio com mensagem clara |
| Link antigo `/formularioB2B` quebrar | Baixa | Redirecionamento permanente, verificado na etapa 3 |
