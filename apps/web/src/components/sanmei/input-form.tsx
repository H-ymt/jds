"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-xl rounded-2xl border-border/50 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="size-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">算命学鑑定</CardTitle>
          <CardDescription className="text-base">生年月日から宿命を読み解きます</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 算命学の説明 */}
          <div className="rounded-xl bg-muted/50 p-4 text-sm">
            <p className="font-medium text-foreground mb-1.5">算命学とは？</p>
            <p className="text-muted-foreground leading-relaxed">
              中国発祥の運命学で、生年月日から「陰占」と「陽占」を算出し、その人の本質・才能・運勢を読み解きます。
            </p>
          </div>

          {/* 生年月日入力 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">生年月日</Label>
            <Popover>
              <PopoverTrigger
                render={(props) => (
                  <Button
                    {...props}
                    variant="outline"
                    className={cn(
                      "w-full h-12 rounded-xl text-base justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate
                      ? format(selectedDate, "yyyy年M月d日", { locale: ja })
                      : "生年月日を選択"}
                  </Button>
                )}
              />
              <PopoverContent className="w-auto p-0" align="start">
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
            <Label className="text-sm font-medium">性別</Label>
            <div className="grid grid-cols-2 gap-3">
              {(["female", "male"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onGenderChange(g)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium transition-all",
                    gender === g
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground",
                  )}
                >
                  <span className="text-lg">{g === "female" ? "♀" : "♂"}</span>
                  <span>{g === "female" ? "女性" : "男性"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 鑑定ボタン */}
          <Button
            onClick={onSubmit}
            disabled={!birthDate || isLoading}
            className="w-full h-14 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                鑑定中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="size-5" />
                鑑定する
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
