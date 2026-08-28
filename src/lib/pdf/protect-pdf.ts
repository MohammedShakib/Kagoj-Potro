import { encryptPDF } from "@pdfsmaller/pdf-encrypt";

export async function protectPdf(file: File, password: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfBytes = new Uint8Array(arrayBuffer);
  
  // Encrypt the PDF using AES-256 natively in the browser
  const encryptedBytes = await encryptPDF(pdfBytes, password, { algorithm: "AES-256" });
  
  return encryptedBytes;
}
