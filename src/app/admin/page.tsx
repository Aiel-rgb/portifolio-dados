"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/app/api/projects/route";

export default function AdminDashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        link: "",
        siteLink: "",
        description: "",
        stacks: "",
    });
    const [message, setMessage] = useState("");
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            const res = await fetch("/api/projects");
            const data = await res.json();
            setProjects(data);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const method = isEditing ? "PUT" : "POST";
        const body = isEditing ? { ...formData, id: isEditing } : formData;

        try {
            const res = await fetch("/api/projects", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setMessage(isEditing ? "Projeto atualizado! ✅" : "Projeto adicionado! 🚀");
                setFormData({ name: "", link: "", siteLink: "", description: "", stacks: "" });
                setIsEditing(null);
                fetchProjects();
            }
        } catch (err) {
            setMessage("Erro ao salvar.");
        }
    };

    const handleEdit = (project: Project) => {
        setIsEditing(project.id);
        setFormData({
            name: project.name,
            link: project.link,
            siteLink: project.siteLink || "",
            description: project.description,
            stacks: project.stacks,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir?")) return;
        await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
        fetchProjects();
    };

    // Drag and Drop Logic
    const handleDragStart = (index: number) => setDraggedIndex(index);

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newProjects = [...projects];
        const item = newProjects.splice(draggedIndex, 1)[0];
        newProjects.splice(index, 0, item);

        setProjects(newProjects);
        setDraggedIndex(index);
    };

    const handleDragEnd = async () => {
        setDraggedIndex(null);
        await fetch("/api/projects", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reorder: true, projects }),
        });
    };

    return (
        <div className="min-h-screen bg-[#050506] text-white p-6 md:p-20 selection:bg-(--color-accent) selection:text-black">
            <div className="mx-auto max-w-4xl space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-(--color-accent)">Admin Dashboard</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter sm:text-5xl">
                            Gerenciar <span className="text-(--color-accent)">Projetos</span>
                        </h1>
                    </div>
                    <a href="/" className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all">
                        ← Voltar para o Portfólio
                    </a>
                </header>

                {/* Form area */}
                <section className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 md:p-12 backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <h2 className="text-lg font-bold text-white/60 mb-2 uppercase tracking-widest text-[10px]">
                            {isEditing ? "Editando Projeto" : "Novo Projeto"}
                        </h2>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-2">Nome</label>
                            <input
                                required
                                className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm focus:border-(--color-accent)/50 outline-none transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <input
                                required
                                placeholder="GitHub Link"
                                className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm focus:border-(--color-accent)/50 outline-none transition-all"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            />
                            <input
                                placeholder="Site Link (Opcional)"
                                className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm focus:border-(--color-accent)/50 outline-none transition-all"
                                value={formData.siteLink}
                                onChange={(e) => setFormData({ ...formData, siteLink: e.target.value })}
                            />
                        </div>
                        <input
                            placeholder="Stacks (vírgula)"
                            className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm focus:border-(--color-accent)/50 outline-none transition-all"
                            value={formData.stacks}
                            onChange={(e) => setFormData({ ...formData, stacks: e.target.value })}
                        />
                        <textarea
                            required
                            rows={3}
                            placeholder="Descrição..."
                            className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm focus:border-(--color-accent)/50 outline-none transition-all resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="flex-1 rounded-full bg-(--color-accent) px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-black hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                {isEditing ? "Salvar Alterações" : "Publicar Projeto"}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => { setIsEditing(null); setFormData({ name: "", link: "", siteLink: "", description: "", stacks: "" }); }}
                                    className="rounded-full border border-white/10 bg-white/5 px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                        {message && <p className="text-center text-[10px] font-bold uppercase tracking-widest text-(--color-accent)">{message}</p>}
                    </form>
                </section>

                {/* Dashboard Cards */}
                <section className="space-y-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Seus Projetos (Arraste para reordenar)</h2>
                    <div className="grid gap-4">
                        {loading ? <p>Carregando...</p> : projects.map((project, index) => (
                            <div
                                key={project.id}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`group flex items-center justify-between gap-6 p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl transition-all cursor-move ${draggedIndex === index ? "opacity-30 scale-95" : "hover:border-(--color-accent)/30 hover:bg-white/10"}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-center gap-1 text-white/20 group-hover:text-(--color-accent)/50 transition-colors">
                                        <div className="h-1 w-4 rounded-full bg-current" />
                                        <div className="h-1 w-4 rounded-full bg-current" />
                                        <div className="h-1 w-4 rounded-full bg-current" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white group-hover:text-(--color-accent) transition-colors">{project.name}</h3>
                                        <p className="text-xs text-white/40 line-clamp-1">{project.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                                        title="Editar"
                                    >
                                        ✎
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500/60 hover:text-red-500 transition-all"
                                        title="Excluir"
                                    >
                                        🗑
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
