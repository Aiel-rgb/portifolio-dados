"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Project } from "./api/projects/route";



import CurvedLoop from "@/components/CurvedLoop";
import { ProjectCard } from "@/components/ProjectCard";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as Project[];
        setProjects(data);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#050506] text-white selection:bg-[var(--color-accent)] selection:text-black">
      {/* Background Decorativo */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-accent)]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-accent)]/5 blur-[120px]" />
      </div>

      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050506]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 md:px-10">
          <a
            href="/"
            className="text-xl font-black tracking-tighter transition-all hover:text-[var(--color-accent)]"
          >
            GN<span className="text-[var(--color-accent)]">.</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {["Sobre", "Projetos", "Stacks", "Contato"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative text-[10px] font-bold uppercase tracking-widest text-white/40 transition-all hover:text-white after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[var(--color-accent)] after:transition-all hover:after:w-full"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col gap-16 px-6 pb-20 pt-32 md:flex-row md:items-start md:px-10 md:pt-48">
        {/* Hero */}
        <section className="flex-1 space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Disponível para Projetos</span>
            </div>
            <h1 className="text-6xl font-black leading-[0.95] tracking-tighter sm:text-7xl md:text-8xl">
              Gabriel <br />
              <span className="text-[var(--color-accent)]">Neves</span>
            </h1>
            <p className="text-lg font-medium text-white/40 md:text-xl">
              Estudante de dados em formação
            </p>
          </div>

          <p className="max-w-md text-lg leading-relaxed text-white/60">
            Estudante de dados em formação, com foco em transformar dados brutos em estratégias de impacto utilizando <b>Python</b> e <b>Visualização de Dados</b>.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <a
              href="#projects"
              className="group relative flex items-center justify-center overflow-hidden rounded-full bg-white/10 px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 border border-white/5 hover:border-[var(--color-accent)]/30"
            >
              <span className="relative z-10">Ver Projetos</span>
              <div className="absolute inset-0 -translate-x-full bg-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-0"></div>
            </a>
            <a
              href="mailto:bielnevesferrer@gmail.com"
              className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 transition-all hover:text-white"
            >
              Contato Direto
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

        </section>

        {/* Foto / destaque */}
        <section className="relative mt-10 flex flex-1 justify-center md:mt-0 md:justify-end">
          <div className="group relative h-96 w-72 md:h-[450px] md:w-80">
            <div className="absolute inset-0 scale-105 rounded-[3rem] bg-(--color-accent)/10 blur-3xl transition-all duration-700 group-hover:scale-110 group-hover:bg-(--color-accent)/20" />
            <div className="relative h-full w-full overflow-hidden rounded-[3rem] border border-white/5 bg-[#111112] transition-all duration-700 group-hover:border-(--color-accent)/30">
              <Image
                src="/foto.jpeg"
                alt="Foto de perfil de Gabriel Neves"
                fill
                sizes="(max-width: 768px) 300px, 400px"
                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 transition-all duration-700 group-hover:opacity-40" />
              <div className="absolute bottom-10 left-10 right-10 transform transition-all duration-700 group-hover:translate-y-[-10px]">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-(--color-accent)">Data Analyst Student</p>
                <p className="mt-2 text-lg font-bold text-white">Data Analyst</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Banner de Stacks Dinâmico */}
      <div className="relative z-0 -mt-20 overflow-hidden select-none pointer-events-none md:pointer-events-auto">
        <CurvedLoop
          marqueeText="Python ✦ Matplotlib ✦ NumPy ✦ Pandas ✦ Scikit-learn ✦ BI ✦ Excel ✦ StatsModels ✦"
          speed={1.5}
          curveAmount={50}
          interactive
        />
      </div>

      {/* Sobre mim */}
      <section
        id="about"
        className="relative z-10 mx-auto max-w-5xl px-6 pb-24 md:px-10 md:pb-32"
      >
        <div className="grid gap-12 rounded-[3rem] border border-white/5 bg-white/[0.02] p-12 backdrop-blur-sm md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-accent)]">Sobre mim</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-white">
              Transformando dados em <br /> inteligência de negócio
            </h2>
            <p className="text-lg leading-relaxed text-white/60">
              Sou Gabriel Neves, focado em criar soluções que unem estatística,
              visualizações impactantes e narrativa de dados. Meu objetivo é
              trazer clareza para decisões complexas.
            </p>
            <p className="text-white/40 leading-relaxed italic">
              "Dados são o novo petróleo, mas o refinamento é o que cria valor."
            </p>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Foco de Atuação</p>
              <p className="text-sm text-white/60">
                Análise exploratória, Machine Learning preditivo e dashboards estratégicos.
              </p>
            </div>
            <div className="rounded-3xl border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Valor Agregado</p>
              <p className="text-sm text-white/60">
                Identificação de padrões ocultos e otimização de processos baseada em evidências.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projetos */}
      <section
        id="projects"
        className="relative z-10 mx-auto max-w-5xl px-6 pb-32 md:px-10"
      >
        <div className="mb-12 flex items-end justify-between">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-accent)]">Portfólio</p>
            <h2 className="text-4xl font-bold tracking-tight text-white">Destaques</h2>
          </div>
          <div className="h-px flex-1 mx-12 bg-white/5 hidden md:block" />
          <p className="text-white/30 text-xs hidden md:block">Projetos selecionados</p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center py-20 text-white/40 font-bold uppercase tracking-widest animate-pulse">
            Preparando descobertas...
          </p>
        ) : (
          <div className="grid gap-10 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* Footer / Contato */}
      <footer id="contato" className="relative z-10 border-t border-white/5 bg-[#050506] py-20">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-white">Vamos conversar?</h2>
              <p className="text-sm text-white/40">Sempre aberto para novos desafios e colaborações.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="mailto:bielnevesferrer@gmail.com"
                className="group flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-[var(--color-accent)]/30 hover:bg-white/10"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-[var(--color-accent)]">E-mail</span>
                <span className="text-xs font-medium text-white">bielnevesferrer@gmail.com</span>
              </a>

              <a
                href="https://github.com/Aiel-rgb"
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-[var(--color-accent)]/30 hover:bg-white/10"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-[var(--color-accent)]">GitHub</span>
                <span className="text-xs font-medium text-white">Aiel-rgb</span>
              </a>

              <a
                href="https://www.linkedin.com/in/gabrielnevesf/"
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-[var(--color-accent)]/30 hover:bg-white/10"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-[var(--color-accent)]">LinkedIn</span>
                <span className="text-xs font-medium text-white">Gabriel_Neves</span>
              </a>
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center justify-between border-t border-white/5 pt-10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 md:flex-row">
            <p>© 2026 Gabriel Neves. Todos os direitos reservados.</p>
            <div className="mt-4 flex gap-6 md:mt-0">
              <span>Coded with React</span>
              <span className="h-4 w-px bg-white/5"></span>
              <span>Ceará, BR</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
