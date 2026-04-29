"use client";

import { useMemo } from "react";
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
  const todayInfo = getDayInfo(todayEt.year, todayEt.month, todayEt.day);
  const todayData = calculateBahireHasab(todayEt.year);
  const relationNodes = [
    { key: "nineveh", label: "Nineveh", value: todayData.nineveh },
    { key: "lent", label: "Great Lent", value: todayData.feasts.ABIY_TSOME },
    { key: "hosanna", label: "Hosanna", value: todayData.feasts.HOSANNA },
    { key: "siklet", label: "Siklet", value: todayData.feasts.SIKLET },
    { key: "fasika", label: "Fasika", value: todayData.feasts.TINSAYE },
  ];

  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {/* Today spotlight */}
      <section className="rounded-lg border border-white/10 bg-black p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Today</h2>
          <span className="text-[11px] text-[#777]">Liturgical spotlight</span>
        </div>
        <div className="grid gap-3 grid-cols-2">
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

      {/* Feast chain */}
      <section className="rounded-lg border border-white/10 bg-black p-4">
        <h2 className="mb-4 text-sm font-bold text-white">Movable Feast Chain</h2>
        <div className="flex flex-col gap-2">
          {relationNodes.map((node, index) => (
            <div key={node.key} className="flex items-center gap-2">
              <div className="flex-1 rounded-md border border-white/10 bg-[#050505] px-3 py-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{node.label}</span>
                <span className="text-[11px] font-ethiopic text-[#888]">
                  {ethiopianMonths[node.value.month - 1]} {node.value.day}
                </span>
              </div>
              {index < relationNodes.length - 1 && (
                <div className="w-px h-4 bg-white/15 mx-auto" />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
