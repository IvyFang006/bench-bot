import { useState, useRef, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PdfViewer } from "@/components/PdfViewer";
import { SignaturePad, type SignaturePadHandle } from "@/components/SignaturePad";
import { FileUpload } from "@/components/FileUpload";
import { submitRegistration } from "@/lib/submit";

const CONSENT_PDF_URL = `${import.meta.env.BASE_URL}consent-form.pdf`;

interface FormData {
  name: string;
  birthday: string;
  ig: string;
  isFirstTime: boolean;
  isGraduating: boolean;
}

interface FormErrors {
  name?: string;
  birthday?: string;
  signature?: string;
  photo?: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    birthday: "",
    ig: "",
    isFirstTime: false,
    isGraduating: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
  const signaturePadRef = useRef<SignaturePadHandle>(null);

  function validate(): FormErrors {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "請輸入姓名";
    }
    if (!formData.birthday) {
      newErrors.birthday = "請選擇出生年月日";
    }
    if (formData.isFirstTime && !photoFile) {
      newErrors.photo = "初次參賽者需上傳大頭貼";
    }
    if (signaturePadRef.current?.isEmpty()) {
      newErrors.signature = "請簽名";
    }
    return newErrors;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setSubmitStatus("submitting");

    const signatureDataUrl = signaturePadRef.current!.toDataURL();

    submitRegistration(
      formData.name,
      formData.birthday,
      formData.ig,
      formData.isFirstTime,
      formData.isGraduating,
      signatureDataUrl,
      CONSENT_PDF_URL,
      photoFile,
      diplomaFile
    )
      .then((res) => {
        setSubmitStatus(res.success ? "success" : "error");
      })
      .catch(() => {
        setSubmitStatus("error");
      });
  }

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold">
            ✓
          </div>
          <h1 className="text-3xl font-bold tracking-tight">報名成功</h1>
          <p className="text-muted-foreground text-lg">
            感謝你的報名，我們已收到你的資料。
          </p>
          <Button
            size="lg"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            回到首頁
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-lg space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">2026 校友盃報名</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 姓名 */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              姓名
            </Label>
            <Input
              id="name"
              placeholder="請輸入姓名"
              className="h-12 text-base"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* 出生年月日 */}
          <div className="space-y-2">
            <Label htmlFor="birthday" className="text-base">
              出生年月日
            </Label>
            <Input
              id="birthday"
              type="date"
              className="h-12 text-base"
              value={formData.birthday}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  birthday: e.target.value,
                }))
              }
            />
            {errors.birthday && (
              <p className="text-sm text-destructive">{errors.birthday}</p>
            )}
          </div>

          {/* IG 帳號 */}
          <div className="space-y-2">
            <Label htmlFor="ig" className="text-base">
              IG 帳號
            </Label>
            <Input
              id="ig"
              placeholder="@username"
              className="h-12 text-base"
              value={formData.ig}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, ig: e.target.value }))
              }
            />
          </div>

          {/* 初次參賽者 / 應屆畢業生 */}
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="isFirstTime"
                checked={formData.isFirstTime}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isFirstTime: checked === true,
                  }))
                }
              />
              <Label htmlFor="isFirstTime" className="text-base cursor-pointer">
                初次參賽者
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="isGraduating"
                checked={formData.isGraduating}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isGraduating: checked === true,
                  }))
                }
              />
              <Label htmlFor="isGraduating" className="text-base cursor-pointer">
                應屆畢業生
              </Label>
            </div>
          </div>

          {/* Conditional uploads */}
          {formData.isFirstTime && (
            <FileUpload
              label="大頭貼"
              hint="初次參賽者請上傳大頭貼"
              accept="image/*"
              required
              error={errors.photo}
              onChange={(file) => {
                setPhotoFile(file);
                setErrors((prev) => ({ ...prev, photo: undefined }));
              }}
            />
          )}

          {formData.isGraduating && (
            <FileUpload
              label="畢業證書"
              hint="如已取得畢業證書，可在此上傳"
              accept="image/*,.pdf"
              onChange={setDiplomaFile}
            />
          )}

          {/* Divider */}
          <div className="border-t" />

          {/* 個資同意書 */}
          <div className="space-y-4">
            <Label className="text-base">個人資料告知事項暨同意書</Label>
            <PdfViewer url={CONSENT_PDF_URL} />
          </div>

          {/* 簽名 */}
          <div className="space-y-2">
            <Label className="text-base">簽名</Label>
            <p className="text-sm text-muted-foreground">
              請於簽名時一併寫上日期
            </p>
            <SignaturePad
              ref={signaturePadRef}
              onChange={() =>
                setErrors((prev) => ({ ...prev, signature: undefined }))
              }
            />
            {errors.signature && (
              <p className="text-sm text-destructive">{errors.signature}</p>
            )}
          </div>

          {submitStatus === "error" && (
            <Alert variant="destructive">
              <AlertDescription>提交失敗，請稍後再試。</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base"
            disabled={submitStatus === "submitting"}
          >
            {submitStatus === "submitting" ? "提交中..." : "送出報名"}
          </Button>
        </form>
      </div>

      {submitStatus === "submitting" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-lg font-medium">正在提交報名資料...</p>
            <p className="text-sm text-muted-foreground">
              請勿關閉此頁面
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
