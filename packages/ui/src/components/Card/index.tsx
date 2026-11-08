import * as React from "react";
import { cn } from "../../utils/cn";

export const GlassCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-white/20 bg-white/40 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
GlassCard.displayName = "GlassCard";
