import { PDFDocument } from "pdf-lib";

export async function unlockPdf(file: File, password: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Loading with the correct password decrypts the document in memory
  const pdfDoc = await (PDFDocument as any).load(arrayBuffer, { password });
  
  // pdf-lib does not support saving encrypted documents, so calling save()
  // naturally exports the decrypted (unlocked) document bytes.
  return await pdfDoc.save();
}
