"use client";

import { useState, useRef, useEffect } from "react";
import { KeyRound, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PASSCODE = "1272";
const PASSCODE_LENGTH = 4;

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [code, setCode] = useState<string[]>(Array(PASSCODE_LENGTH).fill(""));
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // セッションストレージから認証状態を復元
  useEffect(() => {
    const stored = sessionStorage.getItem("sanmei-auth");
    if (stored === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // 数字のみ許可
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // 最後の1文字のみ
    setCode(newCode);
    setError(false);

    // 次の入力欄に自動フォーカス
    if (value && index < PASSCODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, PASSCODE_LENGTH);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
    setError(false);

    // 最後の入力欄にフォーカス
    const focusIndex = Math.min(pastedData.length, PASSCODE_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = () => {
    const enteredCode = code.join("");
    if (enteredCode === PASSCODE) {
      sessionStorage.setItem("sanmei-auth", "true");
      setIsAuthenticated(true);
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setCode(Array(PASSCODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card
        className={cn(
          "w-full max-w-md rounded-2xl border-border shadow-xl transition-transform",
          isShaking && "animate-shake",
        )}
      >
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="size-8 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">秘伝の間</CardTitle>
          <CardDescription className="text-base mt-2">
            宿星の扉を開く鍵言を記してください
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* パスコード入力 */}
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  "size-14 text-center text-2xl font-bold rounded-xl border-2 bg-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  error
                    ? "border-destructive text-destructive"
                    : digit
                      ? "border-primary"
                      : "border-border",
                )}
              />
            ))}
          </div>

          {/* エラーメッセージ */}
          {error && (
            <p className="text-center text-sm text-destructive">
              鍵言が異なります。再びお試しください。
            </p>
          )}

          {/* 送信ボタン */}
          <Button
            onClick={handleSubmit}
            disabled={code.some((d) => !d)}
            className="w-full h-12 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            <KeyRound className="size-5 mr-2" />
            扉を開く
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
