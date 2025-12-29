"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { InputForm } from "@/components/sanmei/input-form";
import { ResultView } from "@/components/sanmei/result-view";
import { calculateSanmei } from "@/components/sanmei/calculator";
import Loader from "@/components/loader";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URLパラメータから初期値を取得
  const initialBirthDate = searchParams.get("date") || "";
  const initialGender = (searchParams.get("gender") as "male" | "female") || "female";
  const initialShowResult = searchParams.get("result") === "true";

  const [birthDate, setBirthDate] = useState(initialBirthDate);
  const [gender, setGender] = useState<"male" | "female">(initialGender);
  const [isTransformed, setIsTransformed] = useState(false);
  const [showResult, setShowResult] = useState(initialShowResult);
  const [isLoading, setIsLoading] = useState(false);

  const result = useMemo(() => {
    return calculateSanmei(birthDate, isTransformed);
  }, [birthDate, isTransformed]);

  // URLを更新する関数
  const updateURL = useCallback((date: string, g: string, show: boolean) => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (g) params.set("gender", g);
    if (show) params.set("result", "true");

    const newURL = params.toString() ? `?${params.toString()}` : "/";
    window.history.replaceState(null, "", newURL);
  }, []);

  const handleSubmit = () => {
    if (!birthDate) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
      updateURL(birthDate, gender, true);
    }, 1500);
  };

  const handleBack = () => {
    setShowResult(false);
    updateURL(birthDate, gender, false);
  };

  if (!showResult) {
    return (
      <InputForm
        birthDate={birthDate}
        gender={gender}
        isLoading={isLoading}
        onBirthDateChange={setBirthDate}
        onGenderChange={setGender}
        onSubmit={handleSubmit}
      />
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-8">
      <ResultView
        result={result}
        birthDate={birthDate}
        gender={gender}
        isTransformed={isTransformed}
        onToggleTransformed={() => setIsTransformed((prev) => !prev)}
        onBack={handleBack}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<Loader />}>
      <HomeContent />
    </Suspense>
  );
}
