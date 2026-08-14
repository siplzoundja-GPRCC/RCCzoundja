import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-3 text-3xl leading-tight font-semibold text-primary sm:text-4xl">{title}</h2>
      <span className={cn("gold-rule mt-5", align === "center" && "mx-auto")} />
      {subtitle ? <p className="mt-5 text-base text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}
