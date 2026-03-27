import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";

export interface SignaturePadHandle {
  isEmpty: () => boolean;
  toDataURL: () => string;
}

interface SignaturePadProps {
  onChange?: () => void;
}

export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(
  function SignaturePad({ onChange }, ref) {
    const canvasRef = useRef<SignatureCanvas>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      isEmpty: () => canvasRef.current?.isEmpty() ?? true,
      toDataURL: () => canvasRef.current?.toDataURL("image/png") ?? "",
    }));

    useEffect(() => {
      function handleResize() {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        // Save current signature data
        const data = canvas.toData();
        const wrapper = canvas.getCanvas();
        wrapper.width = container.clientWidth;
        wrapper.height = 200;
        // Restore signature data
        canvas.fromData(data);
      }

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    function handleClear() {
      canvasRef.current?.clear();
      onChange?.();
    }

    return (
      <div className="space-y-2">
        <div
          ref={containerRef}
          className="border-2 border-[#abadae] overflow-hidden bg-[#ffffff]"
        >
          <SignatureCanvas
            ref={canvasRef}
            penColor="black"
            canvasProps={{
              width: 500,
              height: 200,
              className: "w-full touch-none",
            }}
            onEnd={onChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
          >
            清除簽名
          </Button>
        </div>
      </div>
    );
  }
);
