# Ethiopian Liturgical Calendar Engine

A validation tool and data engine for computing the Ethiopian church year. Built as a standalone research project before integrating into a Christian worship mobile app for Ethiopian Lutheran (Mekane Yesus) congregations.

## What this is

The Ethiopian liturgical calendar is not a simple date formatting problem. Computing the church year correctly requires implementing the Bahire Hasab system — the traditional Ethiopian Orthodox computus derived from the Alexandrian tradition — which determines Easter (Fasika) and all movable feasts through a chain of lunar arithmetic anchored at the Fast of Nineveh.

This project ports that algorithm into JavaScript, validates it against three independent open source implementations, and provides a visual tool for inspecting the output across any Ethiopian year.

## What it does

The engine computes the following for any Ethiopian year:

- All 11 movable feasts via tewsak offsets from the Nineveh anchor
- All fixed feasts keyed by Ethiopian calendar date
- All fasting periods with start and end dates
- The four-year Evangelist cycle (John, Matthew, Mark, Luke)
- Gregorian to Ethiopian and Ethiopian to Gregorian date conversion
- A precomputed dataset for Ethiopian years 2010 through 2030

The visualizer lets you select any year, inspect individual days, trace the full Bahire Hasab computation step by step, compare feast dates across all four Evangelist years, and export the dataset as JSON.

## Algorithm source

The Bahire Hasab implementation is ported from the Kenat open source project (MIT license), cross-referenced against AbushakirJs (TypeScript) and Ethiocal (Go). All three implement the same algorithm independently, which provided confidence in the port.

The core idea: every movable feast is a fixed number of days from the Fast of Nineveh. Nineveh is computed from lunar constants. Easter is Nineveh plus 69 days. Everything else follows.

## Status

The engine and visualizer are complete. The Mekane Yesus lectionary layer — readings, sermon themes, and commemorations by Evangelist year — is pending. We are in the process of obtaining that dataset from the Ethiopian Evangelical Church Mekane Yesus (EECMY). Integration into the mobile app begins once that data is in hand.

## Running locally

```bash
npm install
npm run dev
```

## Contributing

If you have access to EECMY lectionary tables, Mekane Yesus Sunday readings, or EOTC sanctoral calendar data in any form, please reach out. That is the one piece we cannot compute and must source from the church directly.

[EMAIL_ADDRESS]

## Credits

Bahire Hasab algorithm adapted from Kenat by Henok Mikre (MIT license).
Ethiopian calendar conversion from the same project.
Original computus tradition of the Ethiopian Orthodox Tewahedo Church.
