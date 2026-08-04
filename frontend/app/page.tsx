import Hero from "@/components/landing/Hero";
import MovingStrip from "@/components/landing/MovingStrip";
import Anatomy from "@/components/landing/Anatomy";
import Tasks from "@/components/landing/Tasks";
import Features from "@/components/landing/Features";
import PricingNew from "@/components/landing/PricingNew";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Hero />
      <MovingStrip />
      <Anatomy />
      <Tasks />
      <Features />
      <PricingNew />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}