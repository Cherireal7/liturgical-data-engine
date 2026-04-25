"use client";

import { motion } from "framer-motion";

const lineDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
};

export default function LandingGeometry() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.svg
        className="absolute left-1/2 top-0 h-[760px] w-[1400px] -translate-x-1/2 text-white"
        viewBox="0 0 1400 760"
        fill="none"
        initial="hidden"
        animate="visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="geometryGlow" cx="50%" cy="18%" r="62%">
            <stop offset="0%" stopColor="white" stopOpacity="0.1" />
            <stop offset="46%" stopColor="white" stopOpacity="0.035" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1400" height="760" fill="url(#geometryGlow)" />

        <motion.g
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
          }}
        >
          <motion.path
            d="M100 154H1300"
            strokeOpacity="0.16"
            strokeDasharray="1 7"
            variants={lineDraw}
            transition={{ duration: 1.3, ease: "easeOut" }}
          />
          <motion.path
            d="M205 92V648"
            strokeOpacity="0.11"
            strokeDasharray="1 8"
            variants={lineDraw}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.path
            d="M1195 92V648"
            strokeOpacity="0.11"
            strokeDasharray="1 8"
            variants={lineDraw}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.path
            d="M318 628L700 116L1082 628"
            strokeOpacity="0.12"
            variants={lineDraw}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
          <motion.path
            d="M700 116L700 650"
            strokeOpacity="0.12"
            strokeDasharray="4 10"
            variants={lineDraw}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
          <motion.path
            d="M335 508H1065"
            strokeOpacity="0.1"
            strokeDasharray="1 7"
            variants={lineDraw}
            transition={{ duration: 1.3, ease: "easeOut" }}
          />
          <motion.path
            d="M430 648C490 452 558 318 700 116C842 318 910 452 970 648"
            strokeOpacity="0.14"
            variants={lineDraw}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
        </motion.g>

        <motion.g
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.12"
          animate={{ rotate: 360 }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "700px 378px" }}
        >
          <circle cx="700" cy="378" r="242" strokeDasharray="2 8" />
          <circle cx="700" cy="378" r="158" strokeDasharray="1 10" />
          <path d="M458 378H942" />
          <path d="M700 136V620" />
        </motion.g>

        <motion.g
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.18"
          animate={{ rotate: -360 }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "242px 154px" }}
        >
          <circle cx="242" cy="154" r="42" strokeDasharray="1 6" />
          <path d="M200 154H284" />
          <path d="M242 112V196" />
        </motion.g>

        <motion.g
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.14"
          animate={{ rotate: 360 }}
          transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "1138px 508px" }}
        >
          <circle cx="1138" cy="508" r="82" strokeDasharray="2 9" />
          <circle cx="1138" cy="508" r="38" />
          <path d="M1056 508H1220" />
        </motion.g>

        <motion.circle
          cx="700"
          cy="378"
          r="4"
          fill="currentColor"
          fillOpacity="0.5"
          animate={{ scale: [1, 1.8, 1], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,transparent_0%,rgba(0,0,0,0.24)_42%,#000_86%)]" />
    </div>
  );
}
