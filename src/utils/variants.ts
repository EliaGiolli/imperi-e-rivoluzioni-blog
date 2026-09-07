import { cva } from "class-variance-authority";

export const button = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2",
  {
    variants: {
      variant: {
        primary: "bg-indigo-600 text-white hover:bg-violet-600",
        secondary: "bg-accent-secondary text-foreground hover:bg-accent-secondary/80",
        ghost: "bg-transparent text-accent hover:bg-accent/10",
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