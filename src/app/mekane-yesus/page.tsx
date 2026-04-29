"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { OBSERVANCES, SEASONS, getSeriesForYear, SERIES_NAMES, SERIES_NAMES_AM } from "@/data/eecmy";
import { gcToEt, calculateBahireHasab, ethiopianMonths } from "@/engine/bahireHasab";
import LandingGeometry from "@/components/LandingGeometry";

const GOLD = "#C8943A";

const SUBTABS = [
  { id: "overview", label: "Overview" },
  { id: "explorer", label: "Year Explorer" },
  { id: "library", label: "Observance Library" },
  { id: "algorithm", label: "Algorithm" },
  { id: "comparison", label: "EOTC vs EECMY" },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  white:  { bg: "bg-white/10",       text: "text-white",        border: "border-white/30"      },
  red:    { bg: "bg-red-950/40",      text: "text-red-400",      border: "border-red-700/40"    },
  green:  { bg: "bg-emerald-950/40",  text: "text-emerald-400",  border: "border-emerald-700/40"},
  violet: { bg: "bg-violet-950/40",   text: "text-violet-400",   border: "border-violet-700/40" },
  black:  { bg: "bg-black",           text: "text-gray-400",     border: "border-white/20"      },
  gold:   { bg: "bg-amber-950/40",    text: "text-amber-400",    border: "border-amber-700/40"  },
};

const SEASON_ORDER = ["newyear", "advent", "christmas", "epiphany", "pre_lent", "lent", "holy_week", "easter", "ascension", "pentecost", "trinity", "end_of_year", "fixed_feasts"];

const COMPARISON_ROWS = [
  ["Calendar system",         "Ethiopic 13-month", "Ethiopic 13-month", true ],
  ["Easter computation",      "Bahire Hasab",      "Bahire Hasab",      true ],
  ["Year start (civil)",      "Enkutatash",        "Enkutatash",        true ],
  ["Year start (liturgical)", "Tsome Nebiyat",     "Advent",            false],
  ["Lectionary cycle",        "4-year Evangelist", "4-year Evangelist", true ],
  ["Readings per Sunday",     "Multiple (8+)",     "3 (OT/Ep/Gospel)",  false],
  ["Nineveh fast",            "Yes",               "No",                false],
  ["Tsome Hawaryat",          "Yes",               "No",                false],
  ["Meskel (Sept 27)",        "Yes",               "Yes",               true ],
  ["Gena (Jan 7)",            "Yes",               "Yes",               true ],
  ["Timket (Jan 19)",         "Yes",               "Yes",               true ],
  ["Reformation Day",         "Not observed",      "Oct 31",            false],
  ["Annunciation",            "Megabit 29",        "Megabit 29",        true ],
  ["Transfiguration",         "Nehasse 13",        "Nehasse 13",        true ],
];

export default function MekaneYesusPage() {
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [expandedObs, setExpandedObs] = useState<string | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const todayEt = gcToEt(new Date());
  const currentSeries = getSeriesForYear(todayEt.year);
  const seriesIdx = currentSeries - 1;

  const filteredObs = OBSERVANCES.filter(o => {
    const matchSearch = !search ||
      o.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      o.nameAm.includes(search) ||
      o.theme.toLowerCase().includes(search.toLowerCase());
    const matchSeason = seasonFilter === "all" || o.season === seasonFilter;
    return matchSearch && matchSeason;
  });

  const obsBySeason = SEASON_ORDER.map(sid => ({
    season: SEASONS.find(s => s.id === sid)!,
    obs: filteredObs.filter(o => o.season === sid),
  })).filter(g => g.obs && g.obs.length > 0 && g.season);

  const explorerYears = [2017, 2018, 2019, 2020].map(y => {
    const result = calculateBahireHasab(y);
    const ev = SERIES_NAMES[getSeriesForYear(y) - 1];
    return { year: y, ev, result };
  });

  const algoExample = calculateBahireHasab(2017);

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden flex flex-col">
      <LandingGeometry />

      {/* Shared Header Structure */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-[12px]">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-[#666] hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-md">
              ← Main
            </Link>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="font-ethiopic text-[#C8943A]">የመካነ ኢየሱስ</span>
              <span className="hidden sm:inline text-[#666] font-normal">EECMY Lectionary</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-1">
              {SUBTABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-3 py-1 text-xs font-medium transition-colors rounded-md ${
                    tab === t.id ? "bg-white/10 text-white" : "text-[#666] hover:text-[#aaa]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-[#C8943A]/30 bg-[#C8943A]/5 px-3 py-1.5 text-[10px] font-semibold text-[#C8943A]">
              <span className="font-ethiopic">{SERIES_NAMES_AM[seriesIdx]}</span>
              <span className="text-[#888] font-normal">Year of {SERIES_NAMES[seriesIdx]}</span>
            </div>
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="p-1.5 border border-white/10 rounded-md md:hidden"
            >
              {isMobileNavOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
        {/* Mobile Nav */}
        {isMobileNavOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/95 p-4 flex flex-col gap-2">
            {SUBTABS.map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setIsMobileNavOpen(false); }}
                className={`text-left px-4 py-2 text-sm rounded-md ${tab === t.id ? "bg-white/10 text-white" : "text-[#666]"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1 w-full flex flex-col items-center">
        
        {/* HERO / ORBIT SECTION */}
        {tab === "overview" && (
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col lg:flex-row items-center gap-12 border-b border-white/10">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                Liturgical Orbit of <br/>
                <span className="text-[#C8943A]">Mekane Yesus</span>
              </h2>
              <p className="text-[#888] text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                A dynamic lectionary system rotating through the four Evangelists, 
                harmonizing the Ethiopian calendar with the Lutheran liturgical heritage.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-4">
                  <div className="text-2xl font-bold text-white">77</div>
                  <div className="text-[10px] text-[#666] uppercase tracking-widest mt-1">Observances</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-4">
                  <div className="text-2xl font-bold text-white">4</div>
                  <div className="text-[10px] text-[#666] uppercase tracking-widest mt-1">Evangelists</div>
                </div>
              </div>
            </div>

            {/* ANIMATED ORBIT VISUALIZATION */}
            <div className="relative w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] flex items-center justify-center">
              {/* Decorative Orbits */}
              <div className="absolute inset-0 border border-white/[0.03] rounded-full" />
              <div className="absolute inset-[10%] border border-white/[0.05] rounded-full" />
              <div className="absolute inset-[25%] border border-white/[0.08] rounded-full" />
              <div className="absolute inset-[40%] border border-white/[0.03] rounded-full" />
              
              {/* Rotating Seasons */}
              <motion.div 
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
              >
                {SEASONS.map((s, i) => {
                  const angle = (i / SEASONS.length) * 360;
                  const c = COLOR_MAP[s.color] || COLOR_MAP.white;
                  const isGold = s.color === "gold";
                  return (
                    <div 
                      key={s.id} 
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{ transform: `rotate(${angle}deg) translateY(-220px) rotate(-${angle}deg)` }}
                    >
                      <motion.div 
                        className={`w-2.5 h-2.5 rounded-full ${isGold ? "bg-[#C8943A]" : c.bg.replace('/40','')} shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                      />
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[7px] font-bold text-white/20 uppercase tracking-widest">
                        {s.nameEn}
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Center Evangelist Indicator */}
              <div className="text-center z-10 bg-black/40 backdrop-blur-sm p-8 rounded-full border border-white/5">
                <motion.div 
                  className="text-4xl sm:text-6xl font-ethiopic font-bold text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {SERIES_NAMES_AM[seriesIdx]}
                </motion.div>
                <motion.div 
                  className="text-[9px] text-[#666] uppercase tracking-[0.3em] mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.8 }}
                >
                  Year of {SERIES_NAMES[seriesIdx]}
                </motion.div>
                <div className="mt-4 flex justify-center gap-1">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`w-1 h-1 rounded-full ${i === seriesIdx ? "bg-[#C8943A]" : "bg-white/10"}`} />
                  ))}
                </div>
              </div>

              {/* Orbiting Glow */}
              <motion.div
                className="absolute w-4 h-4 rounded-full bg-white/20 blur-md"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.5, 1],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "250px 250px" }}
              />
            </div>
          </section>
        )}

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">

          {/* OVERVIEW CONTENT */}
          {tab === "overview" && (
            <div className="space-y-20">
              <div className="grid sm:grid-cols-3 gap-8">
                {[
                  { n: "01", title: "Anchored to Fasika", body: "All movable feasts are calculated from Fasika via Bahire Hasab, the same Alexandrian computus shared with the EOTC." },
                  { n: "02", title: "The 4-Year Rotation", body: "Each year features one of the four Gospels (John, Matthew, Mark, Luke) as the primary witness for Sunday readings." },
                  { n: "03", title: "Shared Dates", body: "Fixed feasts like Enkutatash, Meskel, and Gena are observed on the same Ethiopian dates as the broader tradition." },
                ].map(b => (
                  <div key={b.n} className="space-y-4 group">
                    <div className="text-4xl font-bold text-white/5 group-hover:text-[#C8943A]/20 transition-colors duration-500">{b.n}</div>
                    <h3 className="text-lg font-bold text-white">{b.title}</h3>
                    <p className="text-sm text-[#888] leading-relaxed">{b.body}</p>
                  </div>
                ))}
              </div>

              {/* Season Timeline */}
              <div>
                <h3 className="text-sm font-bold text-[#666] uppercase tracking-widest mb-8 text-center">Liturgical Seasons</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2">
                  {SEASONS.map(s => {
                    const c = COLOR_MAP[s.color] || COLOR_MAP.white;
                    return (
                      <div key={s.id} className={`rounded-lg border border-white/10 bg-white/[0.02] p-4 text-center transition-all hover:bg-white/[0.05]`}>
                        <div className={`w-2 h-2 rounded-full mx-auto mb-3 ${c.bg.replace('/40','')}`} />
                        <div className="text-[10px] font-bold text-white uppercase tracking-tighter truncate">{s.nameEn.split(" ")[0]}</div>
                        <div className="text-[9px] text-[#555] mt-1 font-ethiopic">{s.nameAm}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* YEAR EXPLORER */}
          {tab === "explorer" && (
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Liturgical Preview</h2>
                <p className="text-[#888]">Track the shift of major feasts across the 4-year Evangelist cycle.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {explorerYears.map(ey => (
                  <div key={ey.year} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-white/20 transition-colors">
                    <div className="bg-white/[0.04] px-8 py-5 flex justify-between items-center">
                      <div>
                        <div className="text-xl font-bold text-white">ET {ey.year}</div>
                        <div className="text-xs text-[#666]">GC {ey.year + 7}–{ey.year + 8}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#C8943A]">{ey.ev}</div>
                        <div className="text-[10px] text-[#666] uppercase tracking-widest">Evangelist</div>
                      </div>
                    </div>
                    <div className="p-8 space-y-6">
                      {[
                        { l: "Nineveh", v: `${ethiopianMonths[ey.result.nineveh.month-1]} ${ey.result.nineveh.day}` },
                        { l: "Great Lent", v: `${ethiopianMonths[ey.result.feasts.ABIY_TSOME.month-1]} ${ey.result.feasts.ABIY_TSOME.day}` },
                        { l: "Fasika (Easter)", v: `${ethiopianMonths[ey.result.feasts.TINSAYE.month-1]} ${ey.result.feasts.TINSAYE.day}`, highlight: true },
                        { l: "Pentecost", v: `${ethiopianMonths[ey.result.feasts.PARACLETE.month-1]} ${ey.result.feasts.PARACLETE.day}` },
                      ].map(row => (
                        <div key={row.l} className="flex justify-between items-center text-sm">
                          <span className="text-[#666]">{row.l}</span>
                          <span className={`font-ethiopic ${row.highlight ? "text-[#C8943A] font-bold" : "text-white"}`}>{row.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OBSERVANCE LIBRARY */}
          {tab === "library" && (
            <div>
              <div className="flex flex-wrap gap-4 mb-12 items-center justify-between">
                <div className="flex-1 min-w-[300px] relative">
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, theme, or series…"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#C8943A]/40 transition-all"
                  />
                </div>
                <select
                  value={seasonFilter}
                  onChange={e => setSeasonFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white focus:outline-none"
                >
                  <option value="all">All Seasons</option>
                  {SEASONS.map(s => <option key={s.id} value={s.id}>{s.nameEn}</option>)}
                </select>
              </div>
              <div className="space-y-12">
                {obsBySeason.map(({ season, obs }) => {
                  const c = COLOR_MAP[season.color] || COLOR_MAP.white;
                  return (
                    <div key={season.id}>
                      <div className={`inline-flex items-center gap-3 rounded-full border px-5 py-2 text-[10px] font-bold uppercase tracking-widest mb-6 ${c.bg} ${c.text} ${c.border}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{season.nameEn}</span>
                        <span className="opacity-40 font-ethiopic font-normal normal-case">{season.nameAm}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {obs.map(o => {
                          const oc = COLOR_MAP[o.color] || COLOR_MAP.white;
                          const isExpanded = expandedObs === o.id;
                          const reading = o.series[seriesIdx];
                          return (
                            <div key={o.id} className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? "border-white/20 bg-white/[0.06]" : "border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/10"}`}>
                              <button
                                onClick={() => setExpandedObs(isExpanded ? null : o.id)}
                                className="w-full text-left p-6"
                              >
                                <div className="font-ethiopic text-lg font-bold text-white mb-1">{o.nameAm}</div>
                                <div className="text-xs font-semibold text-[#888] mb-4 uppercase tracking-tight">{o.nameEn}</div>
                                <div className="text-[11px] text-[#555] leading-relaxed line-clamp-2 mb-4">{o.theme}</div>
                                <div className="flex items-center gap-3">
                                  <span className={`text-[9px] px-2.5 py-1 rounded-md border font-bold uppercase tracking-tighter ${oc.bg} ${oc.text} ${oc.border}`}>
                                    {o.color}
                                  </span>
                                  {o.hasPrayer && <span className="text-[9px] text-[#444] border border-white/5 px-2 py-1 rounded-md">✓ Prayer</span>}
                                </div>
                              </button>
                              {isExpanded && (
                                <div className="px-6 pb-6 border-t border-white/5 pt-6 space-y-5">
                                  <div>
                                    <div className="text-[10px] text-[#444] uppercase tracking-widest mb-3">Series Readings</div>
                                    <div className="space-y-2">
                                      {reading.ot && <div className="text-xs flex gap-4"><span className="text-[#555] w-8">OT</span><span className="text-white font-mono">{reading.ot}</span></div>}
                                      {reading.epistle && <div className="text-xs flex gap-4"><span className="text-[#555] w-8">EP</span><span className="text-white font-mono">{reading.epistle}</span></div>}
                                      <div className="text-xs flex gap-4"><span className="text-[#555] w-8">GS</span><span className="text-white font-mono">{reading.gospel}</span></div>
                                    </div>
                                  </div>
                                  {o.hasPrayer && (o.prayerEn || o.prayerAm) && (
                                    <div className="border-t border-white/5 pt-5 space-y-4">
                                      <div className="text-[10px] text-[#444] uppercase tracking-widest">Prayer / Collect</div>
                                      {o.prayerAm && <div className="text-xs text-white leading-relaxed font-ethiopic" style={{ color: `${GOLD}bb` }}>{o.prayerAm}</div>}
                                      {o.prayerEn && <div className="text-[10px] text-[#666] leading-relaxed italic">{o.prayerEn}</div>}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ALGORITHM */}
          {tab === "algorithm" && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">Bahire Hasab Logic</h2>
                <p className="text-[#888]">The step-by-step trace of the Alexandrian computus for ET {algoExample.ameteAlem - 5500}.</p>
              </div>
              <div className="space-y-12">
                {[
                  { title: "Medeb", val: algoExample.medeb, body: "Year of the world (Amete Alem) mod 19. Represents the position in the Metonic cycle." },
                  { title: "Wenber", val: algoExample.wenber, body: "Adjusted medeb for solar-lunar alignment. medeb - 1." },
                  { title: "Abektie", val: algoExample.abektie, body: "Lunar epact. Determines the number of days since the last new moon." },
                  { title: "Metqi", val: algoExample.metqi, body: "The marker for the ecclesiastical new moon used to anchor all movable feasts." },
                  { title: "Tewsak", val: algoExample.tewsak, body: "Weekday offset required to align the fast of Nineveh with a Monday." },
                ].map((step, i) => (
                  <div key={step.title} className="flex gap-12 items-center group">
                    <div className="w-24 h-24 shrink-0 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-4xl font-bold text-[#C8943A] group-hover:bg-[#C8943A]/10 transition-colors duration-500">
                      {step.val}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#444] uppercase tracking-widest mb-1">Step 0{i+1}</div>
                      <div className="text-lg font-bold text-white mb-2">{step.title}</div>
                      <div className="text-sm text-[#888] leading-relaxed">{step.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMPARISON */}
          {tab === "comparison" && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">Tradition Alignment</h2>
                <p className="text-[#888]">Comparing the liturgical structures of EOTC and EECMY Mekane Yesus.</p>
              </div>
              <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.01]">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_60px] border-b border-white/10 bg-white/[0.04]">
                  <div className="px-6 py-4 text-xs font-bold text-[#666] uppercase tracking-widest">Dimension</div>
                  <div className="px-6 py-4 text-xs font-bold text-[#666] uppercase tracking-widest">EOTC</div>
                  <div className="px-6 py-4 text-xs font-bold text-[#666] uppercase tracking-widest">EECMY</div>
                  <div className="px-6 py-4 text-xs font-bold text-[#666] uppercase tracking-widest text-center">Match</div>
                </div>
                {COMPARISON_ROWS.map(([feature, eotc, eecmy, same]) => (
                  <div key={String(feature)} className="grid grid-cols-[1.5fr_1fr_1fr_60px] border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors">
                    <div className="px-6 py-5 text-sm text-[#aaa] font-medium">{feature}</div>
                    <div className="px-6 py-5 text-sm text-white">{eotc}</div>
                    <div className="px-6 py-5 text-sm text-white">{eecmy}</div>
                    <div className="px-6 py-5 flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${same ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-white/10"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Shared Footer Structure */}
      <footer className="relative z-10 w-full border-t border-white/10 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-[#555] text-xs">
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <div className="flex items-center gap-2 text-[#888]">
              <span className="font-ethiopic text-[#C8943A]">የመካነ ኢየሱስ</span>
              <span className="font-bold">EECMY Lectionary Engine</span>
            </div>
            <span>© 2026 Liturgical Data Engine. Built for the Ethiopian Lutheran Communion.</span>
          </div>
          <div className="flex gap-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/documentation" className="hover:text-white transition-colors">Documentation</Link>
            <a href="https://github.com/ethiopian-lutheran" target="_blank" className="hover:text-white transition-colors">Source</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
