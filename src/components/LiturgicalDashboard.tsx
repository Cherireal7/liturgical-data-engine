"use client";

import { useMemo, useState } from "react";
import {
  calculateBahireHasab,
  ethiopianMonths,
  etToGc,
  fixedFeasts,
  gcToEt,
  getEvangelist,
} from "@/engine/bahireHasab";

type DayKind = "feast" | "fast" | "sunday" | "pagume" | "regular";

const dayIndex = (month: number, day: number) => (month - 1) * 30 + day;

function getDayInfo(year: number, month: number, day: number) {
  const data = calculateBahireHasab(year);
  const feasts: string[] = [];
  const value = dayIndex(month, day);
  const abiyStart = dayIndex(data.feasts.ABIY_TSOME.month, data.feasts.ABIY_TSOME.day);
  const siklet = dayIndex(data.feasts.SIKLET.month, data.feasts.SIKLET.day);

  Object.values(data.feasts).forEach((feast) => {
    if (feast.month === month && feast.day === day) feasts.push(feast.nameEn);
  });
  if (data.nineveh.month === month && data.nineveh.day === day) feasts.push(data.nineveh.nameEn);
  fixedFeasts.forEach((feast) => {
    if (feast.month === month && feast.day === day) feasts.push(feast.nameEn);
  });

  const fasts = value >= abiyStart && value <= siklet ? ["Great Lent"] : [];
  const isSunday = etToGc(year, month, day).getDay() === 0;
  let kind: DayKind = "regular";

  if (month === 13) kind = "pagume";
  if (isSunday) kind = "sunday";
  if (fasts.length) kind = "fast";
  if (feasts.length) kind = "feast";

  return { kind, feasts, fasts };
}

function daysInMonth(year: number, month: number) {
  if (month !== 13) return 30;
  return year % 4 === 3 ? 6 : 5;
}

function colorFor(kind: DayKind) {
  switch (kind) {
    case "feast": return "bg-white";
    case "fast": return "bg-white/25";
    case "sunday": return "bg-transparent ring-1 ring-white/35";
    case "pagume": return "bg-white/10";
    default: return "bg-white/[0.08]";
  }
}

function labelFor(kind: DayKind) {
  switch (kind) {
    case "feast": return "Feast";
    case "fast": return "Fast";
    case "sunday": return "Sunday";
    case "pagume": return "Pagume";
    default: return "Ordinary";
  }
}

export default function LiturgicalDashboard() {
  const todayEt = useMemo(() => gcToEt(new Date()), []);
  const [yearA, setYearA] = useState(todayEt.year);
  const [yearB, setYearB] = useState(todayEt.year + 1);
  const [focusedHeatDay, setFocusedHeatDay] = useState({
    month: todayEt.month,
    day: todayEt.day,
  });
  const todayInfo = getDayInfo(todayEt.year, todayEt.month, todayEt.day);
  const todayData = calculateBahireHasab(todayEt.year);
  const focusedHeatInfo = getDayInfo(todayEt.year, focusedHeatDay.month, focusedHeatDay.day);
  const focusedHeatLabel = [
    ...focusedHeatInfo.feasts,
    ...focusedHeatInfo.fasts,
  ][0] ?? labelFor(focusedHeatInfo.kind);
  const compareYears = [yearA, yearB].map((year) => {
    const data = calculateBahireHasab(year);
    return { year, data, evangelist: getEvangelist(year) };
  });
  const relationNodes = [
    { key: "nineveh", label: "Nineveh", value: todayData.nineveh },
    { key: "lent", label: "Great Lent", value: todayData.feasts.ABIY_TSOME },
    { key: "hosanna", label: "Hosanna", value: todayData.feasts.HOSANNA },
    { key: "siklet", label: "Siklet", value: todayData.feasts.SIKLET },
    { key: "fasika", label: "Fasika", value: todayData.feasts.TINSAYE },
  ];

  return (
    <div className="grid w-full gap-4 lg:grid-cols-[1fr_1.25fr]">
      <section className="rounded-lg border border-white/10 bg-black p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Today</h2>
          <span className="text-[11px] text-[#777]">Liturgical spotlight</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md bg-white p-4 text-black">
            <div className="font-ethiopic text-xl font-bold">
              {ethiopianMonths[todayEt.month - 1]} {todayEt.day}
            </div>
            <div className="mt-1 text-xs text-black/60">{todayEt.year} ET</div>
          </div>
          <div className="rounded-md border border-white/10 bg-[#050505] p-4">
            <div className="text-xs text-[#777]">Status</div>
            <div className="mt-1 text-sm font-semibold text-white">
              {[...todayInfo.feasts, ...todayInfo.fasts][0] ?? (todayInfo.kind === "sunday" ? "Sunday" : "Ordinary day")}
            </div>
            <div className="mt-2 text-xs text-[#888]">Evangelist: <span className="font-ethiopic text-white">{getEvangelist(todayEt.year).name}</span></div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-[#888]">
          {[
            ["Feast", "bg-white"],
            ["Fast", "bg-white/25"],
            ["Sunday", "ring-1 ring-white/35"],
            ["Pagume", "bg-white/10"],
          ].map(([label, swatch]) => (
            <span key={label} className="inline-flex items-center gap-2 rounded-md border border-white/10 px-2 py-1">
              <span className={`h-2.5 w-2.5 rounded-sm ${swatch}`} />
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-black p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white">Year Heatmap</h2>
            <p className="mt-0.5 text-[11px] text-[#777]">Hover a mark to inspect the day</p>
          </div>
          <div className="rounded-md border border-white/10 bg-[#050505] px-3 py-2 text-right">
            <div className="font-ethiopic text-xs text-white">
              {ethiopianMonths[focusedHeatDay.month - 1]} {focusedHeatDay.day}
            </div>
            <div className="mt-0.5 max-w-36 truncate text-[11px] text-[#888]">{focusedHeatLabel}</div>
          </div>
        </div>
        <div className="space-y-1.5">
          {ethiopianMonths.map((monthName, monthIndex) => {
            const month = monthIndex + 1;
            return (
              <div key={monthName} className="grid grid-cols-[72px_1fr] items-center gap-3">
                <div className="truncate text-[11px] font-ethiopic text-[#888]">{monthName}</div>
                <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(30, minmax(0, 1fr))" }}>
                  {Array.from({ length: daysInMonth(todayEt.year, month) }, (_, dayIndexValue) => {
                    const day = dayIndexValue + 1;
                    const info = getDayInfo(todayEt.year, month, day);
                    const isToday = todayEt.month === month && todayEt.day === day;
                    return (
                      <button
                        type="button"
                        key={day}
                        onMouseEnter={() => setFocusedHeatDay({ month, day })}
                        onFocus={() => setFocusedHeatDay({ month, day })}
                        onClick={() => setFocusedHeatDay({ month, day })}
                        className={`h-2 rounded-[1px] transition-all hover:h-3 hover:bg-white focus:h-3 focus:bg-white focus:outline-none ${colorFor(info.kind)} ${isToday ? "outline outline-1 outline-offset-1 outline-white" : ""}`}
                        title={`${monthName} ${day}: ${[...info.feasts, ...info.fasts][0] ?? labelFor(info.kind)}`}
                        aria-label={`${monthName} ${day}: ${[...info.feasts, ...info.fasts][0] ?? labelFor(info.kind)}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-black p-4">
        <h2 className="mb-4 text-sm font-bold text-white">Feast Relationship Map</h2>
        <div className="relative flex flex-wrap items-center justify-center gap-2">
          {relationNodes.map((node, index) => (
            <div key={node.key} className="flex items-center gap-2">
              <div className="rounded-md border border-white/10 bg-[#050505] px-3 py-2 text-center">
                <div className="text-xs font-semibold text-white">{node.label}</div>
                <div className="mt-1 text-[11px] font-ethiopic text-[#888]">
                  {ethiopianMonths[node.value.month - 1]} {node.value.day}
                </div>
              </div>
              {index < relationNodes.length - 1 && <div className="h-px w-8 bg-white/25" />}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-black p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Compare Years</h2>
          <div className="flex gap-2">
            <input className="w-20 rounded-md border border-white/10 bg-[#050505] px-2 py-1 text-xs text-white" value={yearA} onChange={(e) => setYearA(Number(e.target.value))} type="number" />
            <input className="w-20 rounded-md border border-white/10 bg-[#050505] px-2 py-1 text-xs text-white" value={yearB} onChange={(e) => setYearB(Number(e.target.value))} type="number" />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {compareYears.map(({ year, data, evangelist }) => (
            <div key={year} className="rounded-md border border-white/10 bg-[#050505] p-3 text-xs">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-bold text-white">{year} ET</span>
                <span className="font-ethiopic text-[#aaa]">{evangelist.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-y-1 text-[#888]">
                <span>Fasika</span><span className="text-right font-ethiopic text-white">{ethiopianMonths[data.feasts.TINSAYE.month - 1]} {data.feasts.TINSAYE.day}</span>
                <span>Nineveh</span><span className="text-right font-ethiopic text-white">{ethiopianMonths[data.nineveh.month - 1]} {data.nineveh.day}</span>
                <span>Metqi</span><span className="text-right text-white">{data.metqi}</span>
                <span>Wenber</span><span className="text-right text-white">{data.wenber}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
