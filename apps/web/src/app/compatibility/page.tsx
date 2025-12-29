"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { calculateSanmei } from "@/components/sanmei/calculator";
import { CompatibilityInput } from "@/components/sanmei/compatibility/compatibility-input";
import { CompatibilityResultView } from "@/components/sanmei/compatibility/compatibility-result";
import { calculateCompatibility } from "@/components/sanmei/compatibility/compatibility-calculator";
import Loader from "@/components/loader";

interface PersonInput {
  birthDate: string;
  gender: "male" | "female";
}

function CompatibilityContent() {
  const searchParams = useSearchParams();

  // URLパラメータから初期値を取得
  const initialPerson1: PersonInput = {
    birthDate: searchParams.get("date1") || "",
    gender: (searchParams.get("gender1") as "male" | "female") || "female",
  };
  const initialPerson2: PersonInput = {
    birthDate: searchParams.get("date2") || "",
    gender: (searchParams.get("gender2") as "male" | "female") || "male",
  };
  const initialShowResult = searchParams.get("result") === "true";

  const [person1, setPerson1] = useState<PersonInput>(initialPerson1);
  const [person2, setPerson2] = useState<PersonInput>(initialPerson2);
  const [showResult, setShowResult] = useState(initialShowResult);
  const [isLoading, setIsLoading] = useState(false);

  // 二人の命式を計算
  const result1 = useMemo(() => {
    return person1.birthDate ? calculateSanmei(person1.birthDate, false) : null;
  }, [person1.birthDate]);

  const result2 = useMemo(() => {
    return person2.birthDate ? calculateSanmei(person2.birthDate, false) : null;
  }, [person2.birthDate]);

  // 相性診断結果を計算
  const compatibilityResult = useMemo(() => {
    if (result1 && result2) {
      return calculateCompatibility(result1, result2);
    }
    return null;
  }, [result1, result2]);

  // URLを更新
  const updateURL = useCallback((p1: PersonInput, p2: PersonInput, show: boolean) => {
    const params = new URLSearchParams();
    if (p1.birthDate) params.set("date1", p1.birthDate);
    if (p1.gender) params.set("gender1", p1.gender);
    if (p2.birthDate) params.set("date2", p2.birthDate);
    if (p2.gender) params.set("gender2", p2.gender);
    if (show) params.set("result", "true");

    const newURL = params.toString() ? `?${params.toString()}` : "/compatibility";
    window.history.replaceState(null, "", newURL);
  }, []);

  const handleSubmit = () => {
    if (!person1.birthDate || !person2.birthDate) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
      updateURL(person1, person2, true);
    }, 1500);
  };

  const handleBack = () => {
    setShowResult(false);
    updateURL(person1, person2, false);
  };

  if (!showResult) {
    return (
      <CompatibilityInput
        person1={person1}
        person2={person2}
        isLoading={isLoading}
        onPerson1Change={setPerson1}
        onPerson2Change={setPerson2}
        onSubmit={handleSubmit}
      />
    );
  }

  if (!compatibilityResult) {
    return null;
  }

  return (
    <CompatibilityResultView
      result={compatibilityResult}
      person1BirthDate={person1.birthDate}
      person2BirthDate={person2.birthDate}
      onBack={handleBack}
    />
  );
}

export default function CompatibilityPage() {
  return (
    <Suspense fallback={<Loader />}>
      <CompatibilityContent />
    </Suspense>
  );
}
