# Prompt para o time/agente do `gestao.curtamais.com.br`

> **Como usar:** copie tudo abaixo da linha e envie para quem (ou o que) vai
> trabalhar no código do `gestao.curtamais.com.br`. O texto é autossuficiente:
> não depende de nada deste repositório.
>
> **Contexto que o destinatário não tem:** hoje a rota
> `POST /api/parceiros/cadastro` responde **401** e o cadastro não chega a
> lugar nenhum. O formulário público está pronto e esperando.

---

## Tarefa: receber os cadastros de parceiros do Clube Curta Mais

Você vai trabalhar no sistema `gestao.curtamais.com.br`. Existe um formulário
público já em produção, no site `clube.curtamais.com.br/formulario-cadastro`,
onde estabelecimentos se candidatam a parceiros do Clube Curta Mais. Esse
formulário está pronto e envia os dados; falta o lado de cá recebê-los.

Hoje a rota `POST /api/parceiros/cadastro` existe e responde **401
Unauthorized**, sem documentação de como autenticar. Enquanto isso, nenhum
cadastro chega — eles estão sendo apenas registrados em log do lado do site.

### O que precisa existir ao final

1. **Uma tabela/coleção** que armazene os cadastros, com todos os campos abaixo.
2. **Um endpoint** que receba o envio do site e grave o cadastro.
3. **Uma aba no painel administrativo** para a equipe ver, filtrar e tratar os
   cadastros recebidos.
4. **Uma credencial** (token) para o site se autenticar, entregue a quem cuida
   do `clube.curtamais.com.br`.

---

## 1. O endpoint

### Formato do envio

O site envia **`multipart/form-data`** via `POST`. Não é JSON — tem arquivo
junto. O `Content-Type` vem com o `boundary` gerado pelo cliente; não presuma
um valor fixo.

```
POST https://gestao.curtamais.com.br/api/parceiros/cadastro
Content-Type: multipart/form-data; boundary=...
Authorization: <ver seção 4>
```

### Campos de texto

Todos chegam como **string**, inclusive os numéricos — o formulário não
converte tipos. Campos opcionais chegam presentes e vazios (`""`), não ausentes.

| Campo | Obrig. | Observações |
|---|---|---|
| `nome_estabelecimento` | sim | Nome fantasia / marca |
| `nome_responsavel` | sim | Quem preencheu o formulário |
| `telefone_responsavel` | sim | Formatado: `(62) 99999-0000` |
| `email` | sim | Validado como e-mail no site |
| `categoria` | sim | Um de: `Gastronomia`, `Lazer`, `Turismo`, `Entretenimento`, `Bem-estar`, `Serviços`, `Hospedagem` |
| `endereco_completo` | sim | Rua, número, bairro, complemento |
| `cidade` | sim | |
| `cep` | sim | Formatado: `74000-000` |
| `dias_funcionamento` | sim | Lista separada por vírgula, ex: `Seg,Ter,Qua`. Valores possíveis: `Seg`, `Ter`, `Qua`, `Qui`, `Sex`, `Sáb`, `Dom` |
| `horario_funcionamento` | sim | Texto livre, ex: `10h às 22h` |
| `horario_excecoes` | não | Texto livre, ex: `Sábado: 12h às 18h \| Domingo: 14h às 20h` |
| `ticket_medio` | sim | String com vírgula decimal, ex: `80,00` |
| `vouchers_mes` | sim | String numérica, ex: `50` |
| `beneficio_oferecido` | sim | Resumo curto do benefício |
| `descricao_funcionamento` | sim | Texto longo |
| `condicoes_especificas` | não | Texto longo |
| `dias_horarios_beneficio` | sim | Quando o benefício vale |
| `excecoes_produtos` | não | Texto longo |
| `consumo_minimo` | não | Texto livre |
| `combinavel_outras_promocoes` | sim | Exatamente `Sim` ou `Não` |
| `como_validar` | sim | Texto longo |
| `whatsapp_atendimento` | sim | Formatado: `(62) 99999-0000` |
| `orientacoes_assinante` | não | Texto longo |
| `instagram` | não | Texto livre (`@perfil` ou URL) |
| `facebook` | não | Texto livre |
| `tiktok` | não | Texto livre |
| `site_oficial` | não | Texto livre |
| `google_maps` | não | URL |
| `sobre_estabelecimento` | sim | Texto longo |
| `descricao_experiencia` | sim | Texto longo |
| `diferencial` | sim | Texto longo |
| `principais_produtos_servicos` | sim | Texto longo |
| `observacoes` | não | Texto longo |
| `responsavel_nome` | sim | Responsável oficial pela parceria |
| `responsavel_cargo` | sim | ex: `Sócio-proprietário` |
| `responsavel_whatsapp` | sim | Formatado |
| `aceite_divulgacao` | sim | Sempre a string `"true"` — o site bloqueia o envio sem aceite |
| `aceite_condicoes` | sim | Sempre a string `"true"` |
| `enviado_em` | sim | Data/hora ISO 8601 em UTC, gerada no navegador do parceiro |
| `origem` | sim | Sempre a string literal `"formulario_b2b_site"`. **Não mude esse valor** — é o identificador histórico da fonte, e alterá-lo quebraria a integração. |

**Guarde os textos como recebidos**, sem normalizar nem cortar. Os campos
longos podem passar de 1.000 caracteres: use tipo texto, não `varchar(255)`.

O site já aplica tetos antes de enviar, então você nunca receberá mais que
isto: **300 caracteres** nos campos curtos e **5.000** nos campos de texto
longo (`descricao_funcionamento`, `condicoes_especificas`, `excecoes_produtos`,
`como_validar`, `orientacoes_assinante`, `sobre_estabelecimento`,
`descricao_experiencia`, `diferencial`, `principais_produtos_servicos`,
`observacoes`, `horario_excecoes`).

### Arquivos

| Chave | Quantidade | Observações |
|---|---|---|
| `logo` | 0 ou 1 | Imagem. Opcional |
| `fotos` | 1 a 10 | Imagem. **Chave repetida** — várias partes com o mesmo nome `fotos`. Trate como lista, não como arquivo único |

As imagens já chegam **redimensionadas e comprimidas** pelo navegador (lado
maior de 2.000px, JPEG qualidade 0,82), com o total do envio abaixo de 4 MB.

O site valida os arquivos antes de repassar e recusa o envio se algo estiver
fora do combinado, então você receberá apenas:

- tipos `image/jpeg`, `png`, `webp`, `avif`, `gif`, `heic` ou `heif` — nunca
  PDF, SVG ou executável;
- no máximo 4 MB por arquivo e no máximo 10 fotos;
- **nomes de arquivo já higienizados** — sem barra, contrabarra ou `..`, de
  modo que `../../etc/passwd.jpg` chega como `passwd.jpg`.

Ainda assim, valide do seu lado: nunca confie no nome do arquivo para montar
o caminho onde vai gravar.

---

## 2. Respostas esperadas

O site já sabe interpretar estas respostas. Siga-as e nada precisa mudar do
outro lado.

| Situação | Status | Corpo |
|---|---|---|
| Cadastro gravado | `200` ou `201` | Qualquer JSON. Um `{"id": "..."}` ajudaria na rastreabilidade |
| Dados inválidos | `422` | `{"erros": {"nome_do_campo": ["mensagem legível em português"]}}` |
| Credencial ausente ou errada | `401` | Qualquer corpo |
| Erro interno | `5xx` | Qualquer corpo |

O formato do `422` importa: o site usa a chave para destacar o campo errado na
tela do parceiro. A mensagem é exibida como veio, então escreva em português e
para leigo.

---

## 3. A aba no painel administrativo

Crie uma seção "Cadastros de parceiros" com:

- **Listagem** com as colunas mais úteis para triagem: nome do estabelecimento,
  categoria, cidade, data de envio e situação.
- **Filtro** por situação e por categoria, e busca por nome.
- **Situação** com um fluxo simples: `Novo` → `Em análise` → `Aprovado` /
  `Recusado`. Permita anotar um comentário interno na mudança de situação.
- **Tela de detalhe** mostrando os 40 campos agrupados como o parceiro os
  preencheu — estabelecimento, comercial, benefício, atendimento, redes
  sociais, fotos, descrição da marca, observações e responsável.
- **Galeria** com as fotos e o logo, permitindo baixar os originais. A equipe
  de marketing usa esse material para montar a divulgação.
- **Indicador de novos** cadastros não vistos, para ninguém ficar esquecido.

---

## 4. Autenticação

Não há contrato definido ainda — **você decide e nos informa**. O site hoje
está preparado para enviar:

```
Authorization: Bearer <token>
```

Se preferir outro esquema (cabeçalho próprio como `X-API-Key`, HMAC da
requisição, o que for), tudo bem: é só dizer qual, e ajustamos o site. O que
precisamos de volta é:

1. A **URL definitiva** do endpoint.
2. O **esquema de autenticação** e um **token válido**.
3. Confirmação de que os nomes dos campos acima batem com o que você gravou —
   ou a lista do que mudou.

O token será guardado como variável de ambiente no servidor do site, nunca no
navegador. Envie por canal seguro, não por e-mail comum.

---

## 5. Como verificar antes de dizer que está pronto

Não considere concluído sem rodar estes casos contra o ambiente real:

1. **Envio completo válido** com 1 logo e 3 fotos → grava tudo, os arquivos
   abrem no painel, e a resposta é `200`/`201`.
2. **Envio com campo obrigatório vazio** → responde `422` com a chave do campo
   certo.
3. **Envio sem credencial** → responde `401`.
4. **Envio com 10 fotos** → todas as dez são gravadas, nenhuma se perde.
5. **Acentuação** — mande `Goiânia`, `Não`, `Sábado`, `às` e confirme que
   chegam íntegros no banco e na tela. Codificação errada aqui é o erro mais
   comum neste tipo de integração.
6. **Campos longos** — mande 2.000 caracteres em `descricao_funcionamento` e
   confirme que nada foi cortado.
7. **Dois envios seguidos do mesmo estabelecimento** → decida e documente se
   vira duplicata ou atualização. O site não envia identificador único.

---

## 6. Ponto de atenção

O site tem uma trava de proteção contra robôs e um limite de envios por IP,
ambos do lado dele. Você não precisa implementar nada disso — mas saiba que um
envio legítimo nunca chega mais de cinco vezes em dez minutos do mesmo IP.
