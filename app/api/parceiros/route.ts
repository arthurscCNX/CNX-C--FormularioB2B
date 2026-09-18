import { NextRequest, NextResponse } from 'next/server';
import { partnerSchema, CAMPO_ARMADILHA } from '@/lib/schemas';

export const runtime = 'nodejs';
/** Nunca deve ser tratada como estática. */
export const dynamic = 'force-dynamic';

const JANELA_MS = 10 * 60 * 1000;
const MAX_ENVIOS = 5;
const TEMPO_LIMITE_MS = 20_000;

/**
 * Contador por IP na memória da função. Reinicia quando a função é reciclada —
 * aceitável para o volume esperado, e sem banco não há onde guardar melhor.
 */
const envios = new Map<string, number[]>();

function excedeuLimite(ip: string): boolean {
  const agora = Date.now();
  const recentes = (envios.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);
  recentes.push(agora);
  envios.set(ip, recentes);
  return recentes.length > MAX_ENVIOS;
}

function identificar(req: NextRequest): string {
  const encaminhado = req.headers.get('x-forwarded-for');
  return encaminhado?.split(',')[0]?.trim() || 'desconhecido';
}

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, motivo: 'corpo_invalido' },
      { status: 400 },
    );
  }

  // Campo-armadilha: robô preenche, humano não vê. Responde sucesso de
  // propósito, para o robô não descobrir que foi barrado.
  if (String(form.get(CAMPO_ARMADILHA) ?? '').trim()) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (excedeuLimite(identificar(req))) {
    return NextResponse.json(
      { ok: false, motivo: 'muitos_envios' },
      { status: 429 },
    );
  }

  const campos: Record<string, string> = {};
  for (const [chave, valor] of form.entries()) {
    if (typeof valor === 'string') campos[chave] = valor;
  }

  const validado = partnerSchema.safeParse(campos);
  if (!validado.success) {
    return NextResponse.json(
      { ok: false, erros: validado.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const url = process.env.GESTAO_API_URL;
  const token = process.env.GESTAO_API_TOKEN;

  // Contorno enquanto a credencial do gestão não existe (spec §5.4).
  // O cadastro é registrado no log da função para nenhum lead se perder.
  if (!url || !token) {
    console.warn(
      '[parceiros] gestão não configurado — cadastro registrado no log',
      JSON.stringify({
        ...validado.data,
        fotos: form.getAll('fotos').length,
        logo: form.get('logo') instanceof File,
      }),
    );
    return NextResponse.json({ ok: true, modo: 'registrado' }, { status: 200 });
  }

  try {
    const resposta = await fetch(url, {
      method: 'POST',
      // O contrato real do gestão nunca foi entregue (pendência P1); este
      // cabeçalho é suposição e deve ser ajustado quando a documentação vier.
      headers: { Authorization: `Bearer ${token}` },
      body: form,
      signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
    });

    if (!resposta.ok) {
      const corpo = await resposta.text().catch(() => '');
      console.error(
        '[parceiros] gestão respondeu',
        resposta.status,
        corpo.slice(0, 500),
        JSON.stringify(validado.data),
      );
      return NextResponse.json(
        { ok: false, motivo: 'gestao_indisponivel' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (erro) {
    console.error(
      '[parceiros] falha ao falar com o gestão',
      erro,
      JSON.stringify(validado.data),
    );
    return NextResponse.json(
      { ok: false, motivo: 'gestao_indisponivel' },
      { status: 502 },
    );
  }
}
