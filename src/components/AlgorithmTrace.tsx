"use client";

import { useState } from "react";
import { calculateBahireHasab, getEvangelist, ethiopianMonths } from "@/engine/bahireHasab";

export default function AlgorithmTrace() {
  const [year, setYear] = useState(2018);
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

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Algorithm Trace</h2>
          <p className="text-[#888] text-sm mt-1">Step-by-step Bahire Hasab (ባሕረ ሐሳብ) Computation</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-[#888] font-medium">Year (ET)</label>
          <input 
            type="number" 
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-[#050505] border border-white/20 rounded-md px-4 py-2 text-white w-24 focus:outline-none focus:border-white transition-colors shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-6 relative border-l border-white/10 ml-4 pl-8 sm:ml-8 sm:pl-12">
        {steps.map((step, i) => (
          <div key={i} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[45px] sm:-left-[61px] top-4 w-6 h-6 rounded-full bg-black border-2 border-white/20 flex items-center justify-center text-[10px] font-bold text-[#888] group-hover:border-white group-hover:text-white transition-colors z-10">
              {i + 1}
            </div>
            
            <div className="flex-1 bg-[#050505] hover:bg-[#0a0a0a] transition-colors p-6 rounded-xl border border-white/10 group-hover:border-white/20 flex flex-col sm:flex-row justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white font-ethiopic tracking-tight">{step.title}</h3>
                <p className="text-sm text-[#888]">{step.desc}</p>
                <code className="text-xs text-[#aaa] mt-4 block bg-[#111] border border-white/5 p-2.5 rounded-md w-fit font-mono">
                  {step.calc}
                </code>
              </div>
              <div className="flex items-center sm:justify-end shrink-0">
                <div className="text-xl font-bold text-white font-ethiopic bg-[#111] px-6 py-4 rounded-lg border border-white/10 shadow-sm min-w-[120px] text-center">
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
