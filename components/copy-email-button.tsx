"use client";

import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { copyText, toast } from "@/lib/client-events";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = { email: string; variant?: "icon" | "button" | "inline"; className?: string };

/** Click copies the address (with a toast). The mailto link stays available elsewhere. */
export function CopyEmailButton({ email, variant = "icon", className }: Props) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    if (await copyText(email)) {
      setCopied(true);
      toast("Email copied to clipboard");
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy email address ${email}`}
        title="Copy email"
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "focus-ring", className)}
      >
        {copied ? <Check aria-hidden="true" className="h-4 w-4 text-azure-light" /> : <Mail aria-hidden="true" className="h-4 w-4" />}
      </button>
    );
  }

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={onCopy}
        className={cn(
          "focus-ring group inline-flex items-center gap-2 rounded-md font-mono text-sm text-slate-300 transition hover:text-white",
          className
        )}
      >
        <span className="underline decoration-white/20 underline-offset-4 group-hover:decoration-azure-light">{email}</span>
        {copied ? <Check aria-hidden="true" className="h-4 w-4 text-azure-light" /> : <Copy aria-hidden="true" className="h-4 w-4 text-slate-400 group-hover:text-azure-light" />}
        <span className="sr-only">Copy email address</span>
      </button>
    );
  }

  return (
    <button type="button" onClick={onCopy} className={cn(buttonVariants({ variant: "secondary" }), className)}>
      {copied ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
      {copied ? "Copied" : "Copy email"}
    </button>
  );
}
