import Hero from "@/components/landing/Hero";
import Anatomy from "@/components/landing/Anatomy";
import Tasks from "@/components/landing/Tasks";
import Features from "@/components/landing/Features";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Hero />
      <Anatomy />
      <Tasks />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
  