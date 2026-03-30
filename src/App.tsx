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
import { SuccessPage } from "@/components/SuccessPage";
import { PacMan, Ghost, Dot, Cherry, Basketball } from "@/components/ArcadeIcons";

const CONSENT_PDF_URL = `${import.meta.env.BASE_URL}consent-form.pdf`;

interface FormData {
  name: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  ig: string;
  isFirstTime: boolean;
  isGraduating: boolean;
}

interface FormErrors {
  name?: string;
  birthday?: string;
  signature?: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
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
    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      newErrors.birthday = "請輸入完整的出生年月日";
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
    const birthday = `${formData.birthYear}/${formData.birthMonth.padStart(2, "0")}/${formData.birthDay.padStart(2, "0")}`;

    submitRegistration(
      formData.name,
      birthday,
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
    return <SuccessPage playerName={formData.name} />;
  }

  return (
    <div className="min-h-screen bg-[#131313] relative">
      {/* Pac-Man dot trail decoration */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <PacMan size={25} />
        <Basketball size={20} />
        <Basketball size={20} />
        <Basketball size={20} />
        <Basketball size={20} />
        <Basketball size={20} />
        <Basketball size={20} />
      </div>

      <div className="max-w-lg mx-auto px-4 pt-20 pb-16">
        {/* Hero header */}
        <div className="mb-10">
          <h1 className="font-pixel text-xl text-[#ffd709] leading-relaxed mb-2">
            2026
          </h1>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#e6e8ea]">
            全國大專女籃校友盃
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: 基本資料 - light panel */}
          <div className="relative bg-[#ffffff] p-6 space-y-6 shadow-[0_0_20px_rgba(255,215,9,0.08)]">
            <p className="font-pixel text-sm text-[#6c5a00] tracking-wider">
              基本資料
            </p>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-base text-[#2c2f30]">
                姓名<span className="text-[#f95630] ml-1">*</span>
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
                <p className="text-sm text-[#f95630]">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base text-[#2c2f30]">
                生日<span className="text-[#f95630] ml-1">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="birthYear"
                  type="text"
                  inputMode="numeric"
                  placeholder="1990"
                  maxLength={4}
                  className="h-12 text-base text-center"
                  value={formData.birthYear}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      birthYear: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                />
                <span className="text-[#595c5d]">/</span>
                <Input
                  id="birthMonth"
                  type="text"
                  inputMode="numeric"
                  placeholder="01"
                  maxLength={2}
                  className="h-12 text-base text-center"
                  value={formData.birthMonth}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      birthMonth: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                />
                <span className="text-[#595c5d]">/</span>
                <Input
                  id="birthDay"
                  type="text"
                  inputMode="numeric"
                  placeholder="01"
                  maxLength={2}
                  className="h-12 text-base text-center"
                  value={formData.birthDay}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      birthDay: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                />
              </div>
              {errors.birthday && (
                <p className="text-sm text-[#f95630]">{errors.birthday}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ig" className="text-base text-[#2c2f30]">
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
          </div>

          {/* Section: 參賽狀態 - light panel */}
          <div className="relative bg-[#ffffff] p-6 space-y-6 shadow-[0_0_20px_rgba(84,227,252,0.08)]">
            <p className="font-pixel text-sm text-[#006573] tracking-wider">
              參賽狀態
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="isFirstTime"
                  className="mt-0.5"
                  checked={formData.isFirstTime}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFirstTime: checked === true,
                    }))
                  }
                />
                <Label htmlFor="isFirstTime" className="text-base cursor-pointer leading-snug text-[#2c2f30]">
                  初次參賽者
                </Label>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="isGraduating"
                  className="mt-0.5"
                  checked={formData.isGraduating}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isGraduating: checked === true,
                    }))
                  }
                />
                <Label htmlFor="isGraduating" className="text-base cursor-pointer leading-snug text-[#2c2f30]">
                  應屆畢業生
                </Label>
              </div>
            </div>

          </div>

          {/* Section: 上傳資料 - light panel */}
          <div className="relative bg-[#ffffff] p-6 space-y-6 shadow-[0_0_20px_rgba(255,215,9,0.08)]">
            <p className="font-pixel text-sm text-[#6c5a00] tracking-wider">
              上傳資料
            </p>

            <FileUpload
              label="大頭貼"
              accept="image/*"
              onChange={setPhotoFile}
            />

            <FileUpload
              label="畢業證書"
              accept="image/*,.pdf"
              onChange={setDiplomaFile}
            />
          </div>

          {/* Section: 個資同意書 - light panel */}
          <div className="relative bg-[#ffffff] p-6 space-y-8 shadow-[0_0_20px_rgba(255,143,169,0.08)]">
            <p className="font-pixel text-sm text-[#b60051] tracking-wider">
              個人資料告知事項暨同意書
            </p>

            <div className="space-y-4">
              <PdfViewer url={CONSENT_PDF_URL} />
            </div>

            <div className="space-y-2">
              <Label className="text-base text-[#2c2f30]">簽名<span className="text-[#f95630] ml-1">*</span></Label>
              <p className="text-sm font-bold text-[#f95630] bg-[#f95630]/10 px-3 py-2 border-l-4 border-l-[#f95630]">
                請在下方框內簽名，並於簽名時一併寫上日期
              </p>
              <SignaturePad
                ref={signaturePadRef}
                onChange={() =>
                  setErrors((prev) => ({ ...prev, signature: undefined }))
                }
              />
              {errors.signature && (
                <p className="text-sm text-[#f95630]">{errors.signature}</p>
              )}
            </div>
          </div>

          {submitStatus === "error" && (
            <Alert variant="destructive">
              <AlertDescription>提交失敗，請稍後再試。</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-base font-bold uppercase tracking-[0.05em]"
            disabled={submitStatus === "submitting"}
          >
            {submitStatus === "submitting" ? "提交中..." : "送出報名"}
          </Button>
        </form>

        {/* Bottom arcade decoration */}
        <div className="flex justify-center items-center gap-5 mt-10">
          <Ghost size={25} color="#ff8fa9" />
          <Ghost size={25} color="#54e3fc" />
          <Cherry size={25} />
          <Ghost size={25} color="#ffd709" />
          <Ghost size={25} color="#f95630" />
        </div>
      </div>

      {submitStatus === "submitting" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#131313]/90 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-6 bg-[#1b1b1b] p-10 border border-[#ffd709]/20 shadow-[0_0_40px_rgba(255,215,9,0.1)]">
            {/* Pac-Man eating dots animation */}
            <div className="relative h-20 w-[160px]">
              <div className="pacman-runner absolute left-0 top-1/2 -translate-y-1/2">
                <PacMan size={28} />
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-[14px] pl-[30px]">
                <Dot size={8} className="loading-dot" />
                <Dot size={8} className="loading-dot" />
                <Dot size={8} className="loading-dot" />
                <Dot size={8} className="loading-dot" />
                <Dot size={8} className="loading-dot" />
                <Dot size={8} className="loading-dot" />
              </div>
            </div>
            <p className="font-pixel text-xs text-[#ffd709]">LOADING</p>
            <p className="text-sm text-[#abadae]">
              請勿關閉此頁面
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
