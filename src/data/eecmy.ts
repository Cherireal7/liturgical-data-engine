// EECMY Mekane Yesus Lectionary — data engine
// Source: github.com/lukasknuth/ethiopian-lutheran (MIT)
// Book: Yemisrach Dimts Publishing, EECMY 2008

import eecmyData from "./eecmy.json";

export type LitColor = "white" | "red" | "green" | "violet" | "black" | "gold";

export interface Reading {
  ot?: string;
  epistle?: string;
  gospel: string;
}

export interface Observance {
  id: string;
  nameEn: string;
  nameAm: string;
  season: string;
  theme: string;
  color: LitColor;
  series: [Reading, Reading, Reading, Reading]; // Matthew, Mark, Luke, John
  hasPrayer: boolean;
  prayerEn?: string;
  prayerAm?: string;
}

export interface SeasonMeta {
  id: string;
  nameEn: string;
  nameAm: string;
  color: LitColor;
  order: number;
}

const COLOR_CODE_MAP: Record<string, LitColor> = {
  w: "white",
  r: "red",
  g: "green",
  p: "violet",
  b: "black",
  y: "gold",
};

export const SEASONS: SeasonMeta[] = [
  { id: "newyear",    nameEn: "New Year & Civil Feasts", nameAm: "አዲስ ዓመት",    color: "gold",   order: 0 },
  { id: "advent",     nameEn: "Advent",                  nameAm: "የምጽዓት",       color: "violet", order: 1 },
  { id: "christmas",  nameEn: "Christmas",               nameAm: "የገና",          color: "white",  order: 2 },
  { id: "epiphany",   nameEn: "Epiphany",                nameAm: "የጥምቀት",       color: "white",  order: 3 },
  { id: "pre_lent",   nameEn: "Pre-Lent",                nameAm: "ቅድመ-ጾም",      color: "violet", order: 4 },
  { id: "lent",       nameEn: "Lent",                    nameAm: "ዐቢይ ጾም",      color: "violet", order: 5 },
  { id: "holy_week",  nameEn: "Holy Week",               nameAm: "ቅዱስ ሳምንት",   color: "red",    order: 6 },
  { id: "easter",     nameEn: "Easter",                  nameAm: "ትንሣኤ",          color: "white",  order: 7 },
  { id: "ascension",  nameEn: "Ascension",               nameAm: "ዕርገት",         color: "white",  order: 8 },
  { id: "pentecost",  nameEn: "Pentecost",               nameAm: "ጰራቅሊጦስ",      color: "red",    order: 9 },
  { id: "trinity",    nameEn: "Trinity Season",          nameAm: "ሥላሴ",          color: "green",  order: 10 },
  { id: "end_of_year",nameEn: "End of Year",             nameAm: "ዓመት መጨረሻ",   color: "violet", order: 11 },
  { id: "fixed_feasts",nameEn: "Fixed Feasts",            nameAm: "ቋሚ በዓላት",    color: "white",  order: 12 },
];

// Helper to find season ID for an observance
function getSeasonForObs(obsId: string): string {
  for (const [seasonId, obsIds] of Object.entries(eecmyData.seasons)) {
    if ((obsIds as string[]).includes(obsId)) return seasonId;
  }
  return "fixed_feasts";
}

// Map the raw JSON data to our Observance interface
export const OBSERVANCES: Observance[] = Object.entries(eecmyData.observances).map(([id, data]: [string, any]) => {
  const eng = eecmyData.i18n.eng as unknown as {
    holidays: Record<string, string>;
    themes: Record<string, string>;
    prayers: Record<string, string>;
  };
  const amh = eecmyData.i18n.amh as unknown as {
    holidays: Record<string, string>;
    prayers: Record<string, string>;
  };
  return {
    id,
    nameEn: eng.holidays[id] || id,
    nameAm: amh.holidays[id] || id,
    season: getSeasonForObs(id),
    theme: eng.themes[id] || "",
    color: COLOR_CODE_MAP[data.color] || "white",
    hasPrayer: data.hasPrayer,
    prayerEn: eng.prayers[id],
    prayerAm: amh.prayers[id],
    series: data.readings.map((r: string[]) => ({
      ot: r[0],
      epistle: r[1],
      gospel: r[2],
    })) as [Reading, Reading, Reading, Reading],
  };
});

// Year-to-series mapping (Series 1=Matthew, 2=Mark, 3=Luke, 4=John)
// Series changes at Advent, not Enkutatash
export function getSeriesForYear(etYear: number): number {
  const ameteAlem = etYear + 5500;
  return ((ameteAlem - 1) % 4) + 1;
}

export const SERIES_NAMES = ["Matthew", "Mark", "Luke", "John"];
export const SERIES_NAMES_AM = ["ማቴዎስ", "ማርቆስ", "ሉቃስ", "ዮሐንስ"];

// ET years covered by the lectionary
export const LECTIONARY_YEARS = eecmyData.metadata.years_available.map(Number);

export const OPEN_ISSUES = [
  {
    id: 2,
    status: "resolved" as const,
    title: "Martyrs color field",
    problem: "The `color` field for the martyrs entry contained the readings string instead of a color code.",
    resolution: "Fixed in repository commit (April 2026). Now correctly shows \"r\" (red — for martyrs).",
  },
  {
    id: 3,
    status: "resolved" as const,
    title: "Messenger observance identity",
    problem: "The `messenger` observance had empty name, theme, and prayer in both English and Amharic.",
    resolution: "Identified as the Annunciation from readings (Luke 1:26-50, Isaiah 7:10-14). Renamed to `annunciation`. Full data added in English and Amharic.",
  },
  {
    id: 4,
    status: "resolved" as const,
    title: "Martyrs missing 4th series",
    problem: "The martyrs entry only had 3 of 4 Evangelist series defined.",
    resolution: "4th series readings added in repository update.",
  },
  {
    id: 5,
    status: "clarified" as const,
    title: "Last Sunday precedence over Trinity",
    problem: "When does the Last Sunday of the Year take precedence over the nth Sunday after Trinity?",
    resolution: "Lukas: \"Judgment Sundays are never skipped. When New Year falls on a Sunday, potentially two Trinity Sundays are skipped.\" The judgment-1, judgment, and last Sundays form an immovable block. Trinity sequence truncates.",
  },
  {
    id: 6,
    status: "clarified" as const,
    title: "Pre-Lent Sunday count (2 or 3?)",
    problem: "3 pre-Lent Sundays or only 2?",
    resolution: "Lukas: \"There should always be 3 Sundays before Lent. What is shortened are the Sundays after Epiphany.\" Pre-Lent is always 3 (Septuagesima, Sexagesima, Quinquagesima).",
  },
  {
    id: 7,
    status: "resolved" as const,
    title: "Year file generation script",
    problem: "No script provided for generating year files beyond ET 2025.",
    resolution: "Lukas provided `script/calendar.js` (200 lines). Year files now extend to ET 2030 with configurable options: lastSunday, thirdBeforeLent, reformationSunday, newyearSunday, wrapSeries, additional.",
  },
  {
    id: 8,
    status: "clarified" as const,
    title: "Series boundary: Advent vs Enkutatash",
    problem: "Should the Evangelist series change at Advent or at Enkutatash?",
    resolution: "Decision: Series changes at Advent. Even though printed Yemisrach Dimts calendars historically restarted at Enkutatash, this is liturgically incorrect. The script supports both via the `wrapSeries` option.",
  },
  {
    id: 9,
    status: "open" as const,
    title: "Daily verse data (Ato Abebe)",
    problem: "Ato Abebe maintained the printed Yemisrach Dimts calendar for many years, assigning a verse for every day of the year. He retired in 2025. The per-day data is currently lost / not digitized.",
    resolution: "Workaround: Sunday readings apply to all subsequent weekdays in the EECMY devotional pattern. The app displays the nearest preceding Sunday's lections on weekdays.",
  },
  {
    id: 10,
    status: "clarified" as const,
    title: "Reformation Day — always observed?",
    problem: "Is Reformation Day (Oct 31) always observed or only when it falls on a Sunday?",
    resolution: "Lukas: \"Reformation day keeps changing. It was definitely there when it fell on a Sunday.\" Implementation: always include in data structure; display layer can de-emphasize on non-Sundays. Configurable via `reformationSunday` option.",
  },
];
