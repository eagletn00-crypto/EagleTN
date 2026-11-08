import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-white/20 backdrop-blur-md border border-white/30 text-slate-800 shadow-sm hover:bg-white/30",
        primary: "bg-black text-white hover:bg-black/90 shadow-md",
        ghost: "hover:bg-black/5 text-slate-700",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-14 rounded-2xl px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
