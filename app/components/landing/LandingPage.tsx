"use client";

import { useRef } from "react";

import { useCompileTester } from "@/app/features/compile-tester/useCompileTester";

import { ClosingSection } from "./ClosingSection";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { LandingFooter } from "./LandingFooter";
import { LandingHeader } from "./LandingHeader";
import { RequestShapeSection } from "./RequestShapeSection";
import { useLandingAnimations } from "./useLandingAnimations";

export function LandingPage() {
  const pageRef = useRef<HTMLElement | null>(null);
  const tester = useCompileTester();

  useLandingAnimations(pageRef);

  return (
    <main ref={pageRef} className="min-h-screen bg-[var(--page-bg)] text-[var(--ink)]">
      <LandingHeader />
      <HeroSection {...tester} />
      <HowItWorksSection />
      <RequestShapeSection />
      <ClosingSection />
      <LandingFooter />
    </main>
  );
}
