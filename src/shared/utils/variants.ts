import { cva } from "class-variance-authority";

export const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-amber-700 text-stone-900 hover:bg-amber-600",
        secondary: "border border-stone-300 bg-stone-100 text-stone-900 hover:border-amber-700 hover:bg-stone-200",
        ghost: "bg-transparent text-red-700 hover:bg-stone-200",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);