import {
  Code2,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Server,
  Terminal,
  Globe2,
} from 'lucide-react';

const TECH_ITEMS = [
  { name: 'React', icon: Code2, label: 'React 19' },
  { name: 'Next.js', icon: Layers, label: 'Next.js' },
  { name: 'TypeScript', icon: Terminal, label: 'TypeScript' },
  { name: 'Node.js', icon: Server, label: 'Node.js' },
  { name: 'Tailwind CSS', icon: Sparkles, label: 'Tailwind CSS' },
  { name: 'Supabase', icon: Database, label: 'Supabase' },
  { name: 'PostgreSQL', icon: Database, label: 'PostgreSQL' },
  { name: 'Cloud & APIs', icon: Globe2, label: 'REST & GraphQL' },
  { name: 'System Design', icon: Cpu, label: 'Architecture' },
];

export function TechMarquee() {
  return (
    <div className="w-full border-y border-teal-600/15 dark:border-teal-500/15 bg-[#e4f3ef]/70 dark:bg-[#06221f]/80 backdrop-blur-sm py-5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-6 md:gap-8 opacity-85 hover:opacity-100 transition-opacity">
          {TECH_ITEMS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 text-[#1b5852] dark:text-teal-200 hover:text-teal-600 dark:hover:text-teal-300 transition-colors group cursor-default"
              >
                <div className="w-7 h-7 rounded-lg bg-white/90 dark:bg-[#09322e] border border-teal-600/20 dark:border-teal-400/30 flex items-center justify-center shadow-xs group-hover:border-teal-500/60 group-hover:scale-105 transition-all">
                  <IconComponent className="w-3.5 h-3.5 text-teal-700 dark:text-teal-300" />
                </div>
                <span className="text-xs font-semibold tracking-wider uppercase font-mono">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
