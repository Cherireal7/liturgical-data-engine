"use client";

import { useEffect, useState } from "react";
import { Play, Square } from "lucide-react";
import { calculateBahireHasab, getEvangelist, ethiopianMonths } from "@/engine/bahireHasab";

export default function AlgorithmTrace() {
  const [year, setYear] = useState(2018);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const data = calculateBahireHasab(year);
  const evangelist = getEvangelist(year);

  const steps = [
    {
      title: "Amete Alem (ዓመተ ዓለም)",
      desc: "Year of the World = Year of Grace + 5500",
      calc: `${year} + 5500`,
      result: data.ameteAlem
    },
    {
      title: "Evangelist (ወንጌላዊ)",
      desc: "Amete Alem mod 4",
      calc: `${data.ameteAlem} % 4`,
      result: evangelist.name
    },
    {
      title: "Medeb (መደብ)",
      desc: "Amete Alem mod 19",
      calc: `${data.ameteAlem} % 19`,
      result: data.medeb
    },
    {
      title: "Wenber (ወንበር)",
      desc: "Medeb - 1 (if Medeb = 0, Wenber = 18)",
      calc: data.medeb === 0 ? "0 -> 18" : `${data.medeb} - 1`,
      result: data.wenber
    },
    {
      title: "Abektie (አበቅቴ)",
      desc: "(Wenber × 11) mod 30",
      calc: `(${data.wenber} × 11) % 30`,
      result: data.abektie
    },
    {
      title: "Metqi (መጥቅዕ)",
      desc: "(Wenber × 19) mod 30",
      calc: `(${data.wenber} × 19) % 30`,
      result: data.metqi
    },
    {
      title: "Beale Metqi (በዓለ መጥቅዕ)",
      desc: "If Metqi > 14 then Meskerem, else Tikimt",
      calc: `Metqi = ${data.metqi}`,
      result: `${ethiopianMonths[data.bealeMetqiMonth - 1]} ${data.metqi}`
    },
    {
      title: "Tewsak (ተውሳክ)",
      desc: "Offset based on the weekday of Beale Metqi",
      calc: `Weekday of ${ethiopianMonths[data.bealeMetqiMonth - 1]} ${data.metqi}`,
      result: data.tewsak
    },
    {
      title: "Mebaja Hamer (መባጃ ሐመር)",
      desc: "Metqi + Tewsak",
      calc: `${data.metqi} + ${data.tewsak}`,
      result: data.mebajaHamer > 30 ? `${data.mebajaHamer} -> ${data.mebajaHamer - 30} (Next Month)` : data.mebajaHamer
    },
    {
      title: "Nenewe (ጾመ ነነዌ)",
      desc: "Fast of Nineveh = Beale Metqi Month + Mebaja Hamer (adjusted)",
      calc: `Base Month + Mebaja Hamer`,
      result: `${ethiopianMonths[data.nineveh.month - 1]} ${data.nineveh.day}`
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      setActiveStep((step) => {
        if (step >= steps.length - 1) {
          setIsPlaying(false);
          return step;
        }
        return step + 1;
      });
    }, 900);

    return () => window.clearInterval(timer);
  }, [isPlaying, steps.length]);

  return (
    <div className="space-y-4 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <p className="text-[#888] text-xs">Run or inspect each Bahire Hasab (ባሕረ ሐሳብ) computation step.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (!isPlaying && activeStep >= steps.length - 1) setActiveStep(0);
              setIsPlaying((playing) => !playing);
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#050505] px-2.5 py-1.5 text-xs text-[#aaa] transition-colors hover:border-white/30 hover:text-white"
          >
            {isPlaying ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {isPlaying ? "Stop" : "Play"}
          </button>
          <label className="text-xs text-[#888] font-medium">Year (ET)</label>
          <input 
            type="number" 
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-[#050505] border border-white/20 rounded-md px-2.5 py-1.5 text-white w-20 text-xs focus:outline-none focus:border-white transition-colors shadow-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-[720px] items-center">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onMouseEnter={() => setActiveStep(i)}
                onFocus={() => setActiveStep(i)}
                className={`
                  flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition-colors
                  ${i <= activeStep ? "border-white bg-white text-black" : "border-white/20 bg-black text-[#777] hover:border-white/60 hover:text-white"}
                `}
                aria-label={`Trace step ${i + 1}: ${step.title}`}
              >
                {i + 1}
              </button>
              {i < steps.length - 1 && (
                <div className={`h-px flex-1 transition-colors ${i < activeStep ? "bg-white" : "bg-white/15"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {steps.map((step, i) => (
          <div
            key={i}
            onMouseEnter={() => setActiveStep(i)}
            onFocus={() => setActiveStep(i)}
            className={`
              group bg-[#050505] hover:bg-[#0a0a0a] transition-colors p-3 rounded-lg border
              ${i === activeStep ? "border-white/40 bg-[#0a0a0a]" : i < activeStep ? "border-white/20" : "border-white/10 hover:border-white/20"}
            `}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`
                      flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-colors
                      ${i <= activeStep ? "border-white bg-white text-black" : "border-white/20 bg-black text-[#888] group-hover:border-white group-hover:text-white"}
                    `}
                  >
                    {i + 1}
                  </span>
                  <h3 className="truncate text-sm font-bold text-white font-ethiopic tracking-tight">{step.title}</h3>
                </div>
                <p className="text-xs text-[#888] leading-snug">{step.desc}</p>
                <code className="text-[11px] text-[#aaa] block bg-[#111] border border-white/5 px-2 py-1.5 rounded-md w-fit max-w-full truncate font-mono">
                  {step.calc}
                </code>
              </div>
              <div className="flex items-start shrink-0">
                <div className="text-sm font-bold text-white font-ethiopic bg-[#111] px-3 py-2 rounded-md border border-white/10 shadow-sm min-w-[78px] max-w-32 text-center truncate">
                  {step.result}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
