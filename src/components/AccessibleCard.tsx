import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface AccessibleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "article" | "div" | "section";
  interactive?: boolean;
  label?: string;
}

export const AccessibleCard = forwardRef<HTMLDivElement, AccessibleCardProps>(
  ({ as: Component = "div", interactive = false, label, className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={label}
        className={cn(
          "bg-card rounded-2xl border-2 border-border shadow-md transition-all",
          interactive && [
            "cursor-pointer",
            "hover:shadow-lg hover:border-primary hover:-translate-y-1",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "active:scale-[0.98]",
          ],
          className
        )}
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  (e.target as HTMLElement).click();
                }
              }
            : undefined
        }
        {...props}
      >
        {children}
      </Component>
    );
  }
);

AccessibleCard.displayName = "AccessibleCard";

