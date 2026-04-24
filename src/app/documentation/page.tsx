"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, Mail, Globe, ExternalLink } from "lucide-react";

// --- Type Definitions ---
interface DocMeta { title: string; subtitle: string; description: string }
interface DocLink { label: string; type: string; value: string; href: string }
interface DocRow { [key: string]: string | null }
interface DocSection {
  id: string;
  type: string;
  heading: string;
  body?: string;
  intro?: string;
  items?: { heading?: string; body?: string; name?: string; language?: string; description?: string }[];
  subsections?: DocSubsection[];
  steps?: AlgorithmStep[];
  tewsakTable?: TewsakTable;
  tables?: DocTable[];
  code?: string;
  currentYear?: { ethiopianYear: number; evangelist: string; amharic: string; gregorianRange: string };
  implications?: string[];
  columns?: string[];
  rows?: DocRow[];
  statusValues?: { [key: string]: { label: string; color: string } };
  lookingFor?: string[];
  links?: DocLink[];
  projectDescription?: string;
}
interface DocSubsection {
  id: string; heading: string; body?: string; intro?: string;
  items?: { name: string; language: string; description: string }[];
  layers?: { number: number; name: string; description: string }[];
  sources?: string[];
  closing?: string;
}
interface AlgorithmStep {
  step: number; heading: string; code?: string; explanation?: string; body?: string;
}
interface TewsakTable {
  heading: string; columns: string[]; rows: { feast: string; amharic: string; offset: number }[]; note: string;
}
interface DocTable {
  id: string; heading: string; columns: string[]; rows: DocRow[];
}
interface DocData {
  meta: DocMeta;
  sections: DocSection[];
  footer: { attribution: string; closing?: string };
}

// --- Helpers ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    complete: "bg-white/10 text-white border border-white/20",
    pending: "bg-[#111] text-[#888] border border-white/10",
    inProgress: "bg-[#1a1a00] text-yellow-400 border border-yellow-900",
  };
  const labels: Record<string, string> = { complete: "Complete", pending: "Pending", inProgress: "In Progress" };
  const icons: Record<string, React.ReactNode> = {
    complete: <CheckCircle className="w-3.5 h-3.5 text-white" />,
    pending: <Clock className="w-3.5 h-3.5 text-[#888]" />,
    inProgress: <Clock className="w-3.5 h-3.5 text-yellow-400" />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
      {icons[status]} {labels[status] || status}
    </span>
  );
};

// --- Section Renderers ---
function ProseSection({ section }: { section: DocSection }) {
  return (
    <div className="space-y-4">
      <p className="text-[#aaa] leading-relaxed whitespace-pre-line text-base">{section.body}</p>
    </div>
  );
}

function ProseWithListSection({ section }: { section: DocSection }) {
  return (
    <div className="space-y-8">
      {section.intro && <p className="text-[#aaa] leading-relaxed whitespace-pre-line">{section.intro}</p>}
      <div className="grid gap-4">
        {section.items?.map((item, i) => (
          <div key={i} className="p-5 bg-[#050505] border border-white/10 rounded-xl hover:border-white/20 transition-colors">
            {item.heading && <h4 className="text-white font-semibold mb-2 tracking-tight">{item.heading}</h4>}
            {item.body && <p className="text-[#888] leading-relaxed text-sm">{item.body}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProseWithSubsectionsSection({ section }: { section: DocSection }) {
  return (
    <div className="space-y-10">
      {section.subsections?.map((sub) => (
        <div key={sub.id} className="space-y-4">
          <h4 className="text-white font-semibold text-lg tracking-tight border-b border-white/10 pb-3">{sub.heading}</h4>
          {sub.intro && <p className="text-[#aaa] leading-relaxed">{sub.intro}</p>}
          {sub.body && <p className="text-[#aaa] leading-relaxed whitespace-pre-line">{sub.body}</p>}
          {sub.items && (
            <div className="grid gap-3">
              {sub.items.map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-[#050505] border border-white/10 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold">{item.name}</span>
                      {item.language && (
                        <span className="text-xs font-mono px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[#888]">{item.language}</span>
                      )}
                    </div>
                    <p className="text-[#888] text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {sub.layers && (
            <div className="space-y-3">
              {sub.layers.map((layer) => (
                <div key={layer.number} className="flex gap-4 p-4 bg-[#050505] border border-white/10 rounded-xl items-start">
                  <div className="w-7 h-7 rounded-full bg-[#111] border border-white/20 flex items-center justify-center text-sm font-bold text-[#888] shrink-0 mt-0.5">
                    {layer.number}
                  </div>
                  <div>
                    <span className="text-white font-semibold text-sm">{layer.name}</span>
                    <p className="text-[#888] text-sm mt-1 leading-relaxed">{layer.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {sub.sources && (
            <ul className="space-y-2">
              {sub.sources.map((src, i) => (
                <li key={i} className="flex items-start gap-3 text-[#888] text-sm">
                  <span className="text-white/20 mt-1">—</span>
                  <span>{src}</span>
                </li>
              ))}
            </ul>
          )}
          {sub.closing && <p className="text-[#aaa] text-sm italic border-l-2 border-white/10 pl-4">{sub.closing}</p>}
        </div>
      ))}
    </div>
  );
}

function AlgorithmSection({ section }: { section: DocSection }) {
  return (
    <div className="space-y-10">
      {/* Steps */}
      <div className="relative border-l border-white/10 ml-3 pl-8 space-y-8">
        {section.steps?.map((step) => (
          <div key={step.step} className="relative group">
            <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-black border-2 border-white/20 flex items-center justify-center text-[10px] font-bold text-[#888] group-hover:border-white group-hover:text-white transition-colors">
              {step.step}
            </div>
            <div className="bg-[#050505] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors group-hover:bg-[#0a0a0a] space-y-3">
              <h4 className="text-white font-semibold tracking-tight">{step.heading}</h4>
              {step.code && (
                <pre className="bg-black border border-white/10 rounded-lg p-4 text-sm font-mono text-[#aaa] overflow-x-auto leading-relaxed">
                  <code>{step.code}</code>
                </pre>
              )}
              {(step.explanation || step.body) && (
                <p className="text-[#888] leading-relaxed text-sm">{step.explanation || step.body}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tewsak Table */}
      {section.tewsakTable && (
        <div className="space-y-4">
          <h4 className="text-white font-semibold tracking-tight">{section.tewsakTable.heading}</h4>
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#111] border-b border-white/10">
                <tr>
                  {section.tewsakTable.columns.map((col) => (
                    <th key={col} className="px-5 py-3.5 text-[#888] font-medium text-xs uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {section.tewsakTable.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-[#050505] transition-colors">
                    <td className="px-5 py-3 text-[#aaa]">{row.feast}</td>
                    <td className="px-5 py-3 text-white font-ethiopic">{row.amharic}</td>
                    <td className="px-5 py-3 text-white font-mono">+{row.offset}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[#888] text-xs italic border-l-2 border-white/10 pl-3">{section.tewsakTable.note}</p>
        </div>
      )}
    </div>
  );
}

function TablesSection({ section }: { section: DocSection }) {
  return (
    <div className="space-y-8">
      {section.intro && <p className="text-[#aaa] leading-relaxed">{section.intro}</p>}
      {section.tables?.map((table) => (
        <div key={table.id} className="space-y-3">
          <h4 className="text-white font-semibold tracking-tight">{table.heading}</h4>
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#111] border-b border-white/10">
                <tr>
                  {table.columns.map((col) => (
                    <th key={col} className="px-5 py-3.5 text-[#888] font-medium text-xs uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {table.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-[#050505] transition-colors">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className={`px-5 py-3 ${j === 1 ? "font-ethiopic text-white" : "text-[#aaa]"}`}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

function FourYearSection({ section }: { section: DocSection }) {
  return (
    <div className="space-y-6">
      {section.body && <p className="text-[#aaa] leading-relaxed">{section.body}</p>}
      {section.code && (
        <pre className="bg-black border border-white/10 rounded-xl p-5 text-sm font-mono text-[#aaa] overflow-x-auto">
          <code>{section.code}</code>
        </pre>
      )}
      {section.currentYear && (
        <div className="flex items-center gap-4 p-5 bg-[#050505] border border-white/10 rounded-xl">
          <div className="text-center px-5 border-r border-white/10">
            <div className="text-[#888] text-xs uppercase tracking-wider mb-1">Current Year</div>
            <div className="text-white text-xl font-bold">{section.currentYear.ethiopianYear}</div>
          </div>
          <div>
            <div className="text-white font-semibold">{section.currentYear.evangelist} <span className="font-ethiopic">({section.currentYear.amharic})</span></div>
            <div className="text-[#888] text-sm">{section.currentYear.gregorianRange}</div>
          </div>
        </div>
      )}
      {section.implications && (
        <ul className="space-y-2.5">
          {section.implications.map((imp, i) => (
            <li key={i} className="flex items-start gap-3 text-[#888] text-sm">
              <span className="text-white/20 mt-1 shrink-0">—</span>
              <span>{imp}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusSection({ section }: { section: DocSection }) {
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-[#111] border-b border-white/10">
          <tr>
            {section.columns?.map((col) => (
              <th key={col} className="px-5 py-3.5 text-[#888] font-medium text-xs uppercase tracking-wider">{col}</th>
            ))}
            <th className="px-5 py-3.5 text-[#888] font-medium text-xs uppercase tracking-wider">Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {section.rows?.map((row, i) => (
            <tr key={i} className="hover:bg-[#050505] transition-colors">
              <td className="px-5 py-3.5 text-[#aaa]">{row.component}</td>
              <td className="px-5 py-3.5"><StatusBadge status={row.status as string} /></td>
              <td className="px-5 py-3.5 text-[#888] text-xs">{row.note ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContactSection({ section }: { section: DocSection }) {
  // Override the body text to reflect actual contributors
  const bodyText =
    section.body?.replace(
      "Doxa Innovations",
      "Lukas Brocker and Cherinet, working independently as open source collaborators"
    ) ?? "";

  return (
    <div className="space-y-6">
      {bodyText && <p className="text-[#aaa] leading-relaxed">{bodyText}</p>}
      {section.lookingFor && (
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">We Are Looking For</h4>
          <ul className="space-y-2">
            {section.lookingFor.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[#888] text-sm">
                <span className="text-white/20 shrink-0 mt-1">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {section.links && (
        <div className="flex flex-wrap gap-3 pt-2">
          {section.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 border border-white/20 rounded-lg text-sm text-[#888] hover:text-white hover:border-white/40 transition-all group"
            >
              {link.type === "telegram" ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
                </svg>
              ) : link.type === "email" ? (
                <Mail className="w-4 h-4" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
              {link.value}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      )}
      {section.projectDescription && (
        <p className="text-[#888] text-xs border-l-2 border-white/10 pl-3">{section.projectDescription}</p>
      )}
    </div>
  );
}

function SectionRenderer({ section }: { section: DocSection }) {
  switch (section.type) {
    case "prose": return <ProseSection section={section} />;
    case "prose_with_list": return <ProseWithListSection section={section} />;
    case "prose_with_subsections": return <ProseWithSubsectionsSection section={section} />;
    case "algorithm_steps": return <AlgorithmSection section={section} />;
    case "tables": return <TablesSection section={section} />;
    case "prose_with_table": return <FourYearSection section={section} />;
    case "status_table": return <StatusSection section={section} />;
    case "contact": return <ContactSection section={section} />;
    default: return null;
  }
}

// --- Main Page ---
export default function DocumentationPage() {
  const [doc, setDoc] = useState<DocData | null>(null);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    fetch("/data/documentation.json")
      .then((res) => res.json())
      .then((data: DocData) => setDoc(data));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = doc?.sections ?? [];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [doc]);

  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-[#888] text-sm">
        Loading documentation…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-white bg-black">
      {/* Top Nav — minimal: back + title only. Sidebar handles in-page nav. */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-[12px] flex items-center px-6 h-16 gap-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[#888] hover:text-white transition-colors text-sm shrink-0">
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>
        <div className="hidden sm:block w-px h-4 bg-white/10" />
        <span className="hidden sm:block text-[#888] text-sm truncate">{doc.meta.title}</span>
      </header>

      <div className="flex flex-1 w-full max-w-7xl mx-auto px-6 py-12 gap-12">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:flex flex-col w-52 xl:w-60 shrink-0">
          <div className="sticky top-24 space-y-1">
            <div className="text-[#888] text-xs uppercase tracking-wider font-medium mb-4">On this page</div>
            {doc.sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={() => setActiveSection(sec.id)}
                className={`block text-sm py-1.5 px-3 rounded-md transition-colors ${
                  activeSection === sec.id
                    ? "text-white bg-white/5 border border-white/10"
                    : "text-[#888] hover:text-white"
                }`}
              >
                {sec.heading}
              </a>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-20 pb-24">
          {/* Hero */}
          <div className="space-y-4 pb-10 border-b border-white/10">
            <div className="text-[#888] text-sm font-medium uppercase tracking-widest">{doc.meta.subtitle}</div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white leading-tight">
              {doc.meta.title}
            </h1>
            <p className="text-[#888] text-lg leading-relaxed max-w-2xl">{doc.meta.description}</p>
          </div>

          {/* Sections */}
          {doc.sections.map((section, idx) => (
            <section key={section.id} id={section.id} className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-[#444] text-sm font-mono tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
                <h2 className="text-2xl font-bold tracking-tight text-white">{section.heading}</h2>
              </div>
              <SectionRenderer section={section} />
            </section>
          ))}

          {/* Footer attribution + Soli Deo Gloria */}
          <footer className="pt-10 border-t border-white/10 space-y-6">
            <p className="text-[#555] text-xs leading-relaxed">{doc.footer.attribution}</p>
            {doc.footer.closing && (
              <p className="text-center text-[#444] text-sm italic tracking-widest pt-4 border-t border-white/5">
                {doc.footer.closing}
              </p>
            )}
          </footer>
        </main>
      </div>
    </div>
  );
}
