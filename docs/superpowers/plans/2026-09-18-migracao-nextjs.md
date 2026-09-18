# LP Clube Curta Mais — Plano de Implementação

> **Para executores:** implementar tarefa a tarefa, na ordem. Cada tarefa termina em
> commit e entrega verificável. Passos usam caixa de seleção (`- [ ]`).

**Objetivo:** Reconstruir a landing page e o formulário B2B como aplicação Next.js
componentizada, preservando o visual atual e tornando o envio do formulário confiável.

**Arquitetura:** App Router com página estática gerada no build. O CSS existente é
portado para CSS Modules, uma pasta por seção. O conteúdo de negócio sai do JSX e vai
para arquivos de dados tipados em `content/`. O formulário B2B deixa de falar direto com
o `gestao.curtamais.com.br` e passa por um Route Handler que guarda a credencial.

**Stack:** Next.js (App Router) · TypeScript · CSS Modules · Zod · Vercel (`gru1`)

**Spec:** `docs/superpowers/specs/2026-09-18-stack-lp-clube-curta-mais-design.md`

## Restrições globais

- **Sem banco de dados.** Nenhum Supabase, nenhuma persistência.
- **Sem Tailwind.** Estilo exclusivamente por CSS Modules + tokens em
  `app/globals.css`.
- **Sem suíte de testes automatizados** (decisão do Yuri). Verificação de cada tarefa:
  `npx tsc --noEmit` sem erro, `npm run build` limpo, `npm run lint` sem aviso, e
  conferência visual no preview.
- **Visual idêntico ao atual.** Nenhuma alteração de cor, espaçamento, tipografia ou
  animação sem aprovação explícita do Yuri.
- **Nada de dado fictício na tela.** Os números são reais e ficam: +500 membros
  satisfeitos, +120 parceiros exclusivos, R$ +611 de economia média por membro.
- Segredos **nunca** com prefixo `NEXT_PUBLIC_`.
- Commits em português, autoria `yuri@conexax.com.br`.
- Trabalho na branch `dev`. Push para `main` **somente com autorização expressa do
  Yuri**.
- Cor de marca do cliente: laranja `--orange: #FF6B00` sobre fundo `--bg: #0a0a0a`.
  **Esta é a marca Curta Mais, não a ConexaX** — o verde ConexaX não entra aqui.

---

## Mapa do arquivo atual

Tudo é portado de `index.html` (4.501 linhas). CSS: linhas **12–2873**. Corpo: **2875–4501**.

| # | Componente | HTML | Script |
|---|---|---|---|
| 1 | UrgencyBar | 2881–2914 | parte de 2952–2994 |
| 2 | Header + Drawer | 2915–2951 | 2952–2994 |
| 3 | Hero (spotlight) | 2997–3054 | — |
| 4 | Numbers | 3057–3098 | 3100–3216 |
| 5 | Partners | 3219–3271 | — |
| 6 | Experiences | 3274–3437 | — |
| 7 | HowItWorks | 3440–3539 | 3541–3586 |
| 8 | Calculator | 3589–3655 | 3657–3691 |
| 9 | Testimonials | 3694–3799 | 3801–3833 |
| 10 | Plans | 3836–3940 | 3942–4257 |
| 11 | Guarantee | 4260–4273 | 4275–4285 |
| 12 | Faq | 4288–4360 | 4362–4395 |
| 13 | Footer | 4398–4495 | — |

O CSS traz marcadores `/* ===== NN-nome.html ===== */` herdados dos widgets do
Elementor, que delimitam com precisão o trecho de cada seção:

| Bloco | Linhas CSS | Destino |
|---|---|---|
| (reset global) | 13–21 | `app/globals.css` |
| 01 faixa + header | 22–462 | `UrgencyBar`, `Header` |
| 02 hero | 463–797 | `Hero` |
| 03 números | 798–939 | `Numbers` |
| 04 parceiros | 940–1134 | `Partners` |
| 05 experiências | 1135–1372 | `Experiences` |
| 06 como funciona | 1373–1549 | `HowItWorks` |
| 07 calculadora | 1550–1734 | `Calculator` |
| 08 depoimentos | 1735–1993 | `Testimonials` |
| 09 planos | 1994–2380 | `Plans` |
| 10 garantia | 2381–2447 | `Guarantee` |
| 11 FAQ | 2448–2550 | `Faq` |
| 12 rodapé | 2551–2771 | `Footer` |
| 13 sticky-cta | 2772–2873 | **descartar** |

**Código morto:** o bloco 13 (`.sticky-cta`, CSS 2772–2873) não tem HTML
correspondente — o widget tinha estilo e corpo vazio. Não portar; decisão do Yuri na
Tarefa 15 (pendência P6).

**Regra de tipografia ao portar:** o CSS legado escreve `font-family: 'Sora'` e
`'DM Sans'` literalmente. Como as fontes passam a vir de `next/font`, trocar por
`var(--font-display)` e `var(--font-body)` respectivamente. É substituição mecânica e
não altera o resultado visual.

---

## Tarefa 1 — Fundação do projeto

**Arquivos:**
- Criar: `package.json`, `tsconfig.json`, `next.config.ts`, `vercel.json`,
  `.eslintrc.json`, `.gitignore`, `.env.example`, `app/layout.tsx`, `app/page.tsx`
- Preservar: `index.html` e `formularioB2B/index.html` movidos para `legacy/`

**Produz:** projeto Next.js compilando e publicado em preview.

- [ ] **Passo 1: Preservar o site atual como referência**

```bash
mkdir -p legacy
git mv index.html legacy/index.html
git mv formularioB2B/index.html legacy/formularioB2B.html
```

`legacy/` é a fonte de verdade visual durante toda a migração. Só é apagado na Tarefa 15.

- [ ] **Passo 2: Criar o projeto Next.js na raiz**

```bash
npx create-next-app@latest . --ts --app --eslint --no-tailwind --no-src-dir \
  --import-alias "@/*" --use-npm --yes
```

Se o comando reclamar de diretório não vazio, criar em `.next-init/` e mover o conteúdo
para a raiz, preservando `legacy/`, `assets/` e `docs/`.

- [ ] **Passo 3: Fixar a região da Vercel em São Paulo**

Criar `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "regions": ["gru1"],
  "framework": "nextjs"
}
```

Sem isso as funções rodam em `iad1` (Virgínia) e cada chamada ao gestao atravessa o
continente.

- [ ] **Passo 4: Declarar as variáveis de ambiente esperadas**

Criar `.env.example` (versionado; o `.env.local` real **não** vai para o git):

```bash
# URL pública do site — usada em canônica, sitemap e Open Graph
NEXT_PUBLIC_SITE_URL=https://clube.curtamais.com.br

# Integração com o sistema de gestão (server-only, NUNCA com NEXT_PUBLIC_)
GESTAO_API_URL=https://gestao.curtamais.com.br/api/parceiros/cadastro
GESTAO_API_TOKEN=
```

Confirmar que `.gitignore` contém `.env*.local`.

- [ ] **Passo 5: Verificar**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Esperado: os três sem erro.

- [ ] **Passo 6: Commit e push**

```bash
git add -A
git commit -m "Criar projeto Next.js e mover o site estático para legacy/"
git push origin dev
```

- [ ] **Passo 7: Conferir o preview**

Abrir o endereço de preview gerado pela Vercel. Esperado: página inicial padrão do
Next.js carregando. **Fim da Etapa 1 — parar e mostrar ao Yuri.**

---

## Tarefa 2 — Tokens, fontes e casca do layout

**Arquivos:**
- Criar: `app/globals.css`, `app/fonts.ts`
- Modificar: `app/layout.tsx`

**Consome:** projeto da Tarefa 1.
**Produz:** `app/fonts.ts` exportando `sora` e `dmSans` (com as variáveis CSS
`--font-display` e `--font-body`);
`app/globals.css` com todos os tokens `--*` disponíveis globalmente.

- [ ] **Passo 1: Extrair os tokens e o reset do CSS legado**

Copiar de `legacy/index.html` as linhas 12–2873, isolar tudo que é global — `:root`,
`*`, `html`, `body`, reset, `@font-face`, utilitários usados por mais de uma seção — e
colocar em `app/globals.css`. O que for específico de uma seção **não** entra aqui:
vai para o `styles.module.css` da respectiva seção, nas tarefas 4 a 11.

Tokens que obrigatoriamente aparecem em `:root`:

```css
:root {
  --orange: #FF6B00;
  --orange-light: #FF8020;
  --bg: #0a0a0a;
  --bar-h: 44px;
  --header-offset: 130px;
}
@media (max-width: 768px) {
  :root { --header-offset: 120px; }
}
```

- [ ] **Passo 2: Servir as fontes pelo próprio domínio**

Hoje o site busca Sora e DM Sans no Google Fonts a cada visita. `next/font/google`
baixa as duas **no momento do build** e as serve do domínio do site — mesmo ganho de
velocidade e privacidade, sem arquivo `.woff2` versionado à mão. Criar `app/fonts.ts`:

```ts
import { Sora, DM_Sans } from 'next/font/google';

export const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});
```

Remover do CSS global qualquer `@import` ou `<link>` para `fonts.googleapis.com`.

- [ ] **Passo 3: Montar o layout raiz**

`app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { sora, dmSans } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clube Curta Mais',
  description: 'Clube de experiências exclusivas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

O texto definitivo de `metadata` entra na Tarefa 14.

- [ ] **Passo 4: Verificar**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Passo 5: Commit**

```bash
git add -A && git commit -m "Adicionar tokens de estilo e fontes locais Sora e DM Sans"
```

---

## Tarefa 3 — Arquivos de conteúdo

**Arquivos:**
- Criar: `content/site.ts`, `content/stats.ts`, `content/partners.ts`,
  `content/experiences.ts`, `content/testimonials.ts`, `content/plans.ts`,
  `content/faq.ts`

**Consome:** nada.
**Produz:** os tipos e constantes abaixo — as tarefas 4 a 11 importam daqui e **não
podem** escrever texto de negócio dentro de JSX.

- [ ] **Passo 1: Criar `content/site.ts`**

```ts
export const site = {
  nome: 'Clube Curta Mais',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://clube.curtamais.com.br',
  whatsapp: '5562999520608',
  telefone: '6239310505',
  telefoneFormatado: '(62) 3931-0505',
} as const;

export const whatsappLink = (mensagem: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
```

- [ ] **Passo 2: Criar os demais arquivos com estes tipos exatos**

```ts
// content/stats.ts
export interface Stat { valor: number; prefixo?: string; sufixo?: string; rotulo: string }
export const stats: Stat[] = [ /* +500 membros, +120 parceiros, R$ +611 de economia */ ];

// content/partners.ts
export interface Partner { id: string; nome: string; categoria: string; logo: string }
export const partners: Partner[] = [];

// content/experiences.ts
export interface Experience {
  id: string; titulo: string; categoria: string;
  imagem: string; desconto: string; descricao: string;
}
export const experiences: Experience[] = [];

// content/testimonials.ts
export interface Testimonial {
  id: string; nome: string; texto: string; nota: number; avatar?: string;
}
export const testimonials: Testimonial[] = [];

// content/plans.ts
export interface Plan {
  id: string; nome: string; precoMensal: number; precoAnual: number;
  destaque: boolean; beneficios: string[];
}
export const plans: Plan[] = [];

// content/faq.ts
export interface FaqItem { id: string; pergunta: string; resposta: string }
export const faq: FaqItem[] = [];
```

- [ ] **Passo 3: Preencher com o conteúdo real do `legacy/index.html`**

Extrair os valores literais das linhas indicadas no mapa acima. **Copiar texto por
texto, sem reescrever, sem melhorar redação e sem inventar item que não exista.**
Preços confirmados no legado: R$ 32,90 e R$ 89,90 (verificar os demais na seção 3836–3940).

- [ ] **Passo 4: Verificar e commitar**

```bash
npx tsc --noEmit && git add content && \
git commit -m "Extrair o conteúdo da página para arquivos de dados tipados"
```

---

## Tarefas 4 a 11 — Portar as seções

**Receita idêntica para cada seção.** Repetida aqui porque o executor pode ler as
tarefas fora de ordem.

Para a seção *S*, com intervalo HTML `[h1,h2]` e script `[s1,s2]` conforme o mapa:

- [ ] **Passo 1:** Criar `components/home/S/styles.module.css` com as regras de
  `legacy/index.html` (linhas 12–2873) que atendem às classes usadas em `[h1,h2]`.
  Converter seletores globais em classes locais. **Não alterar valor algum** — nem cor,
  nem espaçamento, nem duração de animação.
- [ ] **Passo 2:** Criar `components/home/S/index.tsx` traduzindo o HTML `[h1,h2]` para
  JSX: `class` → `className={styles.x}`, atributos em camelCase, tags fechadas.
- [ ] **Passo 3:** Se houver script `[s1,s2]`, converter para React no mesmo componente,
  marcando-o com `'use client'`. Substituir `document.querySelector` por `useRef`,
  manipulação direta de classe por estado, e `IntersectionObserver` /
  `addEventListener` por `useEffect` **com função de limpeza**.
- [ ] **Passo 4:** Trocar todo texto de negócio por importação de `content/`.
- [ ] **Passo 5:** `npx tsc --noEmit && npm run build`
- [ ] **Passo 6:** `git commit -m "Portar a seção S para componente"`

| Tarefa | Seção | HTML | Script | Observação |
|---|---|---|---|---|
| 4 | `UrgencyBar` + `Header` | 2881–2951 | 2952–2994 | Drawer mobile: estado React, não classe manual. Links "Seja Parceiro" → `/formulario-b2b` |
| 5 | `Hero` + `Numbers` | 2997–3098 | 3100–3216 | Contadores animados disparados por `IntersectionObserver` — ler de `content/stats.ts` |
| 6 | `Partners` + `Experiences` | 3219–3437 | — | Mantêm `<img>` cru por ora; viram `next/image` na Tarefa 15 |
| 7 | `HowItWorks` + `Calculator` | 3440–3655 | 3541–3586, 3657–3691 | Calculadora: estado controlado, formatar com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` |
| 8 | `Testimonials` | 3694–3799 | 3801–3833 | Depoimentos de `content/testimonials.ts` |
| 9 | `Plans` | 3836–3940 | 3942–4257 | **A maior:** 315 linhas de script. Alternância mensal/anual, seletor de nº de membros e barra de desconto viram estado React |
| 10 | `Guarantee` + `Faq` | 4260–4360 | 4275–4285, 4362–4395 | FAQ: acordeão com estado; usar `<details>`/`<summary>` se o visual permitir |
| 11 | `Footer` | 4398–4495 | — | Link "Seja Parceiro" → `/formulario-b2b` |

---

## Tarefa 12 — Montar a home e ligar o CTA de membro

**Arquivos:**
- Modificar: `app/page.tsx`
- Remover: regras `.sticky-cta` do CSS portado (código morto, ver mapa)

- [ ] **Passo 1: Compor a página na ordem original**

```tsx
import UrgencyBar from '@/components/home/UrgencyBar';
import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import Numbers from '@/components/home/Numbers';
import Partners from '@/components/home/Partners';
import Experiences from '@/components/home/Experiences';
import HowItWorks from '@/components/home/HowItWorks';
import Calculator from '@/components/home/Calculator';
import Testimonials from '@/components/home/Testimonials';
import Plans from '@/components/home/Plans';
import Guarantee from '@/components/home/Guarantee';
import Faq from '@/components/home/Faq';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <>
      <UrgencyBar />
      <Header />
      <main>
        <Hero />
        <Numbers />
        <Partners />
        <Experiences />
        <HowItWorks />
        <Calculator />
        <Testimonials />
        <Plans />
        <Guarantee />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Passo 2: Dar destino ao CTA principal**

Hoje "Quero Ser Membro" e "Começar agora" não levam a lugar nenhum. Apontar todos para
o WhatsApp (decisão D7, provisória):

```tsx
import { whatsappLink } from '@/content/site';

<a href={whatsappLink('Olá! Quero ser membro do Clube Curta Mais.')}
   target="_blank" rel="noopener noreferrer">Quero Ser Membro</a>
```

- [ ] **Passo 3: Conferir âncoras internas**

`#plansSection`, `#howSection`, `#experiencias`, `#numbersSection`, `#reviewsSection`,
`#guaranteeSection`, `#faqSection` precisam continuar existindo nos componentes.

- [ ] **Passo 4: Comparar com o site atual, lado a lado**

Abrir `legacy/index.html` e a nova home em duas abas, em 1440px, 768px e 390px de
largura. Conferir: cores, espaçamentos, animações, rolagem das âncoras, drawer mobile.
Qualquer divergência é defeito — corrigir antes de seguir.

- [ ] **Passo 5: Verificar, commitar e publicar**

```bash
npx tsc --noEmit && npm run lint && npm run build
git add -A && git commit -m "Montar a home com as 13 seções e ligar o CTA ao WhatsApp"
git push origin dev
```

**Fim da Etapa 2 — parar e pedir a conferência visual do Yuri.**

---

## Tarefa 13 — Formulário B2B

**Arquivos:**
- Criar: `app/formulario-b2b/page.tsx`, `components/form/PartnerForm/index.tsx`,
  `components/form/PartnerForm/styles.module.css`, `lib/schemas.ts`,
  `lib/image-compress.ts`
- Modificar: `next.config.ts` (redirecionamento)

**Produz:** `partnerSchema` (Zod) e `type PartnerInput = z.infer<typeof partnerSchema>`
em `lib/schemas.ts`, consumidos pela Tarefa 14.

- [ ] **Passo 1: Definir o schema compartilhado**

`lib/schemas.ts` — 38 campos, conforme `legacy/formularioB2B.html` (bloco de
documentação nas linhas ~780–815). Campos obrigatórios e formato exatamente como o
formulário legado valida hoje; não endurecer nem afrouxar regra sem consultar o Yuri.

```ts
import { z } from 'zod';

export const partnerSchema = z.object({
  nome_estabelecimento: z.string().min(2, 'Informe o nome do estabelecimento'),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  email: z.string().email('E-mail inválido'),
  // ... os 38 campos
  aceite_condicoes: z.literal('true'),
  origem: z.literal('formulario_b2b_site'),
  website: z.string().max(0).optional(), // honeypot: precisa chegar vazio
});

export type PartnerInput = z.infer<typeof partnerSchema>;
```

- [ ] **Passo 2: Portar o wizard de 10 etapas**

Traduzir `legacy/formularioB2B.html` para React mantendo os mesmos rótulos de etapa:
`1 Dados do estabelecimento · 2 Informações comerciais · 3 Benefício oferecido ·
4 Canal de atendimento · 5 Redes sociais · 6 Fotos e materiais · 7 Descrição da marca ·
8 Observações · 9 Responsável · 10 Revisão e aceite`.

O estilo do formulário usa Montserrat, diferente do site. **Manter como está** —
unificar tipografia é pendência P5, decisão do Yuri.

Acrescentar o campo honeypot, invisível e fora da ordem de tabulação:

```tsx
<input type="text" name="website" tabIndex={-1} autoComplete="off"
       aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
```

- [ ] **Passo 3: Comprimir imagens no navegador**

O formulário aceita 1 logo e de 1 a 10 fotos; a Vercel corta requisição acima de 4,5 MB.
`lib/image-compress.ts`:

```ts
const MAX_LADO = 2000;
const QUALIDADE = 0.82;
export const LIMITE_TOTAL_BYTES = 4 * 1024 * 1024; // margem sob o teto de 4,5 MB

export async function comprimirImagem(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const escala = Math.min(1, MAX_LADO / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) =>
    canvas.toBlob(r, 'image/jpeg', QUALIDADE));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
}
```

O wizard mostra o total acumulado e, se passar de `LIMITE_TOTAL_BYTES`, bloqueia o envio
com mensagem dizendo **quantas fotos remover** — não um erro genérico.

- [ ] **Passo 4: Não quebrar o link antigo**

Parceiros podem já ter recebido `/formularioB2B`. Em `next.config.ts`:

```ts
async redirects() {
  return [{ source: '/formularioB2B', destination: '/formulario-b2b', permanent: true }];
}
```

- [ ] **Passo 5: Feedback de envio explícito**

Ao enviar: botão vira spinner com "Enviando...", campos desabilitados. Sucesso e erro
com mensagem visível. Sem isso a tela parece travada.

- [ ] **Passo 6: Verificar e commitar**

```bash
npx tsc --noEmit && npm run build
git add -A && git commit -m "Portar o formulário B2B com validação e compressão de imagem"
```

---

## Tarefa 14 — Rota de servidor para o cadastro

**Arquivos:**
- Criar: `app/api/parceiros/route.ts`
- Modificar: `components/form/PartnerForm/index.tsx` (passa a enviar para `/api/parceiros`)

**Consome:** `partnerSchema` da Tarefa 13.

- [ ] **Passo 1: Implementar o Route Handler**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { partnerSchema } from '@/lib/schemas';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const form = await req.formData();

  // honeypot: robô preenche, humano não vê
  if (form.get('website')) {
    return NextResponse.json({ ok: true }, { status: 200 }); // silencioso de propósito
  }

  const campos = Object.fromEntries(
    [...form.entries()].filter(([, v]) => typeof v === 'string'),
  );
  const parsed = partnerSchema.safeParse(campos);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, erros: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const url = process.env.GESTAO_API_URL;
  const token = process.env.GESTAO_API_TOKEN;

  // Contorno enquanto a credencial do gestao não existe (spec §5.4):
  // registra o cadastro para que nenhum lead se perca.
  if (!url || !token) {
    console.warn('[parceiros] gestao não configurado — cadastro registrado no log', campos);
    return NextResponse.json({ ok: true, modo: 'registrado' }, { status: 200 });
  }

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
      signal: AbortSignal.timeout(20_000),
    });
    if (!resp.ok) {
      console.error('[parceiros] gestao respondeu', resp.status, await resp.text());
      return NextResponse.json({ ok: false, motivo: 'gestao_indisponivel' }, { status: 502 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error('[parceiros] falha ao falar com o gestao', e, campos);
    return NextResponse.json({ ok: false, motivo: 'gestao_indisponivel' }, { status: 502 });
  }
}
```

⚠️ O cabeçalho `Authorization: Bearer` é **suposição** — o endpoint responde 401 e o
contrato real nunca foi entregue (pendência P1). Ajustar quando a documentação chegar.

- [ ] **Passo 2: Limitar envios por IP**

Contador em memória por IP, janela de 10 minutos, teto de 5 envios; acima disso,
resposta 429 com mensagem clara. Sem banco, o contador se perde a cada reinício da
função — é aceitável para o volume esperado.

- [ ] **Passo 3: Mensagens honestas no formulário**

`422` → destacar os campos com erro. `502` → "Não conseguimos registrar seu cadastro
agora. Fale com a gente pelo WhatsApp" + link. `429` → "Muitos envios seguidos, aguarde
alguns minutos." **Nunca** dizer "enviado com sucesso" quando não foi.

- [ ] **Passo 4: Verificar, commitar e publicar**

```bash
npx tsc --noEmit && npm run lint && npm run build
git add -A && git commit -m "Adicionar rota de servidor para o cadastro de parceiros"
git push origin dev
```

- [ ] **Passo 5: Teste ponta a ponta no preview**

Preencher as 10 etapas com dados reais, anexar logo e 3 fotos, enviar. Conferir:
resposta de sucesso, o registro aparecendo no log da função na Vercel, e
`/formularioB2B` redirecionando. **Fim da Etapa 3 — parar e pedir o teste do Yuri.**

---

## Tarefa 15 — SEO, compartilhamento e imagens

**Arquivos:**
- Criar: `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`
- Modificar: `app/layout.tsx`, componentes `Partners`, `Experiences`, `Hero`
- Remover: `legacy/`, CSS órfão `.sticky-cta`

- [ ] **Passo 1: Metadata completa**

Em `app/layout.tsx`: `metadataBase` a partir de `site.url`, título, descrição, canônica,
`openGraph` e `twitter`. Texto definitivo aprovado pelo Yuri.

- [ ] **Passo 2: Prévia ao compartilhar**

`app/opengraph-image.tsx` gerando 1200×630 com logo, nome e chamada. É o que aparece ao
colar o link no WhatsApp — canal principal do cliente.

- [ ] **Passo 3: `sitemap.ts` e `robots.ts`**

Duas rotas: `/` e `/formulario-b2b`.

- [ ] **Passo 4: Dados estruturados**

JSON-LD `Organization` no layout e `FAQPage` alimentado por `content/faq.ts`.

- [ ] **Passo 5: Substituir as fotos do Unsplash**

Nove imagens do Unsplash hoje (linhas 3042–3406 do legado). Trocar pelas fotos reais
fornecidas pelo Yuri (pendência P2), colocá-las em `public/img/` e converter os `<img>`
de `Partners`, `Experiences` e `Hero` para `next/image` com `width`, `height` e `alt`
descritivo. **Não publicar esta tarefa com foto de banco de imagens.**

- [ ] **Passo 6: Medição**

```bash
npm i @vercel/analytics @vercel/speed-insights
```

`<Analytics />` e `<SpeedInsights />` no layout.

- [ ] **Passo 7: Limpeza**

Apagar `legacy/` e as regras `.sticky-cta` — **antes, perguntar ao Yuri** se quer a barra
flutuante implementada (pendência P6).

- [ ] **Passo 8: Verificar, commitar e publicar**

```bash
npx tsc --noEmit && npm run lint && npm run build
git add -A && git commit -m "Adicionar SEO, Open Graph, dados estruturados e imagens reais"
git push origin dev
```

**Fim da Etapa 4.** Antes de qualquer promoção para produção: pedir ao Yuri a
autorização e a bateria completa de testes (regra dele, e a spec §8).

---

## Pendências que travam tarefas

| # | Pendência | Trava |
|---|---|---|
| P1 | Contrato e credencial da API do gestao | Tarefa 14 (há contorno) |
| P2 | Fotos reais dos parceiros | Tarefa 15, passo 5 |
| P3 | Destino final do CTA de membro | Nada — WhatsApp cobre |
| P4 | Cópia dos cadastros por e-mail | Nada — proposto, não aprovado |
| P5 | Unificar as três famílias tipográficas | Nada — sugestão |
| P6 | Ativar ou descartar a barra `.sticky-cta` | Tarefa 15, passo 7 |
| P7 | Domínio definitivo de produção | Tarefa 15, passos 1–3 |
| ~~P8~~ | Depoimentos e selo do Google — **confirmados reais pelo Yuri em 18/09/2026** | resolvida |
| P10 | URL do perfil do Instagram do Curta Mais (o legado tinha link morto) | Nada — link segue morto até informarem |
| P9 | Logos reais dos parceiros. O Yuri decidiu em 18/09/2026 manter os rótulos "Parceiro 01" a "Parceiro 18" até lá | Nada — trocar `content/partners.ts` quando chegarem |
