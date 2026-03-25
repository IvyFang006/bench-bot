const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string;
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:...;base64, prefix
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
  consentFile: File
): Promise<SubmitResponse> {
  const [base64Data, recaptchaToken] = await Promise.all([
    fileToBase64(consentFile),
    getRecaptchaToken(),
  ]);

  const extension = consentFile.name.split(".").pop() ?? "pdf";
  const sanitized = name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "unnamed";
  const fileName = `${sanitized}.${extension}`;

  const payload: SubmitPayload = {
    name,
    birthday,
    isFirstTime,
    consentFile: {
      fileName,
      mimeType: consentFile.type,
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
