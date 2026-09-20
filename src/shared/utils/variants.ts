import { cva } from "class-variance-authority";

export const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Antique gold on charcoal text carries its own contrast, so primary needs no dark pair.
        primary: "bg-amber-700 text-stone-900 hover:bg-amber-600",
        secondary:
          "border border-stone-300 bg-stone-100 text-stone-900 hover:border-amber-700 hover:bg-stone-200 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:hover:border-amber-500 dark:hover:bg-stone-700",
        ghost: "bg-transparent text-red-700 hover:bg-stone-200 dark:text-amber-500 dark:hover:bg-stone-800",
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