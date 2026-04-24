import { EthDateTime } from 'ethiopian-calendar-date-converter';

// Core Bahire Hasab calculation constants and interfaces
export interface FeastDate {
  month: number;
  day: number;
  name: string;
  nameEn: string;
}

export interface BahireHasabResult {
  ameteAlem: number;
  medeb: number;
  wenber: number;
  abektie: number;
  metqi: number;
  bealeMetqiMonth: number;
  tewsak: number;
  mebajaHamer: number;
  nineveh: FeastDate;
  feasts: Record<string, FeastDate>;
}

const tewsakMap: Record<string, number> = {
  Sunday: 7,
  Monday: 6,
  Tuesday: 5,
  Wednesday: 4,
  Thursday: 3,
  Friday: 2,
  Saturday: 8,
};

const movableHolidayTewsak = {
  NINEVEH: 0,
  ABIY_TSOME: 14,
  DEBRE_ZEIT: 41,
  HOSANNA: 62,
  SIKLET: 67,
  TINSAYE: 69,
  RIKBE_KAHNAT: 93,
  ERGET: 108,
  PARACLETE: 118,
  TSOME_HAWARYAT: 119,
  TSOME_DIHENET: 121,
};

// Ethiopian Months (1-13)
export const ethiopianMonths = [
  "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት",
  "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
];

const ethiopianMonthsEn = [
  "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit",
  "Megabit", "Miyazya", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume"
];

// Evangelists
export const evangelists = [
  { name: "ዮሐንስ", nameEn: "John" },
  { name: "ማቴዎስ", nameEn: "Matthew" },
  { name: "ማርቆስ", nameEn: "Mark" },
  { name: "ሉቃስ", nameEn: "Luke" }
];

export function getEvangelist(ethiopianYear: number) {
  const ameteAlem = ethiopianYear + 5500;
  return evangelists[ameteAlem % 4];
}

// Fixed Feasts
export const fixedFeasts = [
  { month: 1, day: 1, name: "እንቁጣጣሽ", nameEn: "Enkutatash" },
  { month: 1, day: 17, name: "መስቀል", nameEn: "Meskel" },
  { month: 4, day: 29, name: "ገና", nameEn: "Gena/Christmas" },
  { month: 5, day: 11, name: "ጥምቀት", nameEn: "Timket" },
];

export const fixedFasts = [
  { key: "tsomeNebiyat", start: { month: 3, day: 15 }, end: { month: 4, day: 28 }, name: "ጾመ ነቢያት", nameEn: "Prophets' Fast" },
  { key: "filseta", start: { month: 12, day: 1 }, end: { month: 12, day: 14 }, name: "ጾመ ፍልሰታ", nameEn: "Fast of Assumption" },
];

function addDaysToEthiopianDate(month: number, day: number, daysToAdd: number): FeastDate {
  let totalDays = day + daysToAdd;
  let currentMonth = month;

  while (totalDays > 30) {
    totalDays -= 30;
    currentMonth += 1;
    if (currentMonth > 13) {
      currentMonth -= 13;
    }
  }

  return { month: currentMonth, day: totalDays, name: "", nameEn: "" };
}

export function calculateBahireHasab(ethiopianYear: number): BahireHasabResult {
  const ameteAlem = ethiopianYear + 5500;
  const medeb = ameteAlem % 19;
  const wenber = medeb === 0 ? 18 : medeb - 1;
  const abektie = (wenber * 11) % 30;
  let metqi = (wenber * 19) % 30;
  if (metqi === 0) metqi = 30;
  
  const bealeMetqiMonth = metqi > 14 ? 1 : 2; // 1 = Meskerem, 2 = Tikimt
  
  // Find the day of the week for Beale Metqi to calculate Tewsak
  // We use the converter to find the weekday
  const metqiDate = new EthDateTime(ethiopianYear, bealeMetqiMonth, metqi, 0, 0, 0);
  // getDay() returns 0 for Sunday, 1 for Monday etc in standard JS, let's check EthDateTime
  // EthDateTime toEuropeanDate() returns European Date
  const gcDate = metqiDate.toEuropeanDate();
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const metqiDayOfWeek = weekdayNames[gcDate.getDay()];
  const tewsak = tewsakMap[metqiDayOfWeek];
  
  let mebajaHamer = metqi + tewsak;
  let ninevehMonth = bealeMetqiMonth === 1 ? 5 : 6; // 5 = Tir, 6 = Yekatit
  
  if (mebajaHamer > 30) {
    mebajaHamer -= 30;
    ninevehMonth += 1;
  }
  
  const nineveh: FeastDate = { month: ninevehMonth, day: mebajaHamer, name: "ጾመ ነነዌ", nameEn: "Fast of Nineveh" };
  
  const feasts: Record<string, FeastDate> = {};
  
  const feastNames: Record<string, { am: string, en: string }> = {
    ABIY_TSOME: { am: "ዐቢይ ጾም", en: "Great Lent" },
    DEBRE_ZEIT: { am: "ደብረ ዘይት", en: "Mount of Olives" },
    HOSANNA: { am: "ሆሣዕና", en: "Palm Sunday" },
    SIKLET: { am: "ስቅለት", en: "Good Friday" },
    TINSAYE: { am: "ትንሣኤ", en: "Fasika (Easter)" },
    RIKBE_KAHNAT: { am: "ርክበ ካህናት", en: "Meeting of Priests" },
    ERGET: { am: "ዕርገት", en: "Ascension" },
    PARACLETE: { am: "ጰራቅሊጦስ", en: "Pentecost" },
    TSOME_HAWARYAT: { am: "ጾመ ሐዋርያት", en: "Apostles' Fast" },
    TSOME_DIHENET: { am: "ጾመ ድኅነት", en: "Fast of Salvation" },
  };

  for (const [key, offset] of Object.entries(movableHolidayTewsak)) {
    if (key === 'NINEVEH') continue;
    const feastDate = addDaysToEthiopianDate(nineveh.month, nineveh.day, offset);
    feastDate.name = feastNames[key].am;
    feastDate.nameEn = feastNames[key].en;
    feasts[key] = feastDate;
  }

  return {
    ameteAlem,
    medeb,
    wenber,
    abektie,
    metqi,
    bealeMetqiMonth,
    tewsak,
    mebajaHamer,
    nineveh,
    feasts,
  };
}

export function gcToEt(gcDate: Date): { year: number; month: number; day: number } {
  const etDate = EthDateTime.fromEuropeanDate(gcDate);
  return { year: etDate.year, month: etDate.month, day: etDate.date };
}

export function etToGc(year: number, month: number, day: number): Date {
  const etDate = new EthDateTime(year, month, day, 0, 0, 0);
  return etDate.toEuropeanDate();
}
