import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { submitRegistration } from "@/lib/submit";

interface FormData {
  name: string;
  birthday: string;
  isFirstTime: boolean;
  consentFile: File | null;
}

interface FormErrors {
  name?: string;
  birthday?: string;
  consentFile?: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    birthday: "",
    isFirstTime: false,
    consentFile: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  function validate(): FormErrors {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "請輸入姓名";
    }
    if (!formData.birthday) {
      newErrors.birthday = "請選擇出生年月日";
    }
    if (!formData.consentFile) {
      newErrors.consentFile = "請上傳個資同意書";
    } else {
      const allowed = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp",
      ];
      if (!allowed.includes(formData.consentFile.type)) {
        newErrors.consentFile = "僅接受 PDF 或圖片檔（JPG、PNG、WEBP）";
      }
    }
    return newErrors;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setSubmitStatus("submitting");

    submitRegistration(
      formData.name,
      formData.birthday,
      formData.isFirstTime,
      formData.consentFile!
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

          {/* 個資同意書上傳 */}
          <div className="space-y-2">
            <Label htmlFor="consentFile" className="text-base">
              個資同意書
            </Label>
            <div className="relative">
              <Input
                id="consentFile"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="h-12 text-base file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer cursor-pointer"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    consentFile: e.target.files?.[0] ?? null,
                  }))
                }
              />
            </div>
            <p className="text-sm text-muted-foreground">
              接受 PDF、JPG、PNG、WEBP 格式
            </p>
            {errors.consentFile && (
              <p className="text-sm text-destructive">{errors.consentFile}</p>
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
