"use client";

import { useEffect, useState } from "react";

type Skill = {
    id: string;
    category: string;
    items: string[];
};

export default function SkillsSection() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/skills")
            .then((res) => res.json())
            .then((data) => setSkills(data))
            .catch(() => setSkills([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading || skills.length === 0) return null;

    return (
        <section id="habilidades" className="relative z-10 mx-auto max-w-5xl px-6 pb-24 md:px-10">
            <div className="mb-12 space-y-4">
                <h2 className="text-4xl font-bold tracking-tight text-white">Minhas <span className="text-(--color-accent)">Habilidades</span></h2>
                <p className="text-white/60 text-sm max-w-xl">
                    Tecnologias e ferramentas que utilizo para transformar ideias em aplicações mais robustas e escaláveis.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {skills.map((skill) => (
                    <div key={skill.id} className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/10 group">
                        <h3 className="text-lg font-bold text-white mb-6 group-hover:text-(--color-accent) transition-colors">{skill.category}</h3>
                        <div className="flex flex-wrap gap-2">
                            {skill.items.map((item, index) => (
                                <span key={index} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 hover:text-white hover:border-(--color-accent)/30 transition-all cursor-default">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
