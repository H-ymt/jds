"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon, Loader2, Heart, ArrowLeft } from "lucide-react";
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
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-center">{label}</h3>

      {/* 生年月日入力 */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">生年月日</Label>
        <Popover>
          <PopoverTrigger
            render={(props) => (
              <Button
                {...props}
                variant="outline"
                className={cn(
                  "w-full h-11 rounded-xl text-sm justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "yyyy年M月d日", { locale: ja }) : "選択"}
              </Button>
            )}
          />
          <PopoverContent className="w-auto p-0" align="center">
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
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* 性別選択 */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">性別</Label>
        <div className="grid grid-cols-2 gap-2">
          {(["female", "male"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onChange({ ...person, gender: g })}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-medium transition-all",
                person.gender === g
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground",
              )}
            >
              <span className="text-base">{g === "female" ? "♀" : "♂"}</span>
              <span>{g === "female" ? "女性" : "男性"}</span>
            </button>
          ))}
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl rounded-2xl border-border shadow-xl">
        <CardHeader className="text-center pb-2">
          {/* 戻るリンク */}
          <div className="flex justify-start mb-2">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "ghost" }), "flex items-center gap-1")}
            >
              <ArrowLeft className="size-4" />
              <span>命式鑑定に戻る</span>
            </Link>
          </div>

          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-pink-500/10">
            <Heart className="size-8 text-pink-500" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">相性診断</CardTitle>
          <CardDescription className="text-base">
            二人の生年月日から相性を診断します
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 説明 */}
          <div className="rounded-xl bg-muted/50 p-4 text-sm">
            <p className="font-medium text-foreground mb-1.5">相性診断とは？</p>
            <p className="text-muted-foreground leading-relaxed">
              算命学の命式を比較し、二人の相性を診断します。五行の相生・相剋関係、特殊な縁（律音・大半会など）、行動領域の一致度を総合的に分析します。
            </p>
          </div>

          {/* 二人分の入力フォーム */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <PersonInputCard label="あなた" person={person1} onChange={onPerson1Change} />
            </div>
            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
              <PersonInputCard label="相手" person={person2} onChange={onPerson2Change} />
            </div>
          </div>

          {/* 診断ボタン */}
          <Button
            onClick={onSubmit}
            disabled={!isValid || isLoading}
            className="w-full h-14 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            size="lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                診断中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Heart className="size-5" />
                相性を診断する
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
