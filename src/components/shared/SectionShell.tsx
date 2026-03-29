import { cn } from "@/lib/utils";

interface SectionShellProps {
  children: React.ReactNode;
  className?: string;
  /** "default" = py-24 md:py-32, "emphasis" = py-32 md:py-40 */
  spacing?: "default" | "emphasis" | "tight";
  id?: string;
}

export function SectionShell({
  children,
  className,
  spacing = "default",
  id,
}: SectionShellProps) {
  const spacingClass = {
    tight: "py-16 md:py-20",
    default: "py-24 md:py-32",
    emphasis: "py-32 md:py-40",
  }[spacing];

  return (
    <section
      id={id}
      className={cn(
        spacingClass,
        "px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10",
        className,
      )}
    >
      {children}
    </section>
  );
}
