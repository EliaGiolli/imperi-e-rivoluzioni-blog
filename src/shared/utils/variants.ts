import { cva } from "class-variance-authority";

export const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-indigo-600 text-white hover:bg-violet-600",
        secondary: "border border-slate-300 bg-slate-100 text-neutral-900 hover:border-indigo-600 hover:bg-indigo-50",
        ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50",
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