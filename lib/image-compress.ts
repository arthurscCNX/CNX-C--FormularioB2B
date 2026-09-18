/**
 * A Vercel corta requisições acima de 4,5 MB, e dez fotos de celular passam
 * disso com folga. Cada imagem é redimensionada no navegador antes do envio.
 */
const MAX_LADO = 2000;
const QUALIDADE = 0.82;

/** Teto adotado, com margem sob o limite real de 4,5 MB da plataforma. */
export const LIMITE_TOTAL_BYTES = 4 * 1024 * 1024;

export async function comprimirImagem(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const escala = Math.min(1, MAX_LADO / Math.max(bitmap.width, bitmap.height));
    const largura = Math.round(bitmap.width * escala);
    const altura = Math.round(bitmap.height * escala);

    const canvas = document.createElement('canvas');
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, largura, altura);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', QUALIDADE),
    );
    // Se a compressão não ajudou, fica o arquivo original.
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
      type: 'image/jpeg',
      lastModified: file.lastModified,
    });
  } catch {
    // Navegador sem createImageBitmap ou arquivo ilegível: segue o original.
    return file;
  }
}

export function formatarTamanho(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 1
    ? `${mb.toFixed(1).replace('.', ',')} MB`
    : `${Math.round(bytes / 1024)} KB`;
}
