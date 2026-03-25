import { useState, useRef, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PdfViewer } from "@/components/PdfViewer";
import { SignaturePad, type SignaturePadHandle } from "@/components/SignaturePad";
import { submitRegistration } from "@/lib/submit";

const CONSENT_PDF_URL = `${import.meta.env.BASE_URL}consent-form.pdf`;

interface FormData {
  name: string;
  birthday: string;
  isFirstTime: boolean;
}

interface FormErrors {
  name?: string;
  birthday?: string;
  signature?: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    birthday: "",
    isFirstTime: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const signaturePadRef = useRef<SignaturePadHandle>(null);

  function validate(): FormErrors {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "請輸入姓名";
    }
    if (!formData.birthday) {
      newErrors.birthday = "請選擇出生年月日";
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
      formData.isFirstTime,
      signatureDataUrl,
      CONSENT_PDF_URL
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
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

          {/* 初次參賽者 */}
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
    </div>
  );
}

export default App;
