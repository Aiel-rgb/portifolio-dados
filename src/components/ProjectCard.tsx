"use client";

import type { Project } from "@/app/api/projects/route";

export function Pill({ label }: { label: string }) {
    return (
        <span className="rounded-full border border-white/5 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white/40 transition-all hover:border-[var(--color-accent)]/50 hover:bg-white/10 hover:text-white">
            {label}
        </span>
    );
}

export function ProjectCard({ project }: { project: Project }) {
    const stacks = project.stacks
        ? project.stacks.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    return (
        <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[var(--color-accent)]/30 hover:bg-white/10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--color-accent)]/5 blur-[100px] transition-all duration-700 group-hover:bg-[var(--color-accent)]/10" />

            <div className="relative z-10">
                <h3 className="text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-[var(--color-accent)]">
                    {project.name}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/50">
                    {project.description}
                </p>
            </div>

            <div className="relative z-10 mt-8 flex flex-wrap gap-2">
                {stacks.map((stack) => (
                    <span
                        key={stack}
                        className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] transition-all group-hover:bg-[var(--color-accent)]/10 group-hover:text-white"
                    >
                        {stack}
                    </span>
                ))}
            </div>

            <div className="relative z-10 mt-10 flex flex-wrap items-center gap-4">
                <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group/btn flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white/60 transition-all hover:bg-black hover:text-white hover:border-black"
                >
                    GitHub
                    <span className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                </a>

                {project.siteLink && (
                    <a
                        href={project.siteLink}
                        target="_blank"
                        rel="noreferrer"
                        className="group/btn flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95"
                    >
                        Ver Site
                        <span className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                    </a>
                )}
            </div>
        </article>
    );
}
