import { PDFDocument } from "pdf-lib";

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string;
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;
const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME as string;

interface FilePayload {
  fileName: string;
  mimeType: string;
  data: string; // base64
}

interface SubmitPayload {
  name: string;
  birthday: string;
  ig: string;
  isFirstTime: boolean;
  isGraduating: boolean;
  consentFile: FilePayload;
  photoFile?: FilePayload;
  diplomaFile?: FilePayload;
  recaptchaToken: string;
}

interface SubmitResponse {
  success: boolean;
  message: string;
}

async function embedSignatureInPdf(
  pdfUrl: string,
  signatureDataUrl: string
): Promise<Uint8Array> {
  const pdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const pngBytes = Uint8Array.from(
    atob(signatureDataUrl.split(",")[1]),
    (c) => c.charCodeAt(0)
  );
  const signatureImage = await pdfDoc.embedPng(pngBytes);

  const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
  const { width: pageWidth } = lastPage.getSize();

  // Scale signature to ~40% of page width, placed at bottom-right
  const sigWidth = pageWidth * 0.4;
  const sigHeight = sigWidth * (signatureImage.height / signatureImage.width);
  const margin = 50;

  lastPage.drawImage(signatureImage, {
    x: pageWidth - sigWidth - margin,
    y: margin,
    width: sigWidth,
    height: sigHeight,
  });

  return pdfDoc.save();
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function getRecaptchaToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error("reCAPTCHA not loaded"));
      return;
    }
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action: "submit" })
        .then(resolve)
        .catch(reject);
    });
  });
}

async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return uint8ArrayToBase64(new Uint8Array(buffer));
}

async function buildFilePayload(
  file: File,
  namePrefix: string
): Promise<FilePayload> {
  const ext = file.name.split(".").pop() ?? "bin";
  return {
    fileName: `${namePrefix}.${ext}`,
    mimeType: file.type,
    data: await fileToBase64(file),
  };
}

export async function submitRegistration(
  name: string,
  birthday: string,
  ig: string,
  isFirstTime: boolean,
  isGraduating: boolean,
  signatureDataUrl: string,
  pdfUrl: string,
  photoFile: File | null,
  diplomaFile: File | null
): Promise<SubmitResponse> {
  const sanitized =
    name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "unnamed";
  const namePrefix = `${SCHOOL_NAME}_${sanitized}`;

  const [signedPdfBytes, recaptchaToken, photoPayload, diplomaPayload] =
    await Promise.all([
      embedSignatureInPdf(pdfUrl, signatureDataUrl),
      getRecaptchaToken(),
      photoFile ? buildFilePayload(photoFile, namePrefix) : null,
      diplomaFile ? buildFilePayload(diplomaFile, namePrefix) : null,
    ]);

  const base64Data = uint8ArrayToBase64(signedPdfBytes);
  const fileName = `${namePrefix}.pdf`;

  const payload: SubmitPayload = {
    name,
    birthday,
    ig,
    isFirstTime,
    isGraduating,
    consentFile: {
      fileName,
      mimeType: "application/pdf",
      data: base64Data,
    },
    recaptchaToken,
  };

  if (photoPayload) payload.photoFile = photoPayload;
  if (diplomaPayload) payload.diplomaFile = diplomaPayload;

  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Network error");
  }

  return response.json();
}
