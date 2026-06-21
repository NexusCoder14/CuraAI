import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTA } from "@/components/landing/CTA";

export default function Page() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <CTA />
    </>
  );
}
