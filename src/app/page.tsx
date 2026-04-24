"use client";

import Link from "next/link";
import YearView from "@/components/YearView";
import FeastTimeline from "@/components/FeastTimeline";
import FourYears from "@/components/FourYears";
import AlgorithmTrace from "@/components/AlgorithmTrace";
import Converter from "@/components/Converter";

export default function Home() {
  const sections = [
    { id: "year", label: "Year View" },
    { id: "timeline", label: "Timeline" },
    { id: "four_years", label: "Four Years Cycle" },
    { id: "trace", label: "Trace" },
    { id: "converter", label: "Converter" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-[12px] flex items-center justify-between px-6 h-16">
        <nav className="flex flex-wrap gap-4 md:gap-8 text-sm text-[#888] font-medium">
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
        <Link
          href="/documentation"
          className="text-sm text-[#888] hover:text-white transition-colors border border-white/10 px-4 py-1.5 rounded-md hover:border-white/30"
        >
          Documentation
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center">
        
        {/* Section 1: Hero & Year View */}
        <section id="year" className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center border-b border-white/10">
          <div className="text-center mb-16 space-y-6 max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight text-white">
              Ethiopian Lutheran<br/>Liturgical System
            </h1>
            <p className="text-[#888] text-lg md:text-xl leading-relaxed">
              Designed specifically for Ethiopian Lutherans (LCE, EECMY, and EELC).<br/>
              Validate Bahire Hasab computations with absolute precision.
            </p>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#year"
                className="px-7 py-3 bg-white text-black text-sm font-semibold rounded-lg hover:bg-[#ededed] transition-colors"
              >
                Explore the Calendar
              </a>
              <Link
                href="/documentation"
                className="px-7 py-3 border border-white/20 text-[#aaa] text-sm font-medium rounded-lg hover:border-white/40 hover:text-white transition-colors"
              >
                Read the Documentation →
              </Link>
            </div>
          </div>
          <div className="w-full">
            <YearView />
          </div>
        </section>

        {/* Section 2: Timeline */}
        <section id="timeline" className="w-full bg-[#050505] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Movable Feasts Orbit</h2>
              <p className="text-[#888]">Visualize the shifting dates of feasts along the 365-day axis.</p>
            </div>
            <FeastTimeline />
          </div>
        </section>

        {/* Section 3: Four Years Cycle */}
        <section id="four_years" className="w-full bg-black border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Evangelist Shifts</h2>
              <p className="text-[#888]">Analyze how the Fasika date shifts across a full four-year cycle.</p>
            </div>
            <FourYears />
          </div>
        </section>

        {/* Section 4: Algorithm Trace */}
        <section id="trace" className="w-full bg-[#050505] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
             <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Computation Transparency</h2>
              <p className="text-[#888]">Step-by-step trace of the Bahire Hasab algorithm.</p>
            </div>
            <AlgorithmTrace />
          </div>
        </section>

        {/* Section 5: Converter */}
        <section id="converter" className="w-full bg-[linear-gradient(to_bottom,#000,#050505)]">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 flex justify-center">
            <Converter />
          </div>
        </section>
        
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[#888] text-sm">
          <div className="flex items-center gap-2">
            <span>© 2026 Ethiopian Lutheran Liturgical System (LCE, EECMY, EELC)</span>
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
