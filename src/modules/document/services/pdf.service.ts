import PDFDocument from 'pdfkit';

export const generatePdfBuffer = (text: string): Promise<Buffer> => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    doc.text(text);
    doc.end();
  });
};