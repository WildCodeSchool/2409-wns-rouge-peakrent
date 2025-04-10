import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  toCopy: string;
  srText?: string;
  copiedText?: string;
  size?: "icon" | "default" | "sm" | "lg" | null | undefined;
  className?: string;
  variant?:
    | "outline"
    | "link"
    | "default"
    | "destructive"
    | "secondary"
    | "ghost"
    | "primary"
    | null
    | undefined;
}

export default function CopyButton({
  toCopy,
  srText = "Copy Order ID",
  copiedText = "Copied !",
  size = "icon",
  className = "",
  variant = "outline",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    navigator.clipboard
      .writeText(toCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };
  return (
    <Button
      size={size}
      variant={variant}
      className={cn("relative size-6", className)}
      onClick={copyToClipboard}
    >
      {copied ? (
        <Check className="size-4 text-green-600" />
      ) : (
        <Copy className="size-3" />
      )}
      <span className="sr-only">{srText}</span>
    </Button>
  );
}
