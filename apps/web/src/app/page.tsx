"use client";

import { useState, useMemo } from "react";

import { InputForm } from "@/components/sanmei/input-form";
import { ResultView } from "@/components/sanmei/result-view";
import { calculateSanmei } from "@/components/sanmei/calculator";

export default function Home() {
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [isTransformed, setIsTransformed] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const result = useMemo(() => {
    return calculateSanmei(birthDate, isTransformed);
  }, [birthDate, isTransformed]);

  const handleSubmit = () => {
    if (!birthDate) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
    }, 1500);
  };

  const handleBack = () => {
    setShowResult(false);
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
    <ResultView
      result={result}
      isTransformed={isTransformed}
      onToggleTransformed={() => setIsTransformed((prev) => !prev)}
      onBack={handleBack}
    />
  );
}
