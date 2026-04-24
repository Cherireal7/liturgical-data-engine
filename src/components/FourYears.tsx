"use client";

import { useState } from "react";
import { evangelists, calculateBahireHasab, ethiopianMonths } from "@/engine/bahireHasab";

export default function FourYears() {
  const [baseYear, setBaseYear] = useState(2018);
  
  const remainder = (baseYear + 5500) % 4;
  const startYear = baseYear - remainder;

  const cycleYears = [startYear, startYear + 1, startYear + 2, startYear + 3];

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">The Four-Year Cycle</h2>
          <p className="text-[#888] text-sm mt-1">Fasika shift across the Evangelists</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setBaseYear(y => y - 4)} className="px-4 py-2 bg-[#111] border border-white/10 rounded-md hover:bg-white/5 transition text-sm text-[#888] hover:text-white">
            Previous Cycle
          </button>
          <button onClick={() => setBaseYear(y => y + 4)} className="px-4 py-2 bg-[#111] border border-white/10 rounded-md hover:bg-white/5 transition text-sm text-[#888] hover:text-white">
            Next Cycle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cycleYears.map((year, i) => {
          const data = calculateBahireHasab(year);
          const evangelist = evangelists[i];
          const fasika = data.feasts["TINSAYE"];
          
          const fasikaDayIndex = fasika.month * 30 + fasika.day;
          const minIndex = 7 * 30 + 26;
          const maxIndex = 8 * 30 + 30;
          const percentage = ((fasikaDayIndex - minIndex) / (maxIndex - minIndex)) * 100;

          return (
            <div key={year} className="bg-[#050505] rounded-xl border border-white/10 overflow-hidden flex flex-col hover:border-white/20 transition-colors">
              <div className="p-6 bg-[#111] border-b border-white/10 text-center">
                <div className="text-2xl font-ethiopic font-bold text-white mb-1">
                  {evangelist.name}
                </div>
                <div className="text-[#888] uppercase tracking-widest text-xs">
                  {evangelist.nameEn} • Year {year}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-center space-y-8">
                <div className="text-center">
                  <div className="text-xs text-[#888] mb-2 uppercase tracking-wider font-medium">Fasika Date</div>
                  <div className="text-2xl font-ethiopic text-white font-bold">
                    {ethiopianMonths[fasika.month - 1]} {fasika.day}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-[#888] font-ethiopic">
                    <span>መጋቢት 26</span>
                    <span>ሚያዝያ 30</span>
                  </div>
                  <div className="h-1.5 bg-[#111] rounded-full overflow-hidden relative">
                    <div 
                      className="absolute top-0 bottom-0 w-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                      style={{ left: `${Math.max(0, Math.min(100, percentage))}%`, transform: 'translateX(-50%)' }}
                    />
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center text-xs pt-6 border-t border-white/10">
                  <div>
                    <div className="text-[#888] mb-1 font-medium">Nenewe</div>
                    <div className="text-white font-ethiopic">
                      {ethiopianMonths[data.nineveh.month - 1]} {data.nineveh.day}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#888] mb-1 font-medium">Beale Metqi</div>
                    <div className="text-white font-ethiopic">
                      {ethiopianMonths[data.bealeMetqiMonth - 1]} {data.metqi}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
