"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon, Loader2, Heart, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface PersonInput {
  birthDate: string;
  gender: "male" | "female";
}

interface CompatibilityInputProps {
  person1: PersonInput;
  person2: PersonInput;
  isLoading: boolean;
  onPerson1Change: (person: PersonInput) => void;
  onPerson2Change: (person: PersonInput) => void;
  onSubmit: () => void;
}

function PersonInputCard({
  label,
  person,
  onChange,
}: {
  label: string;
  person: PersonInput;
  onChange: (person: PersonInput) => void;
}) {
  const selectedDate = person.birthDate ? new Date(person.birthDate) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      onChange({ ...person, birthDate: `${yyyy}-${mm}-${dd}` });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-pink-500/50" />
        <h3 className="text-sm font-bold tracking-wider text-foreground/90 uppercase">{label}</h3>
      </div>

      {/* 生年月日入力 */}
      <div className="space-y-2">
        <Label className="text-[10px] font-extrabold text-muted-foreground ml-1 uppercase tracking-widest">
          生年月日
        </Label>
        <Popover>
          <PopoverTrigger
            render={(props) => (
              <Button
                {...props}
                variant="outline"
                className={cn(
                  "w-full h-12 rounded-2xl text-sm justify-start text-left font-bold border-border/60 hover:border-pink-500/30 transition-all bg-white/50 dark:bg-black/20",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-3 h-4 w-4 text-pink-500/60" />
                {selectedDate
                  ? format(selectedDate, "yyyy年M月d日", { locale: ja })
                  : "生年月日を選択"}
              </Button>
            )}
          />
          <PopoverContent
            className="w-auto p-0 rounded-2xl overflow-hidden shadow-2xl border-none"
            align="center"
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
      <div className="space-y-2">
        <Label className="text-[10px] font-extrabold text-muted-foreground ml-1 uppercase tracking-widest">
          性別
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {(["female", "male"] as const).map((g) => {
            const isActive = person.gender === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => onChange({ ...person, gender: g })}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-2xl h-12 text-[13px] font-bold transition-all duration-300",
                  isActive
                    ? "bg-linear-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/20 active:scale-95"
                    : "bg-white/50 dark:bg-black/20 text-muted-foreground hover:bg-white/80 dark:hover:bg-black/40 border border-border/50",
                )}
              >
                <span className="text-base opacity-70">{g === "female" ? "♀" : "♂"}</span>
                <span>{g === "female" ? "女性" : "男性"}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function CompatibilityInput({
  person1,
  person2,
  isLoading,
  onPerson1Change,
  onPerson2Change,
  onSubmit,
}: CompatibilityInputProps) {
  const isValid = person1.birthDate && person2.birthDate;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-background via-muted/20 to-background overflow-hidden relative">
      {/* 背景装飾 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] size-[400px] rounded-full bg-(--gogyo-wood) blur-[120px] opacity-[0.06]" />
        <div className="absolute bottom-[-5%] right-[-5%] size-[400px] rounded-full bg-(--gogyo-water) blur-[120px] opacity-[0.06]" />
      </div>

      <Card className="w-full max-w-2xl rounded-[2rem] border-white/40 dark:border-white/5 shadow-2xl backdrop-blur-xl bg-white/70 dark:bg-black/40 relative z-10 overflow-hidden">
        {/* 装飾的な上部ライン */}
        <div className="h-1.5 w-full bg-linear-to-r from-pink-400 via-rose-500 to-orange-400" />

        <CardHeader className="text-center pt-12 pb-6 space-y-4">
          <div className="flex justify-start absolute top-9 left-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/70 hover:text-foreground transition-colors group"
            >
              <div className="size-6 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-pink-500/10 transition-colors">
                <ArrowLeft className="size-3" />
              </div>
              命式鑑定に戻る
            </Link>
          </div>

          <div className="mx-auto flex size-20 items-center justify-center rounded-[1.5rem] bg-linear-to-br from-pink-500 to-rose-600 shadow-xl shadow-pink-500/20">
            <Heart className="size-10 text-white" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              相性診断
            </CardTitle>
            <CardDescription className="text-sm font-medium text-muted-foreground">
              二人の宿命の重なりから、縁の深さを読み解きます
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-10 space-y-8">
          {/* 説明セクション */}
          <div className="rounded-2xl bg-pink-500/5 p-5 border border-pink-500/10">
            <div className="flex items-center gap-2 mb-2 font-bold text-sm text-pink-500">
              <span className="size-1.5 rounded-full bg-pink-500" />
              診断の仕組み
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              算命学の命式を重ね合わせ、五行の相生・相剋や、律音・大半会といった特殊な縁を分析。二人の行動領域（宇宙盤）の一致度まで細かく読み解き、関係性の本質を導き出します。
            </p>
          </div>

          {/* 二人分の入力フォーム */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative">
              <PersonInputCard label="あなた" person={person1} onChange={onPerson1Change} />
            </div>
            <div className="relative">
              <div className="hidden md:absolute md:inset-y-0 md:left-[-20px] md:flex md:items-center">
                <div className="h-2/3 w-px bg-border/40" />
              </div>
              <PersonInputCard label="相手" person={person2} onChange={onPerson2Change} />
            </div>
          </div>

          {/* 診断ボタン */}
          <div className="pt-4">
            <Button
              onClick={onSubmit}
              disabled={!isValid || isLoading}
              className={cn(
                "w-full h-16 rounded-2xl text-lg font-bold shadow-xl transition-all duration-500 group relative overflow-hidden",
                "bg-linear-to-r from-pink-500 via-rose-500 to-pink-500 bg-size-[200%_auto] hover:bg-right",
                "text-white border-none",
                "disabled:opacity-50 disabled:shadow-none",
              )}
              size="lg"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              {isLoading ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="size-6 animate-spin" />
                  診断中...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <Sparkles className="size-6" />
                  相性を診断する
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
