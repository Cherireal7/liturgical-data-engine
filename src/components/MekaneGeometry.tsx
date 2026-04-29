"use client";
import { motion } from "framer-motion";

export default function MekaneGeometry() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.svg
        className="absolute left-1/2 top-0 h-[900px] w-[1400px] -translate-x-1/2 text-white"
        viewBox="0 0 1400 900"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="mkGlow" cx="50%" cy="30%" r="55%">
            <stop offset="0%" stopColor="#C8943A" stopOpacity="0.06" />
            <stop offset="50%" stopColor="white" stopOpacity="0.02" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1400" height="900" fill="url(#mkGlow)" />

        {/* Cross-hatch grid lines */}
        {[200, 400, 600, 800, 1000, 1200].map((x) => (
          <motion.line
            key={`v${x}`} x1={x} y1="0" x2={x} y2="900"
            stroke="white" strokeOpacity="0.04" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: x / 1200 }}
          />
        ))}
        {[150, 300, 450, 600, 750].map((y) => (
          <motion.line
            key={`h${y}`} x1="0" y1={y} x2="1400" y2={y}
            stroke="white" strokeOpacity="0.04" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: y / 1500 }}
          />
        ))}

        {/* Rotating outer ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "700px 380px" }}
        >
          <circle cx="700" cy="380" r="320" stroke="white" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 12" />
          <circle cx="700" cy="380" r="240" stroke="#C8943A" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="2 10" />
        </motion.g>

        {/* Counter-rotating inner ring */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "700px 380px" }}
        >
          <circle cx="700" cy="380" r="160" stroke="white" strokeOpacity="0.07" strokeWidth="1" strokeDasharray="3 8" />
        </motion.g>

        {/* Corner decorative rings */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "120px 120px" }}
        >
          <circle cx="120" cy="120" r="60" stroke="white" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="2 6" />
          <circle cx="120" cy="120" r="30" stroke="white" strokeOpacity="0.04" strokeWidth="1" />
        </motion.g>

        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "1280px 700px" }}
        >
          <circle cx="1280" cy="700" r="80" stroke="white" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="3 7" />
          <circle cx="1280" cy="700" r="40" stroke="#C8943A" strokeOpacity="0.05" strokeWidth="1" />
        </motion.g>

        {/* Pulsing center node */}
        <motion.circle
          cx="700" cy="380" r="4"
          fill="#C8943A" fillOpacity="0.4"
          animate={{ scale: [1, 2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Grid intersection nodes */}
        {[200, 400, 600, 800, 1000, 1200].flatMap((x) =>
          [150, 300, 450, 600, 750].map((y) => (
            <motion.circle
              key={`n${x}${y}`} cx={x} cy={y} r="1.5"
              fill="white" fillOpacity="0.08"
              animate={{ opacity: [0.05, 0.2, 0.05] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
            />
          ))
        )}
      </motion.svg>

      {/* Bottom fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,transparent_0%,rgba(0,0,0,0.3)_55%,#000_88%)]" />
    </div>
  );
}
