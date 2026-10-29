import {
  Code,
  Layers,
  Database,
  Cpu,
  Sparkles,
  CheckCircle,
  Layout,
  Terminal,
} from 'lucide-react';

interface SkillsSectionProps {
  skills: string[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills || skills.length === 0) return null;

  // Curated engineering service domains matching the reference's "SERVICES I AM PROVIDING"
  const serviceCards = [
    {
      title: 'Full-Stack Web Engineering',
      desc: 'End-to-end web architectures using modern TypeScript, React, Next.js, and server-side runtimes.',
      icon: Code,
      badge: 'Architecture',
    },
    {
      title: 'UI/UX & Frontend Design',
      desc: 'Pixel-perfect, accessible, and responsive user interfaces with smooth motion, Tailwind CSS, and zero slop.',
      icon: Layout,
      badge: 'Interface',
    },
    {
      title: 'Database & Cloud Backends',
      desc: 'High-reliability relational schemas, Supabase/PostgreSQL integrations, row-level security, and APIs.',
      icon: Database,
      badge: 'Data & Security',
    },
    {
      title: 'API & Microservice Systems',
      desc: 'RESTful endpoints, GraphQL, webhooks, authentication flows, and real-time state synchronization.',
      icon: Terminal,
      badge: 'Backend',
    },
  ];

  return (
    <section id="skills" className="py-20 md:py-28 relative border-b border-teal-600/15 dark:border-teal-500/15 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-teal-600/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header matching reference */}
        <div className="space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-widest uppercase bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>SERVICES & PROFICIENCIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#082926] dark:text-white font-heading">
            SERVICES I AM PROVIDING
          </h2>
          <p className="text-sm sm:text-base text-[#1e5852] dark:text-slate-300 max-w-xl font-normal">
            Custom engineering solutions built to deliver performance, security, and exceptional user delight.
          </p>
        </div>

        {/* 4 Core Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {serviceCards.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-[#072623] border border-teal-600/20 dark:border-teal-500/20 shadow-lg hover:border-teal-500 dark:hover:border-teal-400 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 dark:bg-[#0c3934] border border-teal-500/20 flex items-center justify-center text-teal-700 dark:text-teal-300 mb-5 group-hover:scale-110 group-hover:bg-[#35a89e] group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-teal-700 dark:text-teal-300 mb-1">
                  {service.badge}
                </div>
                <h3 className="text-base font-bold text-[#082926] dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-[#1e5852] dark:text-slate-300 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dynamic Skills Tags Grid from Supabase */}
        <div id="skills-tags" className="p-6 sm:p-8 rounded-2xl bg-[#e4f3ef]/70 dark:bg-[#06201d]/90 border border-teal-600/15 dark:border-teal-900/60">
          <div className="flex items-center justify-between gap-4 mb-5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#144842] dark:text-teal-300 font-semibold">
              Verified Technical Stack & Proficiencies
            </span>
            <span className="text-xs font-mono text-teal-700/70 dark:text-teal-400/70">
              {skills.length} competencies
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-teal-600/20 dark:border-teal-500/30 bg-white dark:bg-[#09302c] text-xs font-semibold text-[#0d3430] dark:text-teal-100 hover:border-teal-500 dark:hover:border-teal-400 transition-colors shadow-2xs"
              >
                <CheckCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
