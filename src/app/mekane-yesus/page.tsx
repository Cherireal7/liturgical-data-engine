"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { OBSERVANCES, SEASONS, getSeriesForYear, SERIES_NAMES, SERIES_NAMES_AM } from "@/data/eecmy";
import { gcToEt, calculateBahireHasab, ethiopianMonths } from "@/engine/bahireHasab";
import MekaneGeometry from "@/components/MekaneGeometry";
import ThemeToggle from "@/components/ThemeToggle";

const SEASON_COLORS: Record<string, { hex: string; bg: string; text: string; border: string; glow: string }> = {
  gold:   { hex: "#C8943A", bg: "bg-amber-950/60",    text: "text-amber-300",    border: "border-amber-700/40",   glow: "shadow-amber-900/40"   },
  violet: { hex: "#7C3AED", bg: "bg-violet-950/60",   text: "text-violet-300",   border: "border-violet-700/40",  glow: "shadow-violet-900/40"  },
  white:  { hex: "#FFFFFF", bg: "bg-white/10",         text: "text-white",        border: "border-white/30",       glow: "shadow-white/10"       },
  red:    { hex: "#DC2626", bg: "bg-red-950/60",       text: "text-red-300",      border: "border-red-700/40",     glow: "shadow-red-900/40"     },
  green:  { hex: "#059669", bg: "bg-emerald-950/60",   text: "text-emerald-300",  border: "border-emerald-700/40", glow: "shadow-emerald-900/40" },
  black:  { hex: "#6B7280", bg: "bg-gray-900/60",      text: "text-gray-400",     border: "border-gray-700/40",    glow: "shadow-gray-900/40"    },
};

const SEASON_ORDER = ["newyear","advent","christmas","epiphany","pre_lent","lent","holy_week","easter","ascension","pentecost","trinity","end_of_year","fixed_feasts"];

const COMPARISON_ROWS = [
  ["Calendar system","Ethiopic 13-month","Ethiopic 13-month",true],
  ["Easter computation","Bahire Hasab","Bahire Hasab",true],
  ["Year start (civil)","Enkutatash","Enkutatash",true],
  ["Year start (liturgical)","Tsome Nebiyat","Advent",false],
  ["Lectionary cycle","4-year Evangelist","4-year Evangelist",true],
  ["Readings per Sunday","Multiple (8+)","3 (OT/Ep/Gospel)",false],
  ["Nineveh fast","Yes","No",false],
  ["Tsome Hawaryat","Yes","No",false],
  ["Meskel (Sept 27)","Yes","Yes",true],
  ["Gena (Jan 7)","Yes","Yes",true],
  ["Timket (Jan 19)","Yes","Yes",true],
  ["Reformation Day","Not observed","Oct 31",false],
  ["Annunciation","Megabit 29","Megabit 29",true],
  ["Transfiguration","Nehasse 13","Nehasse 13",true],
];

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "explorer", label: "Year Explorer" },
  { id: "library",  label: "Observance Library" },
  { id: "algorithm",label: "Algorithm" },
  { id: "comparison",label: "EOTC vs EECMY" },
];

export default function MekaneYesusPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedObs, setExpandedObs] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("all");

  const todayEt = gcToEt(new Date());
  const currentSeries = getSeriesForYear(todayEt.year);
  const si = currentSeries - 1;

  const filteredObs = OBSERVANCES.filter(o => {
    const ms = !search || o.nameEn.toLowerCase().includes(search.toLowerCase()) || o.nameAm.includes(search) || o.theme.toLowerCase().includes(search.toLowerCase());
    return ms && (seasonFilter === "all" || o.season === seasonFilter);
  });

  const obsBySeason = SEASON_ORDER.map(sid => ({
    season: SEASONS.find(s => s.id === sid)!,
    obs: filteredObs.filter(o => o.season === sid),
  })).filter(g => g.season && g.obs.length > 0);

  const explorerYears = [2017, 2018, 2019, 2020].map(y => ({
    year: y, ev: SERIES_NAMES[getSeriesForYear(y) - 1], result: calculateBahireHasab(y),
  }));

  const algo = calculateBahireHasab(2017);

  function sc(color: string) {
    return SEASON_COLORS[color] || SEASON_COLORS.white;
  }

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden flex flex-col">
      <MekaneGeometry />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-[#666] hover:text-white border border-white/10 px-3 py-1.5 rounded-md transition-colors">Home</Link>
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-amber-400 font-ethiopic">የመካነ ኢየሱስ</span>
              <span className="hidden sm:inline text-[#666] font-normal text-xs">EECMY Lectionary</span>
            </span>
          </div>
          <nav className="hidden md:flex gap-2">
            {SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`} className="text-xs text-[#666] hover:text-white px-3 py-1 rounded-md hover:bg-white/5 transition-colors">{s.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-amber-700/30 bg-amber-950/30 px-3 py-1.5 text-[10px]">
              <span className="text-amber-300 font-ethiopic">{SERIES_NAMES_AM[si]}</span>
              <span className="text-[#666]">Year of {SERIES_NAMES[si]}</span>
            </div>
            <ThemeToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 border border-white/10 rounded-md md:hidden">
              {mobileOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
          </div>
        </div>
        {/* Mobile overlay menu — fixed, does not push content */}
        {mobileOpen && (
          <div className="fixed inset-0 top-14 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
            <div className="absolute top-0 right-0 w-64 bg-black/98 border-l border-white/10 h-full p-6 flex flex-col gap-3" onClick={e => e.stopPropagation()}>
              <Link href="/" onClick={() => setMobileOpen(false)} className="text-sm text-[#888] px-4 py-2 rounded-md hover:bg-white/5">Home</Link>
              {SECTIONS.map(s => (
                <a key={s.id} href={`#${s.id}`} onClick={() => setMobileOpen(false)} className="text-sm text-[#888] px-4 py-2 rounded-md hover:bg-white/5">{s.label}</a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1">

        {/* ── HERO + ORBIT ── */}
        <section id="overview" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col lg:flex-row items-center gap-16 border-b border-white/10">
          <div className="flex-1 space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white leading-tight">
              The Liturgical<br/><span className="text-amber-400">Orbit</span> of<br/>Mekane Yesus
            </h1>
            <p className="text-[#888] text-lg max-w-md leading-relaxed">
              A four-year rotation of Evangelists anchored to Fasika, harmonizing the Ethiopian calendar with Lutheran liturgical heritage.
            </p>
            <div className="flex flex-wrap gap-3">
              {SECTIONS.map(s => (
                <a key={s.id} href={`#${s.id}`} className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-[#aaa] hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all">
                  {s.label} →
                </a>
              ))}
            </div>
          </div>

          {/* ORBIT */}
          <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] flex-shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/5" />
            <div className="absolute inset-[12%] rounded-full border border-white/[0.07]" />
            <div className="absolute inset-[28%] rounded-full border border-amber-700/10" />

            {/* Dots rotate, labels counter-rotate to stay upright */}
            <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 160, repeat: Infinity, ease: "linear" }}>
              {SEASONS.map((s, i) => {
                const angle = (i / SEASONS.length) * 360;
                const c = sc(s.color);
                const labelFlip = angle > 90 && angle < 270 ? 180 : 0;
                return (
                  <div key={s.id} className="absolute left-1/2 top-1/2"
                    style={{ transform: `rotate(${angle}deg) translateY(-195px)` }}>
                    <motion.div className="w-3 h-3 rounded-full mx-auto"
                      style={{ backgroundColor: c.hex, boxShadow: `0 0 10px ${c.hex}88` }}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 3, delay: i * 0.25, repeat: Infinity }}
                    />
                    <div style={{ transform: `rotate(${-angle + labelFlip}deg)` }} className="mt-2 text-center">
                      <div className="text-[9px] font-bold whitespace-nowrap uppercase tracking-wide" style={{ color: c.hex }}>
                        {s.nameEn.replace(" Season","").replace(" & Civil Feasts","").replace(" Week","")}
                      </div>
                      <div className="text-[8px] font-ethiopic whitespace-nowrap mt-0.5" style={{ color: c.hex, opacity: 0.7 }}>{s.nameAm}</div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            <motion.div className="absolute inset-[28%] rounded-full border border-amber-700/20"
              animate={{ rotate: -360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400" style={{ boxShadow: "0 0 8px #C8943A" }} />
            </motion.div>

            <div className="text-center z-10 px-4">
              <div className="text-5xl font-ethiopic font-bold text-white mb-2">{SERIES_NAMES_AM[si]}</div>
              <div className="text-xs text-[#666] uppercase tracking-[0.25em]">Year of {SERIES_NAMES[si]}</div>
              <div className="flex justify-center gap-1.5 mt-4">
                {[0,1,2,3].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors" style={{ backgroundColor: i === si ? "#C8943A" : "#333" }} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── YEAR EXPLORER ── */}
        <section id="explorer" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 border-b border-white/10">
          <div className="mb-12">
            <div className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-3">Year Explorer</div>
            <h2 className="text-4xl font-bold text-white">4-Year Liturgical Preview</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {explorerYears.map(ey => {
              const isActive = ey.year === (getSeriesForYear(todayEt.year) === getSeriesForYear(ey.year) ? ey.year : -1);
              return (
                <div key={ey.year} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-amber-700/30 transition-all group">
                  <div className="bg-white/[0.04] px-8 py-5 flex justify-between items-center border-b border-white/10">
                    <div>
                      <div className="text-2xl font-bold text-white">ET {ey.year}</div>
                      <div className="text-xs text-[#555]">GC {ey.year + 7}–{ey.year + 8}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-amber-400">{ey.ev}</div>
                      <div className="text-[10px] text-[#555] uppercase tracking-widest">Evangelist</div>
                    </div>
                  </div>
                  <div className="p-8 space-y-5">
                    {[
                      { l: "Nineveh (Anchor)", v: `${ethiopianMonths[ey.result.nineveh.month-1]} ${ey.result.nineveh.day}` },
                      { l: "Great Lent",       v: `${ethiopianMonths[ey.result.feasts.ABIY_TSOME.month-1]} ${ey.result.feasts.ABIY_TSOME.day}` },
                      { l: "Fasika (Easter)",  v: `${ethiopianMonths[ey.result.feasts.TINSAYE.month-1]} ${ey.result.feasts.TINSAYE.day}`, hi: true },
                      { l: "Pentecost",        v: `${ethiopianMonths[ey.result.feasts.PARACLETE.month-1]} ${ey.result.feasts.PARACLETE.day}` },
                    ].map(row => (
                      <div key={row.l} className="flex justify-between items-center">
                        <span className="text-sm text-[#666]">{row.l}</span>
                        <span className={`font-ethiopic text-sm font-semibold ${row.hi ? "text-amber-400" : "text-white"}`}>{row.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── OBSERVANCE LIBRARY ── */}
        <section id="library" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 border-b border-white/10">
          <div className="mb-12">
            <div className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-3">Observance Library</div>
            <h2 className="text-4xl font-bold text-white">All 77 Observances</h2>
          </div>
          <div className="flex flex-wrap gap-4 mb-12">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search observances…"
              className="flex-1 min-w-[240px] rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-amber-700/40 transition-all" />
            <select value={seasonFilter} onChange={e => setSeasonFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white focus:outline-none">
              <option value="all">All Seasons</option>
              {SEASONS.map(s => <option key={s.id} value={s.id}>{s.nameEn}</option>)}
            </select>
          </div>
          <div className="space-y-14">
            {obsBySeason.map(({ season, obs }) => {
              const c = sc(season.color);
              return (
                <div key={season.id}>
                  <div className={`inline-flex items-center gap-3 rounded-full border px-5 py-2 text-[10px] font-bold uppercase tracking-widest mb-6 ${c.bg} ${c.text} ${c.border}`}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.hex }} />
                    {season.nameEn}
                    <span className="font-ethiopic font-normal normal-case opacity-60">{season.nameAm}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {obs.map(o => {
                      const oc = sc(o.color);
                      const isExp = expandedObs === o.id;
                      const reading = o.series[si];
                      return (
                        <div key={o.id} className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isExp ? `${oc.border} bg-white/[0.06]` : "border-white/5 bg-white/[0.01] hover:border-white/10"}`}>
                          <button onClick={() => setExpandedObs(isExp ? null : o.id)} className="w-full text-left p-6">
                            <div className="font-ethiopic text-lg font-bold text-white mb-1">{o.nameAm}</div>
                            <div className={`text-xs font-bold uppercase tracking-tight mb-3 ${oc.text}`}>{o.nameEn}</div>
                            <div className="text-[11px] text-[#555] leading-relaxed line-clamp-2 mb-4">{o.theme}</div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] px-2.5 py-1 rounded-md border font-bold uppercase ${oc.bg} ${oc.text} ${oc.border}`}>{o.color}</span>
                              {o.hasPrayer && <span className="text-[9px] text-[#444] border border-white/5 px-2 py-1 rounded-md">✓ Prayer</span>}
                            </div>
                          </button>
                          {isExp && (
                            <div className="px-6 pb-6 border-t border-white/5 pt-5 space-y-4">
                              <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2">Series {currentSeries} — {SERIES_NAMES[si]}</div>
                              {reading.ot && <div className="text-xs flex gap-4"><span className="text-[#555] w-6">OT</span><span className="text-white font-mono">{reading.ot}</span></div>}
                              {reading.epistle && <div className="text-xs flex gap-4"><span className="text-[#555] w-6">EP</span><span className="text-white font-mono">{reading.epistle}</span></div>}
                              <div className="text-xs flex gap-4"><span className="text-[#555] w-6">GS</span><span className="text-white font-mono">{reading.gospel}</span></div>
                              {o.hasPrayer && o.prayerEn && (
                                <div className="border-t border-white/5 pt-4">
                                  <div className="text-[10px] text-[#444] uppercase tracking-widest mb-2">Prayer</div>
                                  {o.prayerAm && <div className="text-xs font-ethiopic leading-relaxed mb-2" style={{ color: `${oc.hex}cc` }}>{o.prayerAm}</div>}
                                  <div className="text-[10px] text-[#666] leading-relaxed italic">{o.prayerEn}</div>
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
        </section>

        {/* ── ALGORITHM ── */}
        <section id="algorithm" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-20 border-b border-white/10">
          <div className="mb-16">
            <div className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-3">Algorithm</div>
            <h2 className="text-4xl font-bold text-white">Bahire Hasab Logic</h2>
            <p className="text-[#888] mt-4">Step-by-step trace for ET {algo.ameteAlem - 5500}.</p>
          </div>
          <div className="space-y-10">
            {[
              { n:"01", t:"Medeb",   v: algo.medeb,   d:"Position in the 19-year Metonic cycle." },
              { n:"02", t:"Wenber",  v: algo.wenber,  d:"Adjusted lunar base. medeb − 1." },
              { n:"03", t:"Abektie", v: algo.abektie, d:"Lunar epact constant. (wenber × 11) % 30." },
              { n:"04", t:"Metqi",   v: algo.metqi,   d:"Ecclesiastical new moon anchor. (wenber × 19) % 30." },
              { n:"05", t:"Tewsak", v: algo.tewsak,  d:"Weekday offset to align Nineveh with Monday." },
            ].map(step => (
              <div key={step.t} className="flex gap-8 items-center">
                <div className="w-20 h-20 shrink-0 rounded-2xl border border-amber-700/30 bg-amber-950/20 flex items-center justify-center text-3xl font-bold text-amber-400">{step.v}</div>
                <div>
                  <div className="text-[10px] text-[#444] uppercase tracking-widest mb-1">Step {step.n}</div>
                  <div className="text-xl font-bold text-white mb-1">{step.t}</div>
                  <div className="text-sm text-[#888]">{step.d}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-8 rounded-2xl border border-amber-700/20 bg-amber-950/10">
            <h3 className="font-bold text-white mb-2">Result</h3>
            <p className="text-sm text-[#888]">
              For ET 2017, the anchor falls on <span className="text-white font-ethiopic">{ethiopianMonths[algo.nineveh.month-1]} {algo.nineveh.day}</span>.
              Every movable feast follows as a fixed offset from this date — Fasika is always Nineveh + 69 days.
            </p>
          </div>
        </section>

        {/* ── COMPARISON ── */}
        <section id="comparison" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="mb-12">
            <div className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-3">Comparison</div>
            <h2 className="text-4xl font-bold text-white">EOTC vs EECMY</h2>
            <p className="text-[#888] mt-4">Both share the Bahire Hasab computation — Easter dates align exactly.</p>
          </div>
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.01]">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_52px] bg-white/[0.04] border-b border-white/10">
              {["Dimension","EOTC","EECMY",""].map(h => (
                <div key={h} className="px-6 py-4 text-[10px] font-bold text-[#555] uppercase tracking-widest">{h}</div>
              ))}
            </div>
            {COMPARISON_ROWS.map(([feature, eotc, eecmy, same]) => (
              <div key={String(feature)} className="grid grid-cols-[1.5fr_1fr_1fr_52px] border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                <div className="px-6 py-5 text-sm text-[#aaa] font-medium">{feature}</div>
                <div className="px-6 py-5 text-sm text-white">{eotc}</div>
                <div className="px-6 py-5 text-sm text-white">{eecmy}</div>
                <div className="px-6 py-5 flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full ${same ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-white/10"}`} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 w-full border-t border-white/10 py-10 px-4 sm:px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5 text-[#888] text-sm">
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            <span>© 2026 Ethiopian Lutheran Liturgical System (LCE, EECMY, EELC)</span>
            <span>Open source, built in collaboration with Cherinet and Lukas.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/documentation" className="hover:text-white transition-colors">Documentation</Link>
            <a href="/#trace" className="hover:text-white transition-colors">Bahire Hasab</a>
            <a href="/#converter" className="hover:text-white transition-colors">Converter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
