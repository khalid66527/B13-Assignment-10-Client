"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Icon } from "@iconify/react";

function CodeBlock({ language, codeString }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!codeString) return;
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2.5 rounded-xl overflow-hidden border border-slate-200 dark:border-[#3A3C2F] bg-slate-50 dark:bg-[#0A0B08] shadow-xs">
      <div className="px-3 py-1.5 bg-slate-100 dark:bg-[#141510] text-[11px] font-mono text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-[#2A2C22] flex justify-between items-center">
        <span className="uppercase text-[10px] tracking-wider text-amber-700 dark:text-[#D4AF37] font-bold">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer"
        >
          <Icon icon={copied ? "solar:check-circle-bold" : "solar:copy-bold"} className="size-3 text-amber-600 dark:text-[#D4AF37]" />
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-3 text-xs overflow-x-auto text-slate-800 dark:text-gray-200 font-mono leading-relaxed">
        <code>{codeString}</code>
      </pre>
    </div>
  );
}

export default function ChatMessageMarkdown({ content, isUser = false }) {
  if (isUser) {
    return <div className="whitespace-pre-wrap break-words">{content}</div>;
  }

  return (
    <div className="chat-markdown text-[13px] leading-relaxed text-slate-800 dark:text-gray-200 break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p({ children }) {
            return <p className="mb-2 last:mb-0 leading-relaxed text-slate-700 dark:text-gray-200">{children}</p>;
          },
          strong({ children }) {
            return (
              <strong className="font-bold text-amber-800 dark:text-[#FFE58F] tracking-wide">
                {children}
              </strong>
            );
          },
          em({ children }) {
            return <em className="italic text-slate-600 dark:text-gray-300">{children}</em>;
          },
          h1({ children }) {
            return (
              <h1 className="text-sm font-serif font-bold text-slate-900 dark:text-white mt-3 mb-1.5 border-b border-slate-200 dark:border-[#2A2C22] pb-1">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-[13px] font-serif font-bold text-amber-800 dark:text-[#FFE58F] mt-2.5 mb-1">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-xs font-bold text-amber-700 dark:text-[#D4AF37] uppercase tracking-wider mt-2 mb-1">
                {children}
              </h3>
            );
          },
          ul({ children }) {
            return <ul className="my-2 ml-4 list-disc space-y-1 text-[13px] text-slate-700 dark:text-gray-200">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="my-2 ml-4 list-decimal space-y-1 text-[13px] text-slate-700 dark:text-gray-200">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed pl-0.5">{children}</li>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-amber-600 dark:border-[#D4AF37] pl-3 py-1 my-2 bg-amber-50/50 dark:bg-[#12130F] rounded-r-lg text-xs italic text-slate-700 dark:text-gray-300">
                {children}
              </blockquote>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 dark:text-[#D4AF37] underline decoration-amber-600/40 dark:decoration-[#D4AF37]/50 hover:text-amber-900 dark:hover:text-[#FFE58F] font-semibold transition-colors"
              >
                {children}
              </a>
            );
          },
          hr() {
            return <hr className="my-2.5 border-slate-200 dark:border-[#2A2C22]" />;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-2.5 rounded-xl border border-slate-200 dark:border-[#2A2C22]">
                <table className="min-w-full text-xs divide-y divide-slate-200 dark:divide-[#2A2C22]">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-slate-100 dark:bg-[#141510] text-amber-800 dark:text-[#D4AF37] font-bold">{children}</thead>;
          },
          th({ children }) {
            return <th className="px-3 py-1.5 text-left text-[11px] font-bold uppercase text-slate-700 dark:text-gray-300">{children}</th>;
          },
          td({ children }) {
            return <td className="px-3 py-1.5 text-[12px] border-t border-slate-200 dark:border-[#2A2C22] text-slate-700 dark:text-gray-300">{children}</td>;
          },
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            if (!inline && (match || codeString.includes("\n"))) {
              return (
                <CodeBlock
                  language={match ? match[1] : ""}
                  codeString={codeString}
                />
              );
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#0A0B08] text-amber-800 dark:text-[#FFE58F] font-mono text-[11px] border border-slate-200 dark:border-[#3A3C2F]"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
