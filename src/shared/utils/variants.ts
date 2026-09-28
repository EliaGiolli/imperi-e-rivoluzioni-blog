import { cva } from "class-variance-authority";

/*
 * Gazzetta buttons are drawn, never filled: colour lives only in the rule and the label.
 * Every variant reads the edition tokens, so none needs a dark: pair.
 */
export const button = cva(
  "inline-flex items-center justify-center gap-2 rounded font-heading font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mark",
  {
    variants: {
      variant: {
        // The accent outline: the one call to action a section leads with.
        primary: "border border-mark text-accent hover:bg-hover",
        // The ink outline: every other action.
        secondary: "border border-ink text-ink hover:bg-hover",
        // A plain text link for tertiary actions.
        ghost: "font-body text-accent underline underline-offset-4 hover:text-ink",
      },
      size: {
        sm: "min-h-10 px-3 text-base",
        md: "min-h-[46px] px-5 text-lg",
        lg: "min-h-[50px] px-6 text-xl",
      },
    },
    compoundVariants: [
      // A text link keeps the surrounding text size and needs no box padding.
      { variant: "ghost", class: "min-h-0 px-0 text-sm" },
    ],
    defaultVariants: { variant: "primary", size: "md" },
  }
);
