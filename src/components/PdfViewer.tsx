import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PdfViewerProps {
  url: string;
}

export function PdfViewer({ url }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    async function render() {
      try {
        const pdf = await pdfjsLib.getDocument(url).promise;
        if (cancelled) return;
        setPageCount(pdf.numPages);

        container!.innerHTML = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          if (cancelled) return;

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;

          // Scale to fit container width, accounting for high-DPI displays
          const containerWidth = container!.clientWidth;
          const dpr = window.devicePixelRatio || 1;
          const unscaledViewport = page.getViewport({ scale: 1 });
          const scale = (containerWidth / unscaledViewport.width) * dpr;
          const viewport = page.getViewport({ scale });

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = "100%";
          canvas.style.height = "auto";

          container!.appendChild(canvas);

          await page.render({ canvas, canvasContext: context, viewport }).promise;
        }
      } catch {
        if (!cancelled) setError("無法載入 PDF");
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (error) {
    return <p className="text-sm text-[#f95630]">{error}</p>;
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="overflow-hidden space-y-2 bg-[#ffffff]"
      />
      {pageCount > 0 && (
        <p className="text-sm text-[#595c5d] mt-1">
          共 {pageCount} 頁
        </p>
      )}
    </div>
  );
}
