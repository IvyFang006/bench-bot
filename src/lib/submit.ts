import { PDFDocument } from "pdf-lib";

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string;
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;
const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME as string;

interface ConsentFilePayload {
  fileName: string;
  mimeType: string;
  data: string; // base64
}

interface SubmitPayload {
  name: string;
  birthday: string;
  isFirstTime: boolean;
  consentFile: ConsentFilePayload;
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

export async function submitRegistration(
  name: string,
  birthday: string,
  isFirstTime: boolean,
  signatureDataUrl: string,
  pdfUrl: string
): Promise<SubmitResponse> {
  const [signedPdfBytes, recaptchaToken] = await Promise.all([
    embedSignatureInPdf(pdfUrl, signatureDataUrl),
    getRecaptchaToken(),
  ]);

  const base64Data = uint8ArrayToBase64(signedPdfBytes);
  const sanitized =
    name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "unnamed";
  const fileName = `${SCHOOL_NAME}_${sanitized}.pdf`;

  const payload: SubmitPayload = {
    name,
    birthday,
    isFirstTime,
    consentFile: {
      fileName,
      mimeType: "application/pdf",
      data: base64Data,
    },
    recaptchaToken,
  };

  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Network error");
  }

  return response.json();
}
