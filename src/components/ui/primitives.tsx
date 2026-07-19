import {
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
} from "react";

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const styles = {
    primary:
      "bg-[var(--ember)] text-[var(--ink)] hover:bg-[var(--ember-hot)]",
    secondary:
      "border border-white/25 text-white hover:border-white hover:bg-white hover:text-[var(--ink)]",
    ghost: "text-white/70 hover:bg-white/10 hover:text-white",
    danger: "border border-red-400/40 text-red-300 hover:bg-red-500/10",
  }[variant];

  return (
    <button
      className={`inline-flex h-11 items-center justify-center px-5 font-mono text-[11px] uppercase tracking-[0.16em] transition disabled:opacity-40 ${styles} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({
  className = "",
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="flex w-full flex-col gap-2 text-left">
      {label && (
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
          {label}
        </span>
      )}
      <input
        className={`h-11 w-full border border-white/15 bg-transparent px-4 text-[14px] text-white outline-none transition placeholder:text-white/30 focus:border-[var(--ember)] ${className}`}
        {...props}
      />
    </label>
  );
}

export function TextArea({
  className = "",
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="flex w-full flex-col gap-2 text-left">
      {label && (
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
          {label}
        </span>
      )}
      <textarea
        className={`min-h-28 w-full border border-white/15 bg-transparent px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-white/30 focus:border-[var(--ember)] ${className}`}
        {...props}
      />
    </label>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-white/12 bg-[var(--steel)] p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "ember",
}: {
  children: ReactNode;
  tone?: "ember" | "muted" | "ok" | "warn";
}) {
  const tones = {
    ember: "text-[var(--ember)] border-[var(--ember)]/40",
    muted: "text-white/50 border-white/20",
    ok: "text-emerald-300 border-emerald-400/40",
    warn: "text-amber-200 border-amber-400/40",
  }[tone];
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${tones}`}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display mt-3 text-[clamp(1.8rem,4vw,2.75rem)] font-medium leading-[1.05] text-white">
        {title}
      </h1>
      {description && (
        <p
          className={`mt-3 max-w-xl text-[14px] leading-relaxed text-white/55 sm:text-[15px] ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-white/15 px-6 py-16 text-center">
      <p className="font-display text-[1.5rem] text-white">{title}</p>
      <p className="mt-2 max-w-sm text-[14px] text-white/45">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
