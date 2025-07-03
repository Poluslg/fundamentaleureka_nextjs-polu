import { Copy, CopyCheck, Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

const MarkdownTypewriter = ({ content = "", speed = 20 }) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!content) return;
    if (speed === -1) {
      setDisplayed(content);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayed(content.slice(0, index));
      if (index >= content.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed]);

  const CodeBlock = ({ className, children }) => {
    const language = className?.replace("language-", "") || "";
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div>
        <div
          className={cn(
            "h-7 w-full flex flex-row items-center px-2 bg-[#2b30356e] rounded-t-md mt-3 -mb-2",
            language ? "justify-between" : "justify-end"
          )}
        >
          {language}
          <div className="relative group">
            <button
              onClick={handleCopy}
              className="cursor-pointer"
              aria-label="Copy code"
            >
              {copied ? (
                <CopyCheck className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy {language}</span>
            </button>

            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded w-auto px-5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-100 pointer-events-none z-10">
              {copied ? "Copied!" : "Copy code"}
            </span>
          </div>
        </div>

        <SyntaxHighlighter
          language={language}
          style={oneDark}
          wrapLongLines={true}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    );
  };

  const ImageBlock = ({ src, alt }) => {
    const handleDownload = () => {
      const link = document.createElement("a");
      link.href = src;
      link.download = alt;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div>
        <button
          className="h-7 w-full flex justify-end items-center px-2 bg-[#2b30356e] rounded-t-md cursor-pointer"
          title="Download"
          aria-label="Download image"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
        </button>
        <img src={src} alt={alt} className="h-auto w-auto" loading="lazy" />
      </div>
    );
  };

  const BoldText = ({ children }) => {
    return <strong className="font-bold text-light">{children}</strong>;
  };

  const Paragraph = ({ children }) => {
    return <div className="mb-2  p-1">{children}</div>; // Add margin-bottom for spacing
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: CodeBlock,
        img: ImageBlock,
        strong: BoldText,
        p: Paragraph,
      }}
    >
      {displayed.replace(/\n/g, "  \n")}
    </ReactMarkdown>
  );
};
export default MarkdownTypewriter;
