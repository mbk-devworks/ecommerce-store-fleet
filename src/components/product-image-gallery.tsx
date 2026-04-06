"use client";

import { useEffect, useState } from "react";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PRODUCT_IMAGE_PLACEHOLDER, SafeProductImage } from "@/components/safe-product-image";

type GalleryImage = { id: string; url: string; alt?: string | null };

function LightboxImg({ url, alt }: { url: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [url]);
  const src = failed || !url?.trim() ? PRODUCT_IMAGE_PLACEHOLDER : url;
  return (
    <img
      src={src}
      alt={alt}
      className="max-h-[min(85vh,900px)] w-auto max-w-full object-contain"
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}

export function ProductImageGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const [selected, setSelected] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    if (images.length > 0 && selected >= images.length) setSelected(0);
  }, [images.length, selected]);

  const main = images.length > 0 ? images[Math.min(selected, images.length - 1)] : null;

  if (!images.length) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-900 ring-1 ring-cyan-500/25 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.45)]">
        <SafeProductImage src={null} alt={productName} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="group relative block w-full overflow-hidden rounded-3xl bg-slate-900 text-left ring-1 ring-cyan-500/25 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.45)] transition hover:ring-cyan-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            aria-label={`View larger image: ${productName}`}
          >
            <span className="relative block aspect-square">
              <SafeProductImage
                src={main!.url}
                alt={main!.alt ?? productName}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                sizes="(max-width:1024px) 100vw, 50vw"
                priority
              />
            </span>
            <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-slate-950/85 px-3 py-1.5 text-xs font-semibold text-cyan-200 shadow-lg backdrop-blur-sm">
              <ZoomIn className="h-3.5 w-3.5" aria-hidden />
              Zoom
            </span>
          </button>
        </div>

        <DialogContent className="max-w-[min(96vw,1200px)] border-none bg-transparent p-2 shadow-none sm:p-4">
          <DialogTitle className="sr-only">Enlarged product image</DialogTitle>
          <div className="flex max-h-[85vh] w-full items-center justify-center overflow-hidden rounded-xl bg-black/30 p-2">
            <LightboxImg url={main!.url} alt={main!.alt ?? productName} />
          </div>
          {images.length > 1 ? (
            <div className="flex justify-center gap-2 overflow-x-auto pb-1 pt-2">
              {images.map((im, i) => (
                <button
                  key={im.id}
                  type="button"
                  onClick={() => setSelected(i)}
                  className={cn(
                    "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-slate-900 transition",
                    i === selected ? "ring-cyan-400" : "ring-transparent opacity-70 hover:opacity-100"
                  )}
                  aria-label={`Image ${i + 1}`}
                  aria-current={i === selected}
                >
                  <SafeProductImage src={im.url} alt="" fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((im, i) => (
            <button
              key={im.id}
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                "relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl ring-2 transition sm:h-20 sm:w-20",
                i === selected
                  ? "ring-cyan-400 ring-offset-2 ring-offset-white"
                  : "ring-slate-700 hover:ring-cyan-500/40"
              )}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === selected}
            >
              <SafeProductImage src={im.url} alt={im.alt ?? productName} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
