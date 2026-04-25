"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is this project?",
    answer:
      "This is a developer tool and validation environment for an Ethiopian liturgical calendar engine being built for a Christian worship mobile app targeting Ethiopian Lutheran, Mekane Yesus, congregations. Before integrating the calendar logic into the app, we built this standalone visualizer to verify that every computed feast date, fasting period, and Evangelist year assignment is correct.",
  },
  {
    question: "Why build a separate validation tool instead of testing inside the app?",
    answer:
      "The Ethiopian liturgical calendar is complex enough that bugs are hard to spot inside a full app. A dedicated visualizer lets us inspect any Ethiopian year in detail, trace the full Bahire Hasab computation step by step, compare feast dates across all four Evangelist years side by side, and cross-check outputs against published EOTC calendars before a single line of worship content touches the engine.",
  },
  {
    question: "What is Bahire Hasab and why does it matter?",
    answer:
      'Bahire Hasab, literally "the calculation of the sea" in Ge\'ez, is the traditional Ethiopian method for computing the church year. It derives from the Alexandrian computus, the same mathematical tradition the Coptic Church uses, tracing back to the third century. It works by computing a single anchor date each year, the Fast of Nineveh, and then deriving every other movable feast as a fixed number of days from that anchor. Easter, or Fasika, is always Nineveh plus 69 days. Without correctly implementing Bahire Hasab, no Ethiopian liturgical calendar is trustworthy.',
  },
  {
    question: "Where did the algorithm come from?",
    answer:
      "We analyzed three independent open source Ethiopian calendar implementations: Kenat in JavaScript, AbushakirJs in TypeScript, and Ethiocal in Go. We confirmed they all implement the same algorithm. We then ported the core Bahire Hasab engine from Kenat, which is the most complete and well-tested of the three, and validated our output against all three as cross-references.",
  },
  {
    question: "Why not just use an existing Ethiopian calendar library directly?",
    answer:
      "We needed the engine to be fully self-contained and offline-first for the mobile app. Pulling in a full library adds bundle weight and external dependencies that create problems in a React Native and Expo environment. More importantly, we needed to understand the algorithm deeply enough to extend it. Adding Mekane Yesus-specific content, handling season boundaries, and resolving overlaps between observances requires knowing exactly how the computation works, not just calling a black-box function.",
  },
  {
    question: "What is the four-year Evangelist cycle?",
    answer:
      "The Ethiopian church organizes its liturgical year into a repeating four-year cycle, each year named after one of the four Evangelists: John, Matthew, Mark, and Luke. Each Evangelist year carries its own gospel readings and sermon themes. The cycle is determined by a simple formula: ameteAlem, the cosmic year count, modulo 4. Ethiopian year 2017, which ran from September 11, 2024 to September 10, 2025 GC, was the Year of Matthew. As of April 25, 2026, the current Ethiopian year is 2018.",
  },
  {
    question: "Why does Easter shift so much between years?",
    answer:
      "Ethiopian Easter, Fasika, is computed using the Alexandrian computus rather than the Western Gregorian method. The anchor point, the Fast of Nineveh, falls on a different date each year depending on lunar cycle position. Since Easter is always 69 days after Nineveh, it moves significantly across a four-year window. In some years Fasika falls in Megabit, in others in Miazia. The Four Years view in this tool exists specifically to make that variation visible.",
  },
  {
    question: "How is this different from a simple Gregorian-to-Ethiopian date converter?",
    answer:
      "A date converter only changes how a date is labeled. For example, it can tell you that April 25, 2026 GC is Miazia 17, 2018 ET. This engine computes what the church year says about that day: which season it is, whether it is a fasting day, which feast is being observed, which Evangelist year the church is in, and where the day falls in the arc from Nineveh to Pentecost. The civil date is just a coordinate. The liturgical content is the actual problem being solved.",
  },
  {
    question: "What is the current state of the project?",
    answer:
      "The calendar engine is complete and validated: Bahire Hasab computation, all 11 movable feasts, all fixed feasts, all fasting periods, the four-year Evangelist cycle, and a precomputed dataset covering Ethiopian years 2010 through 2030. The visualizer is built and running. What is pending is the denominational content layer: the Mekane Yesus lectionary readings, sermon themes, and Sunday propers assigned by Evangelist year and week. That data must be sourced directly from the Ethiopian Evangelical Church Mekane Yesus, EECMY, and is not publicly available online.",
  },
  {
    question: "When will the mobile app be ready?",
    answer:
      "The calendar engine will be integrated into the worship app as soon as the Mekane Yesus lectionary dataset is in hand. The app itself, including the hymn library, calendar UI, and daily readings, is already in active development in parallel. The lectionary data is the critical path item.",
  },
  {
    question: "Can I use this engine in my own project?",
    answer:
      "The Bahire Hasab algorithm is ported from Kenat, which is MIT licensed, and the Ethiopian calendar conversion follows the same open source tradition. If you want to use or adapt the engine, reach out to us directly and we can discuss it.",
  },
  {
    question: "I have EOTC or Mekane Yesus liturgical data that might help. How do I get in touch?",
    answer:
      "Please contact us at contact@doxaplc.com. We are specifically looking for the EECMY four-year lectionary tables, Mekane Yesus Sunday sermon theme assignments, and EOTC sanctoral calendar data keyed by Ethiopian date. Even a physical booklet or a photograph of printed materials would be genuinely useful.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">FAQ</h2>
        <p className="mt-2 text-sm text-[#888]">Project context, algorithm notes, and what is still needed.</p>
      </div>
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.035] p-2 shadow-2xl shadow-black/40 backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_34%)]">
        {faqs.map((faq, index) => (
          <div
            key={faq.question}
            className={`
              relative overflow-hidden rounded-xl border transition-colors
              ${openIndex === index ? "border-white/20 bg-white/[0.075]" : "border-transparent bg-transparent hover:bg-white/[0.045]"}
            `}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`
                    flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold tabular-nums transition-colors
                    ${openIndex === index ? "border-white bg-white text-black" : "border-white/15 bg-black/40 text-[#777]"}
                  `}
                >
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-white">{faq.question}</span>
              </span>
              <ChevronDown
                className={`
                  h-4 w-4 shrink-0 text-[#888] transition-transform
                  ${openIndex === index ? "rotate-180 text-white" : ""}
                `}
              />
            </button>
            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  id={`faq-answer-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="mx-4 border-t border-white/10 py-4 pl-9 pr-1 text-sm leading-relaxed text-[#b8b8b8]">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
