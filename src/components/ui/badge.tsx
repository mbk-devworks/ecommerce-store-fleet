import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-neutral-900 text-white",
        secondary: "border-transparent bg-neutral-100 text-neutral-900",
        outline: "text-neutral-700 border-neutral-200",
        sale: "border-transparent bg-rose-50 text-rose-700",
        onImage: "rounded-md border-0 bg-black/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md ring-1 ring-white/25 backdrop-blur-md",
        onImageSale:
          "rounded-md border-0 bg-rose-600/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md ring-1 ring-white/30 backdrop-blur-sm",
        onImageFeatured:
          "rounded-md border-0 bg-cyan-400/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow-md ring-1 ring-black/10 backdrop-blur-sm",
        onImageNew:
          "rounded-md border-0 bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-md ring-1 ring-black/10 backdrop-blur-sm",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
