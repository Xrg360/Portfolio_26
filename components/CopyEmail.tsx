"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { contact } from "@/content/site";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const r = document.createRange();
      const el = document.getElementById("contact-email");
      if (el) {
        r.selectNodeContents(el);
        const s = window.getSelection();
        s?.removeAllRanges();
        s?.addRange(r);
        document.execCommand?.("copy");
      }
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  return (
    <div className="relative inline-flex max-w-full flex-wrap items-center gap-3">
      <a id="contact-email" href={`mailto:${email}`} className="font-mono text-base break-all link-grow sm:text-lg">
        {email}
      </a>
      <button type="button" onClick={copy} className="btn !min-h-[40px] !px-3 text-sm" data-cursor="copy">
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {copied ? contact.copiedLabel : contact.copyLabel}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
      {copied ? (
        <span aria-hidden="true" className="pop absolute -top-10 right-0 rounded-md border-2 border-ink bg-ink px-2.5 py-1 font-mono text-xs text-bg">
          copied ✓
        </span>
      ) : null}
    </div>
  );
}
