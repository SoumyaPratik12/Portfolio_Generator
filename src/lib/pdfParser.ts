import pdfParse from 'pdf-parse';

export interface PDFParseResult {
  text: string;
  pages: number;
  info: any;
}

export async function parsePDF(file: File): Promise<PDFParseResult> {
  try {
    console.log('Starting PDF parsing for:', file.name, 'Size:', file.size);

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const data = await pdfParse(buffer);

    console.log('PDF parsed successfully. Pages:', data.numpages, 'Text length:', data.text.length);

    return {
      text: data.text,
      pages: data.numpages,
      info: data.info
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function extractTextFromPDFContent(text: string): string {
  // Clean up the extracted text
  return text
    .replace(/\r\n/g, '\n')  // Normalize line endings
    .replace(/\n{3,}/g, '\n\n')  // Remove excessive line breaks
    .replace(/[^\x20-\x7E\n]/g, ' ')  // Remove non-printable characters except newlines
    .replace(/\s+/g, ' ')  // Normalize whitespace
    .trim();
}
