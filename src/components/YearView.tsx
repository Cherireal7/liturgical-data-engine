"use client";

import { useState, useEffect } from "react";
import { calculateBahireHasab, ethiopianMonths, getEvangelist, fixedFeasts, BahireHasabResult, etToGc } from "@/engine/bahireHasab";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function YearView() {
  const [year, setYear] = useState(2018);
  const [data, setData] = useState<BahireHasabResult | null>(null);
  const [selectedDay, setSelectedDay] = useState<{month: number, day: number} | null>(null);

  useEffect(() => {
    setData(calculateBahireHasab(year));
  }, [year]);

  if (!data) return null;

  const evangelist = getEvangelist(year);
  const fasika = data.feasts["TINSAYE"];
  const fasikaGc = etToGc(year, fasika.month, fasika.day);
  const gcYearStart = etToGc(year, 1, 1).getFullYear();
  const gcYearEnd = etToGc(year, 13, 5).getFullYear();

  const isSunday = (m: number, d: number) => etToGc(year, m, d).getDay() === 0;

  const getDayDetails = (m: number, d: number) => {
    const feasts = [];
    const fasts = [];
    
    for (const [key, f] of Object.entries(data.feasts)) {
      if (f.month === m && f.day === d) feasts.push(f.name);
    }
    if (data.nineveh.month === m && data.nineveh.day === d) feasts.push(data.nineveh.name);

    for (const f of fixedFeasts) {
      if (f.month === m && f.day === d) feasts.push(f.name);
    }

    const abiyStart = data.feasts["ABIY_TSOME"];
    const siklet = data.feasts["SIKLET"];
    const abiyStartVal = abiyStart.month * 30 + abiyStart.day;
    const sikletVal = siklet.month * 30 + siklet.day;
    const currentVal = m * 30 + d;
    
    if (currentVal >= abiyStartVal && currentVal <= sikletVal) {
      fasts.push("ዐቢይ ጾም (Great Lent)");
    }

    let type = "regular";
    if (m === 13) type = "pagume";
    if (isSunday(m, d)) type = "sunday";
    if (fasts.length > 0) type = "fasting";
    if (feasts.length > 0) type = "feast";

    return { type, feasts, fasts };
  };

  const getCellColor = (type: string) => {
    switch (type) {
      case "feast": return "bg-white text-black font-semibold shadow-sm z-10";
      case "fasting": return "bg-[#111] text-[#888] border-white/10";
      case "sunday": return "bg-transparent text-white border-white/20 font-medium";
      case "pagume": return "bg-transparent text-[#444] border-transparent";
      default: return "bg-transparent text-[#888] border-transparent hover:border-white/10 hover:bg-[#111]";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 relative w-full">
      {/* Main Content */}
      <div className="flex-1 space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="flex items-center gap-6">
            <button onClick={() => setYear(y => y - 1)} className="p-2 border border-white/10 rounded-md hover:bg-white/5 transition">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                {year}
              </div>
              <div className="text-sm text-[#888] mt-2 tracking-wide">
                {gcYearStart} - {gcYearEnd} GC
              </div>
            </div>
            <button onClick={() => setYear(y => y + 1)} className="p-2 border border-white/10 rounded-md hover:bg-white/5 transition">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="px-4 py-2 border border-white/10 rounded-md bg-[#111] text-[#888] flex items-center gap-2">
              <span className="text-white/40">Evangelist</span>
              <span className="text-white font-medium font-ethiopic">{evangelist.name}</span>
            </div>
            <div className="px-4 py-2 border border-white/10 rounded-md bg-[#111] text-[#888] flex items-center gap-2">
              <span className="text-white/40">Fasika</span>
              <span className="text-white font-medium font-ethiopic">{ethiopianMonths[fasika.month - 1]} {fasika.day}</span>
            </div>
          </div>
        </div>

        {/* 13-Month Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {ethiopianMonths.map((monthName, mIndex) => {
            const m = mIndex + 1;
            const daysInMonth = m === 13 ? (year % 4 === 3 ? 6 : 5) : 30;
            const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

            return (
              <div key={m} className="flex flex-col">
                <h3 className="text-sm font-medium text-white mb-4 pb-2 border-b border-white/10 font-ethiopic">
                  {monthName}
                </h3>
                {/* Increased gap from gap-1.5 to gap-3 for looser clustering */}
                <div className="grid grid-cols-5 gap-3">
                  {days.map(d => {
                    const details = getDayDetails(m, d);
                    const isSelected = selectedDay?.month === m && selectedDay?.day === d;
                    return (
                      <button
                        key={d}
                        onClick={() => setSelectedDay({month: m, day: d})}
                        className={`
                          aspect-square flex flex-col items-center justify-center rounded-md text-sm border transition-all cursor-pointer relative
                          ${getCellColor(details.type)}
                          ${isSelected ? 'ring-1 ring-white/50 bg-[#111]' : ''}
                        `}
                        title={details.feasts.length > 0 ? details.feasts.join(', ') : ''}
                      >
                        <span>{d}</span>
                        {details.feasts.length > 0 && <div className={`w-1 h-1 rounded-full mt-1 ${details.type === 'feast' ? 'bg-black' : 'bg-white'}`} />}
                      </button>
                    )
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Validation Table */}
        <div className="w-full pt-12 border-t border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Fasika Validation (2010 - 2030 ET)</h3>
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm text-[#888]">
              <thead className="bg-[#111] text-[#888] border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">ET Year</th>
                  <th className="px-6 py-4 font-medium">Evangelist</th>
                  <th className="px-6 py-4 font-medium font-ethiopic">Fasika (ET)</th>
                  <th className="px-6 py-4 font-medium">Fasika (GC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {Array.from({length: 21}, (_, i) => 2010 + i).map(y => {
                  const b = calculateBahireHasab(y);
                  const ev = getEvangelist(y);
                  const f = b.feasts["TINSAYE"];
                  const fGc = etToGc(y, f.month, f.day);
                  return (
                    <tr key={y} className={`hover:bg-[#111] transition-colors ${y === year ? 'bg-white/5 text-white' : ''}`}>
                      <td className="px-6 py-4">{y}</td>
                      <td className="px-6 py-4 font-ethiopic">{ev.name}</td>
                      <td className="px-6 py-4 font-ethiopic text-white">{ethiopianMonths[f.month - 1]} {f.day}</td>
                      <td className="px-6 py-4">{fGc.toDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sidebar Inspector */}
      {selectedDay && (
        <div className="w-full lg:w-80 shrink-0 bg-[#0a0a0a] border border-white/10 rounded-xl p-6 h-fit sticky top-24">
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/10">
            <div>
              <h3 className="text-xl font-bold text-white font-ethiopic">
                {ethiopianMonths[selectedDay.month - 1]} {selectedDay.day}
              </h3>
              <p className="text-[#888] text-sm mt-1">
                {etToGc(year, selectedDay.month, selectedDay.day).toDateString()}
              </p>
            </div>
            <button onClick={() => setSelectedDay(null)} className="text-[#888] hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-[#888] uppercase tracking-wider">Liturgical Context</h4>
              {getDayDetails(selectedDay.month, selectedDay.day).feasts.map((f, i) => (
                <div key={i} className="px-3 py-2 bg-white text-black rounded-md text-sm font-medium font-ethiopic">
                  {f}
                </div>
              ))}
              {getDayDetails(selectedDay.month, selectedDay.day).fasts.map((f, i) => (
                <div key={i} className="px-3 py-2 bg-[#111] border border-white/10 rounded-md text-sm text-[#888] font-ethiopic">
                  {f}
                </div>
              ))}
              {getDayDetails(selectedDay.month, selectedDay.day).feasts.length === 0 && getDayDetails(selectedDay.month, selectedDay.day).fasts.length === 0 && (
                <div className="text-sm text-[#444] italic">No major feasts or fasts</div>
              )}
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <h4 className="text-xs font-medium text-[#888] uppercase tracking-wider mb-4">Computation Values</h4>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-[#888]">Amete Alem</div><div className="text-right text-white font-mono">{data.ameteAlem}</div>
                <div className="text-[#888]">Medeb</div><div className="text-right text-white font-mono">{data.medeb}</div>
                <div className="text-[#888]">Wenber</div><div className="text-right text-white font-mono">{data.wenber}</div>
                <div className="text-[#888]">Metqi</div><div className="text-right text-white font-mono">{data.metqi}</div>
                <div className="text-[#888]">Abektie</div><div className="text-right text-white font-mono">{data.abektie}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
