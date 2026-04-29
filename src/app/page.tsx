"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import YearView from "@/components/YearView";
import FeastTimeline from "@/components/FeastTimeline";
import FourYears from "@/components/FourYears";
import AlgorithmTrace from "@/components/AlgorithmTrace";
import Converter from "@/components/Converter";
import LandingGeometry from "@/components/LandingGeometry";
import LiturgicalDashboard from "@/components/LiturgicalDashboard";
import FAQ from "@/components/FAQ";

export default function Home() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const sections = [
    { id: "year", label: "Year View" },
    { id: "timeline", label: "Timeline" },
    { id: "four_years", label: "Four Years Cycle" },
    { id: "trace", label: "Trace" },
    { id: "converter", label: "Converter" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col font-sans text-white">
      <LandingGeometry />
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-[12px]">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Link
              href="/mekane-yesus"
              className="text-xs sm:text-sm text-[#C8943A] hover:text-[#e0b05b] font-medium transition-colors border border-[#C8943A]/30 bg-[#C8943A]/10 px-3.5 py-1.5 rounded-md hover:border-[#C8943A]/50"
            >
              Mekane Yesus Lectionary
            </Link>
            <Link
              href="/documentation"
              className="text-xs sm:text-sm text-[#888] hover:text-white transition-colors border border-white/10 px-3.5 py-1.5 rounded-md hover:border-white/30"
            >
              Documentation
            </Link>
          </div>
          <nav className="hidden md:flex flex-wrap gap-6 text-sm text-[#888] font-medium">
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="transition-colors hover:text-white"
              >
                {sec.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setIsMobileNavOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-[#aaa] transition-colors hover:border-white/30 hover:text-white md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileNavOpen}
          >
            {isMobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        <nav
          className={`
            grid border-t border-white/10 bg-black/95 px-4 text-sm text-[#aaa] transition-[grid-template-rows]
            ${isMobileNavOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
            md:hidden
          `}
        >
          <div className="overflow-hidden">
            <div className="grid gap-1 py-2">
          {sections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              onClick={() => setIsMobileNavOpen(false)}
              className="rounded-md px-3 py-2 transition-colors hover:bg-white/5 hover:text-white"
            >
              {sec.label}
            </a>
          ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full flex flex-col items-center">
        
        {/* Section 1: Hero & Year View */}
        <section id="year" className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-24 pb-10 md:pb-14 flex flex-col items-center border-b border-white/10">
          <div className="min-h-[58vh] md:min-h-[64vh] flex flex-col items-center justify-center text-center space-y-5 max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight text-white">
              Ethiopian Lutheran<br/>Liturgical System
            </h1>
            <p className="text-[#888] text-base md:text-lg leading-relaxed max-w-2xl">
              Designed specifically for Ethiopian Lutherans (LCE, EECMY, and EELC).<br/>
              Validate Bahire Hasab computations with absolute precision.
            </p>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <a
                href="#year"
                className="px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-[#ededed] transition-colors"
              >
                Explore the Calendar
              </a>
              <Link
                href="/mekane-yesus"
                className="px-6 py-2.5 border border-[#C8943A]/40 bg-[#C8943A]/10 text-[#C8943A] text-sm font-semibold rounded-lg hover:border-[#C8943A]/60 hover:bg-[#C8943A]/20 transition-colors"
              >
                View Mekane Yesus Lectionary
              </Link>
              <Link
                href="/documentation"
                className="px-6 py-2.5 border border-white/20 text-[#aaa] text-sm font-medium rounded-lg hover:border-white/40 hover:text-white transition-colors"
              >
                Read the Documentation →
              </Link>
            </div>
          </div>
          <div className="mb-8 w-full pt-8 md:pt-12">
            <LiturgicalDashboard />
          </div>
          <div className="w-full">
            <YearView />
          </div>
        </section>

        {/* Section 2: Timeline */}
        <section id="timeline" className="w-full bg-[#050505] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-18 md:py-22">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Movable Feasts Orbit</h2>
              <p className="text-[#888]">Visualize the shifting dates of feasts along the 365-day axis.</p>
            </div>
            <FeastTimeline />
          </div>
        </section>

        {/* Section 3: Four Years Cycle */}
        <section id="four_years" className="w-full bg-black border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
            <div className="mb-10 text-center">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">Evangelist Shifts</h2>
              <p className="text-[#888]">Analyze how the Fasika date shifts across a full four-year cycle.</p>
            </div>
            <FourYears />
          </div>
        </section>

        {/* Section 4: Algorithm Trace */}
        <section id="trace" className="w-full bg-[#050505] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">
             <div className="mb-6 text-center">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-1.5">Computation Transparency</h2>
              <p className="text-sm text-[#888]">Step-by-step trace of the Bahire Hasab algorithm.</p>
            </div>
            <AlgorithmTrace />
          </div>
        </section>

        {/* Section 5: Converter */}
        <section id="converter" className="w-full bg-[linear-gradient(to_bottom,#000,#050505)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-16 flex justify-center">
            <Converter />
          </div>
        </section>

        {/* Section 6: FAQ */}
        <section id="faq" className="w-full bg-black border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            <FAQ />
          </div>
        </section>
        
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/10 py-10 px-4 sm:px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5 text-[#888] text-sm">
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            <span>© 2026 Ethiopian Lutheran Liturgical System (LCE, EECMY, EELC)</span>
            <span>Open source, built in collaboration with Cherinet and Lukas.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/documentation" className="hover:text-white transition-colors">Documentation</Link>
            <a href="#trace" className="hover:text-white transition-colors">Bahire Hasab</a>
            <a href="#converter" className="hover:text-white transition-colors">Converter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
