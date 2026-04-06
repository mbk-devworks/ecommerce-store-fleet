"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const PRODUCT_IMAGE_PLACEHOLDER = "/product-placeholder.svg";

function isRemote(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

type Props = Omit<ImageProps, "src" | "onError" | "alt"> & {
  src: string | null | undefined;
  alt: string;
};

export function SafeProductImage({ src, alt, className, unoptimized, ...rest }: Props) {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [src]);

  const trimmed = src?.trim() ?? "";
  const remote = trimmed.length > 0 && isRemote(trimmed);
  const usePlaceholder = trimmed.length === 0 || broken;
  const effectiveSrc = usePlaceholder ? PRODUCT_IMAGE_PLACEHOLDER : trimmed;

  return (
    <Image
      {...rest}
      src={effectiveSrc}
      alt={alt}
      unoptimized={usePlaceholder ? false : (unoptimized ?? remote)}
      className={cn(
        className,
        usePlaceholder && "bg-slate-800 object-contain object-center p-6 opacity-95"
      )}
      onError={() => {
        if (trimmed.length > 0 && !broken) setBroken(true);
      }}
    />
  );
}
