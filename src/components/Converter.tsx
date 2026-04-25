"use client";

import { useState } from "react";
import { ethiopianMonths, gcToEt, etToGc, calculateBahireHasab, fixedFeasts } from "@/engine/bahireHasab";
import { ArrowRightLeft, Calendar } from "lucide-react";

function formatGcDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

export default function Converter() {
  const todayGc = new Date();
  const todayEt = gcToEt(todayGc);

  const [etDate, setEtDate] = useState({ year: todayEt.year, month: todayEt.month, day: todayEt.day });
  const [gcDate, setGcDate] = useState(formatGcDate(todayGc));

  const handleEtChange = (field: keyof typeof etDate, value: number) => {
    setEtDate((prev) => {
      const next = { ...prev, [field]: value };

      try {
        setGcDate(formatGcDate(etToGc(next.year, next.month, next.day)));
      } catch {
        // Invalid ET date handled silently.
      }

      return next;
    });
  };

  const handleGcChange = (val: string) => {
    setGcDate(val);

    const date = new Date(val);
    if (!isNaN(date.getTime())) {
      setEtDate(gcToEt(date));
    }
  };

  // Get Context
  const data = calculateBahireHasab(etDate.year);
  
  const getLiturgicalContext = () => {
    const feasts = [];
    const fasts = [];
    
    // Movable
    for (const [, f] of Object.entries(data.feasts)) {
      if (f.month === etDate.month && f.day === etDate.day) feasts.push(f.name);
    }
    if (data.nineveh.month === etDate.month && data.nineveh.day === etDate.day) feasts.push(data.nineveh.name);

    // Fixed
    for (const f of fixedFeasts) {
      if (f.month === etDate.month && f.day === etDate.day) feasts.push(f.name);
    }

    // Rough check for Abiy Tsome (Great Lent)
    const abiyStart = data.feasts["ABIY_TSOME"];
    const siklet = data.feasts["SIKLET"];
    const abiyVal = abiyStart.month * 30 + abiyStart.day;
    const sikletVal = siklet.month * 30 + siklet.day;
    const currentVal = etDate.month * 30 + etDate.day;
    
    if (currentVal >= abiyVal && currentVal <= sikletVal) {
      fasts.push("ዐቢይ ጾም (Great Lent)");
    }

    return { feasts, fasts };
  };

  const context = getLiturgicalContext();

  return (
    <div className="max-w-4xl mx-auto space-y-8 w-full">
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tighter">Real-Time Converter</h2>
        <p className="text-[#888] max-w-lg mx-auto text-base md:text-lg">
          Convert between the Gregorian and Ethiopian calendars instantly, while maintaining full liturgical context.
        </p>
      </div>

      <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-7 border border-white/10 rounded-2xl bg-[#050505]">
        
        {/* Ethiopian Input */}
        <div className="flex-1 w-full space-y-5">
          <div className="flex items-center gap-2 text-white pb-3 border-b border-white/10">
            <Calendar className="w-4 h-4 text-[#888]" />
            <h3 className="font-semibold text-base sm:text-lg tracking-tight">Ethiopian Date</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[#888] uppercase tracking-wider mb-2 block">Day</label>
              <input 
                type="number" min="1" max="30" 
                value={etDate.day} onChange={e => handleEtChange('day', Number(e.target.value))}
                className="w-full bg-[#111] border border-white/10 rounded-md px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase tracking-wider mb-2 block">Month</label>
              <select 
                value={etDate.month} onChange={e => handleEtChange('month', Number(e.target.value))}
                className="w-full bg-[#111] border border-white/10 rounded-md px-2 py-2 text-sm text-white text-center focus:outline-none focus:border-white font-ethiopic transition-colors"
              >
                {ethiopianMonths.map((m, i) => (
                  <option key={i+1} value={i+1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase tracking-wider mb-2 block">Year</label>
              <input 
                type="number" 
                value={etDate.year} onChange={e => handleEtChange('year', Number(e.target.value))}
                className="w-full bg-[#111] border border-white/10 rounded-md px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>
          <div className="text-center pt-3">
            <span className="text-white font-ethiopic text-xl md:text-2xl font-bold tracking-tight">
              {etDate.day} {ethiopianMonths[etDate.month - 1]} {etDate.year}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#111] border border-white/10 flex items-center justify-center">
            <ArrowRightLeft className="w-4 h-4 text-[#888]" />
          </div>
        </div>

        {/* Gregorian Input */}
        <div className="flex-1 w-full space-y-5">
          <div className="flex items-center justify-end gap-2 text-white pb-3 border-b border-white/10">
            <h3 className="font-semibold text-base sm:text-lg tracking-tight">Gregorian Date</h3>
            <Calendar className="w-4 h-4 text-[#888]" />
          </div>
          
          <div>
            <label className="text-xs text-[#888] uppercase tracking-wider mb-2 block text-right">Standard Date Picker</label>
            <input 
              type="date" 
              value={gcDate} onChange={e => handleGcChange(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-md px-4 py-2.5 text-white text-center focus:outline-none focus:border-white text-base tracking-widest [color-scheme:dark] transition-colors"
            />
          </div>
          
          <div className="text-center pt-3">
            <span className="text-white text-xl md:text-2xl font-bold tracking-tight">
              {new Date(gcDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Liturgical Context Card */}
      <div className="border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto text-center bg-[#050505]">
        <h3 className="text-xs uppercase tracking-widest text-[#888] font-bold mb-5">Liturgical Context</h3>
        
        {context.feasts.length === 0 && context.fasts.length === 0 ? (
          <div className="text-[#888] py-4">No major feasts or fasts identified for this specific day.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2.5">
            {context.feasts.map((f, i) => (
              <div key={i} className="px-3.5 py-2 bg-white text-black border border-white rounded-md font-ethiopic font-semibold shadow-sm">
                {f}
              </div>
            ))}
            {context.fasts.map((f, i) => (
              <div key={i} className="px-3.5 py-2 bg-[#111] border border-white/10 rounded-md text-[#888] font-ethiopic font-medium">
                {f}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
