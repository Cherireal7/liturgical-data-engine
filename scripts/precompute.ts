import * as fs from 'fs';
import * as path from 'path';
import { calculateBahireHasab, getEvangelist, fixedFeasts, fixedFasts, gcToEt, etToGc } from '../src/engine/bahireHasab';

const startYear = 2010;
const endYear = 2030;

const data = [];

for (let year = startYear; year <= endYear; year++) {
  const result = calculateBahireHasab(year);
  const evangelist = getEvangelist(year);
  
  // Calculate Fasika GC date
  const fasika = result.feasts['TINSAYE'];
  const fasikaGc = etToGc(year, fasika.month, fasika.day);
  
  data.push({
    year,
    evangelist,
    bahireHasab: result,
    fasikaGc: fasikaGc.toISOString().split('T')[0], // YYYY-MM-DD
  });
}

const outputPath = path.join(__dirname, '../public/data');
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

fs.writeFileSync(
  path.join(outputPath, 'feasts_2010_2030.json'),
  JSON.stringify(data, null, 2)
);

console.log(`Successfully generated feast data for years ${startYear}-${endYear} at public/data/feasts_2010_2030.json`);
