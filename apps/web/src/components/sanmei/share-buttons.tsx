"use client";

import { Share2, Link2, Check } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

interface ShareButtonsProps {
  text: string;
}

export function ShareButtons({ text }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  };

  const handleTwitterShare = () => {
    const url = getShareUrl();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const handleLineShare = () => {
    const url = getShareUrl();
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(lineUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // フォールバック
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="glass" size="pill" className="group">
            <Share2 className="size-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-semibold">シェア</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
        <DropdownMenuItem
          onClick={handleTwitterShare}
          className="gap-3 cursor-pointer py-2.5 rounded-lg focus:bg-muted"
        >
          <div className="flex size-4 items-center justify-center">
            <svg
              className="size-3.5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
          </div>
          <span className="flex-1">X (Twitter) でシェア</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLineShare}
          className="gap-3 cursor-pointer py-2.5 rounded-lg focus:bg-muted"
        >
          <div className="flex size-4 items-center justify-center">
            <svg
              className="size-4 fill-[#06C755]"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 5.82 2 10.51c0 3.72 3.28 6.84 7.72 7.89.3.06.71.19.81.43.1.22.06.55.03.77l-.13.78c-.04.23-.18.89.78.49s5.19-3.06 7.08-5.24C20.09 13.66 22 12.21 22 10.51 22 5.82 17.52 2 12 2zm-3.11 11.04H7.11c-.24 0-.43-.2-.43-.43V8.57c0-.23.19-.43.43-.43.24 0 .43.2.43.43v3.61h1.29c.24 0 .43.2.43.43 0 .24-.19.43-.43.43zm1.82-.43c0 .24-.19.43-.43.43-.24 0-.43-.2-.43-.43V8.57c0-.23.19-.43.43-.43.24 0 .43.2.43.43v4.04zm4.6 0c0 .19-.12.36-.29.42-.04.01-.08.02-.12.02-.12 0-.23-.05-.31-.14l-1.77-2.41v2.1c0 .24-.19.43-.43.43-.24 0-.43-.2-.43-.43V8.57c0-.19.12-.36.29-.42.04-.01.08-.02.12-.02.12 0 .23.05.31.14l1.77 2.41v-2.1c0-.23.19-.43.43-.43.24 0 .43.2.43.43v4.04zm2.6-2.34c.24 0 .43.2.43.43 0 .24-.19.43-.43.43h-1.29v.85h1.29c.24 0 .43.2.43.43 0 .24-.19.43-.43.43h-1.72c-.24 0-.43-.2-.43-.43V8.57c0-.23.19-.43.43-.43h1.72c.24 0 .43.2.43.43 0 .24-.19.43-.43.43h-1.29v.85h1.29z" />
            </svg>
          </div>
          <span className="flex-1">LINEでシェア</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleCopyLink}
          className="gap-3 cursor-pointer py-2.5 rounded-lg focus:bg-muted"
        >
          <div className="flex size-4 items-center justify-center">
            {copied ? <Check className="size-4 text-green-500" /> : <Link2 className="size-4" />}
          </div>
          <span className="flex-1">{copied ? "コピーしました！" : "リンクをコピー"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
