"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon, Loader2, Sparkles, Heart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface InputFormProps {
  birthDate: string;
  gender: "male" | "female";
  isLoading: boolean;
  onBirthDateChange: (value: string) => void;
  onGenderChange: (value: "male" | "female") => void;
  onSubmit: () => void;
}

export function InputForm({
  birthDate,
  gender,
  isLoading,
  onBirthDateChange,
  onGenderChange,
  onSubmit,
}: InputFormProps) {
  const selectedDate = birthDate ? new Date(birthDate) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      onBirthDateChange(`${yyyy}-${mm}-${dd}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-background via-muted/20 to-background overflow-hidden relative">
      {/* 背景装飾 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] size-[400px] rounded-full bg-(--gogyo-wood) blur-[120px] opacity-[0.08]" />
        <div className="absolute bottom-[-5%] right-[-5%] size-[400px] rounded-full bg-(--gogyo-water) blur-[120px] opacity-[0.08]" />
      </div>

      <Card className="w-full max-w-2xl rounded-[2rem] border-white/40 dark:border-white/5 shadow-2xl backdrop-blur-xl bg-white/70 dark:bg-black/40 relative z-10 overflow-hidden">
        {/* 装飾的な上部ライン */}
        <div className="h-1.5 w-full bg-linear-to-r from-(--gogyo-wood) via-(--gogyo-water) to-(--gogyo-fire)" />

        <CardHeader className="text-center pt-10 pb-6 space-y-4">
          <div className="mx-auto flex size-20 items-center justify-center rounded-[1.5rem] bg-linear-to-br from-(--gogyo-wood) to-[oklch(0.55_0.15_160)] shadow-lg shadow-emerald-500/20">
            <Sparkles className="size-10 text-white" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              算命学鑑定
            </CardTitle>
            <CardDescription className="text-sm font-medium text-muted-foreground">
              生年月日から、あなただけの宿命の星を読み解きます
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-10 space-y-8">
          {/* 説明セクション */}
          <div className="rounded-2xl bg-muted/40 p-5 border border-white/20 dark:border-white/5">
            <div className="flex items-center gap-2 mb-2 font-bold text-sm text-(--gogyo-wood)">
              <span className="size-1.5 rounded-full bg-(--gogyo-wood)" />
              算命学とは
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              古代中国より伝わる「陰陽五行説」を基にした本格的な運命学です。生年月日から算出される星図は、その人の本質や才能、そして人生の設計図を美しく描き出します。
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {/* 生年月日入力 */}
            <div className="space-y-3">
              <Label className="text-xs font-bold text-foreground/70 ml-1">生年月日</Label>
              <Popover>
                <PopoverTrigger
                  render={(props) => (
                    <Button
                      {...props}
                      variant="outline"
                      className={cn(
                        "w-full h-14 rounded-2xl text-base justify-start text-left font-semibold border-border/60 hover:border-border transition-all bg-white/50 dark:bg-black/20",
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-(--gogyo-wood)" />
                      {selectedDate
                        ? format(selectedDate, "yyyy年M月d日", { locale: ja })
                        : "生年月日を選択"}
                    </Button>
                  )}
                />
                <PopoverContent
                  className="w-auto p-0 rounded-2xl overflow-hidden shadow-2xl border-none"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    locale={ja}
                    captionLayout="dropdown"
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                    defaultMonth={selectedDate || new Date(1990, 0, 1)}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    className="p-4"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 性別選択 */}
            <div className="space-y-3">
              <Label className="text-xs font-bold text-foreground/70 ml-1">性別の設定</Label>
              <div className="grid grid-cols-2 gap-3">
                {(["female", "male"] as const).map((g) => {
                  const isActive = gender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => onGenderChange(g)}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-2xl h-14 text-[13px] font-bold transition-all duration-300 relative overflow-hidden",
                        isActive
                          ? "text-white shadow-lg scale-[1.02]"
                          : "bg-white/50 dark:bg-black/20 border border-border/60 text-muted-foreground hover:bg-white dark:hover:bg-black/40",
                      )}
                    >
                      {isActive && (
                        <div
                          className={cn(
                            "absolute inset-0 bg-linear-to-br transition-all duration-500",
                            g === "female"
                              ? "from-pink-500 to-rose-600"
                              : "from-blue-500 to-indigo-600",
                          )}
                        />
                      )}
                      <span className="relative z-10 text-lg leading-none">
                        {g === "female" ? "♀" : "♂"}
                      </span>
                      <span className="relative z-10">{g === "female" ? "女性" : "男性"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 鑑定ボタン */}
          <div className="pt-2">
            <Button
              onClick={onSubmit}
              disabled={!birthDate || isLoading}
              className={cn(
                "w-full h-16 rounded-2xl text-lg font-bold shadow-xl transition-all duration-500 group relative overflow-hidden",
                "bg-linear-to-r from-[oklch(0.6_0.16_160)] via-[oklch(0.55_0.18_210)] to-(--gogyo-water) bg-size-[200%_auto] hover:bg-right",
                "text-white border-none",
                "disabled:opacity-50 disabled:shadow-none",
              )}
              size="lg"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              {isLoading ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="size-6 animate-spin" />
                  解析中...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <Sparkles className="size-6" />
                  運命を読み解く
                </span>
              )}
            </Button>
          </div>

          {/* 相性診断リンク */}
          <div className="pt-6 border-t border-border/40">
            <Link href="/compatibility" className="group">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-linear-to-r from-pink-500/5 to-rose-500/5 hover:from-pink-500/10 hover:to-rose-500/10 border border-pink-500/10 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-pink-500/20 text-pink-500 group-hover:scale-110 transition-transform">
                    <Heart className="size-6 fill-current opacity-80" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">相性診断</p>
                    <p className="text-xs text-muted-foreground">二人の宿命の重なりを診断する</p>
                  </div>
                </div>
                <div className="size-8 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
