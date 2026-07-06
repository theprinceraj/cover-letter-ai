import mammoth from 'mammoth';

export async function parseResume(buffer: Buffer, mimetype: string): Promise<string> {
  if (mimetype === 'application/pdf') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const pdf = require('pdf-parse');
    const data = await pdf(buffer);
    return data.text || '';
  }

  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword'
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  }

  if (mimetype.startsWith('text/')) {
    return buffer.toString('utf-8');
  }

  // Fallback to text conversion if it's unknown but might be text-like
  return buffer.toString('utf-8');
}
