import { useRef, useState, useId } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  label: string;
  hint?: string;
  accept?: string;
  required?: boolean;
  error?: string;
  onChange: (file: File | null) => void;
}

export function FileUpload({
  label,
  hint,
  accept = "image/*",
  required,
  error,
  onChange,
}: FileUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onChange(file);

    if (file) {
      setFileName(file.name);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
      setFileName(null);
    }
  }

  function handleRemove() {
    onChange(null);
    setPreview(null);
    setFileName(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-base text-[#2c2f30]">
        {label}
        {required && <span className="text-[#f95630] ml-1">*</span>}
      </Label>
      {hint && <p className="text-sm text-[#595c5d]">{hint}</p>}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {preview ? (
        <div className="space-y-2">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover border-2 border-[#abadae]"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
          >
            移除
          </Button>
        </div>
      ) : fileName ? (
        <div className="flex items-center gap-2">
          <span className="text-sm truncate max-w-[200px] text-[#2c2f30]">{fileName}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
          >
            移除
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full text-base"
          onClick={() => inputRef.current?.click()}
        >
          選擇檔案
        </Button>
      )}

      {error && <p className="text-sm text-[#f95630]">{error}</p>}
    </div>
  );
}
