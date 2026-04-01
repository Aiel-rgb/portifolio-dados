"use client";

import { useState, useEffect, useRef } from "react";
import type { Project } from "@/data/projects";

type Skill = {
    id: string;
    category: string;
    items: string[];
};

type Certificate = {
    id: string;
    image: string;
    link?: string;
    text: string;
};

export default function AdminDashboard() {
    const [isProd, setIsProd] = useState(false);
    const [activeTab, setActiveTab] = useState<"projects" | "skills" | "certificates">("projects");

    useEffect(() => {
        setIsProd(window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1");
    }, []);

    return (
        <div className="min-h-screen bg-[#050506] text-white p-6 md:p-20 selection:bg-(--color-accent) selection:text-black">
            <div className="mx-auto max-w-4xl space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-(--color-accent)">Admin Dashboard</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter sm:text-5xl">
                            Gerenciar <span className="text-(--color-accent)">Portfólio</span>
                        </h1>
                    </div>
                    <a href="/" className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all">
                        ← Voltar para o Portfólio
                    </a>
                </header>

                {isProd && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 backdrop-blur-sm">
                        <h2 className="text-sm font-bold text-red-400 mb-2">Atenção: Ambiente de Produção</h2>
                        <p className="text-xs text-white/70">
                            Você está acessando o Admin no Vercel. O Vercel <b>não permite salvar em arquivos</b> (filesystem read-only). <br />
                            Para adicionar conteúdo, você deve rodar o projeto localmente (<code className="bg-black/50 px-1 py-0.5 rounded text-red-300">npm run dev</code>), usar o admin e depois fazer o `git push`.
                        </p>
                    </div>
                )}

                <div className="flex gap-4 border-b border-white/10 pb-4 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("projects")}
                        className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeTab === 'projects' ? 'bg-(--color-accent) text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                    >
                        Projetos
                    </button>
                    <button
                        onClick={() => setActiveTab("skills")}
                        className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeTab === 'skills' ? 'bg-(--color-accent) text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                    >
                        Habilidades
                    </button>
                    <button
                        onClick={() => setActiveTab("certificates")}
                        className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeTab === 'certificates' ? 'bg-(--color-accent) text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                    >
                        Certificados
                    </button>
                </div>

                <div className={isProd ? "opacity-50 pointer-events-none" : ""}>
                    {activeTab === "projects" && <ProjectsAdmin />}
                    {activeTab === "skills" && <SkillsAdmin />}
                    {activeTab === "certificates" && <CertificatesAdmin />}
                </div>
            </div>
        </div>
    );
}

function ProjectsAdmin() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", link: "", siteLink: "", description: "", stacks: "" });
    const [message, setMessage] = useState("");
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => { fetchProjects(); }, []);

    async function fetchProjects() {
        try {
            const res = await fetch("/api/projects");
            if (res.ok) setProjects(await res.json());
        } finally { setLoading(false); }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const method = isEditing ? "PUT" : "POST";
        const body = JSON.stringify({
            id: isEditing || undefined,
            name: formData.name,
            github_link: formData.link,
            site_link: formData.siteLink || undefined,
            description: formData.description,
            stacks: formData.stacks,
        });

        const res = await fetch("/api/projects", { method, headers: { "Content-Type": "application/json" }, body });
        if (res.ok) {
            setMessage(isEditing ? "Projeto atualizado! ✅" : "Projeto adicionado! 🚀");
            setFormData({ name: "", link: "", siteLink: "", description: "", stacks: "" });
            setIsEditing(null);
        } else {
            const err = await res.json();
            setMessage(`Erro: ${err.error || "Falha ao salvar"}`);
        }
        fetchProjects();
    };

    const handleEdit = (project: Project) => {
        setIsEditing(project.id);
        setFormData({
            name: project.name, link: project.github_link, siteLink: project.site_link || "", description: project.description, stacks: project.stacks,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir?")) return;
        await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
        fetchProjects();
    };

    const handleDragStart = (index: number) => setDraggedIndex(index);
    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        const newItems = [...projects];
        const item = newItems.splice(draggedIndex, 1)[0];
        newItems.splice(index, 0, item);
        setProjects(newItems);
        setDraggedIndex(index);
    };
    const handleDragEnd = async () => {
        setDraggedIndex(null);
        await fetch("/api/projects", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reorder: true, projects }) });
    };

    return (
        <div className="space-y-12">
            <section className="rounded-[2.5rem] border border-white/5 bg-white/2 p-8 md:p-12 backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="grid gap-6">
                    <h2 className="text-lg font-bold text-white/60 mb-2 uppercase tracking-widest text-[10px]">
                        {isEditing ? "Editando Projeto" : "Novo Projeto"}
                    </h2>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-2">Nome</label>
                        <input required className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm focus:border-(--color-accent)/50 outline-none transition-all" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <input required placeholder="GitHub Link" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm focus:border-(--color-accent)/50 outline-none transition-all" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} />
                        <input placeholder="Site / Dashboard Link (Opcional)" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm focus:border-(--color-accent)/50 outline-none transition-all" value={formData.siteLink} onChange={(e) => setFormData({ ...formData, siteLink: e.target.value })} />
                    </div>
                    <input placeholder="Stacks (vírgula)" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm focus:border-(--color-accent)/50 outline-none transition-all" value={formData.stacks} onChange={(e) => setFormData({ ...formData, stacks: e.target.value })} />
                    <textarea required rows={3} placeholder="Descrição..." className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm focus:border-(--color-accent)/50 outline-none transition-all resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                    <div className="flex gap-4 pt-4">
                        <button type="submit" className="flex-1 rounded-full bg-(--color-accent) px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-black hover:scale-[1.02] active:scale-95 transition-all">
                            {isEditing ? "Salvar Alterações" : "Publicar Projeto"}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={() => { setIsEditing(null); setFormData({ name: "", link: "", siteLink: "", description: "", stacks: "" }); }} className="rounded-full border border-white/10 bg-white/5 px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">
                                Cancelar
                            </button>
                        )}
                    </div>
                    {message && <p className="text-center text-[10px] font-bold uppercase tracking-widest text-(--color-accent)">{message}</p>}
                </form>
            </section>

            <section className="space-y-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Seus Projetos (Arraste para reordenar)</h2>
                <div className="grid gap-4">
                    {loading ? <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-2 border-(--color-accent) border-t-transparent" /></div>
                        : projects.length === 0 ? <p className="text-white/30 text-center py-10">Nenhum projeto ainda. Adicione acima!</p>
                            : projects.map((project, index) => (
                                <div key={project.id} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd} className={`group flex items-center justify-between gap-6 p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl transition-all cursor-move ${draggedIndex === index ? "opacity-30 scale-95" : "hover:border-(--color-accent)/30 hover:bg-white/10"}`}>
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-center gap-1 text-white/20 group-hover:text-(--color-accent)/50"><div className="h-1 w-4 rounded-full bg-current" /><div className="h-1 w-4 rounded-full bg-current" /><div className="h-1 w-4 rounded-full bg-current" /></div>
                                        <div><h3 className="font-bold text-white group-hover:text-(--color-accent)">{project.name}</h3><p className="text-xs text-white/40 line-clamp-1">{project.description}</p></div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => handleEdit(project)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white">✎</button>
                                        <button onClick={() => handleDelete(project.id)} className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500/60 hover:text-red-500">🗑</button>
                                    </div>
                                </div>
                            ))}
                </div>
            </section>
        </div>
    );
}

function SkillsAdmin() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState({ category: "", items: "" });
    const [message, setMessage] = useState("");
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => { fetchSkills(); }, []);

    async function fetchSkills() {
        try {
            const res = await fetch("/api/skills");
            if (res.ok) setSkills(await res.json());
        } finally { setLoading(false); }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const method = isEditing ? "PUT" : "POST";
        const body = JSON.stringify({
            id: isEditing || undefined,
            category: formData.category,
            items: formData.items,
        });

        const res = await fetch("/api/skills", { method, headers: { "Content-Type": "application/json" }, body });
        if (res.ok) {
            setMessage(isEditing ? "Habilidade atualizada! ✅" : "Habilidade adicionada! 🚀");
            setFormData({ category: "", items: "" });
            setIsEditing(null);
        } else {
            const err = await res.json();
            setMessage(`Erro: ${err.error || "Falha ao salvar"}`);
        }
        fetchSkills();
    };

    const handleEdit = (skill: Skill) => {
        setIsEditing(skill.id);
        setFormData({ category: skill.category, items: skill.items.join(", ") });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir?")) return;
        await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
        fetchSkills();
    };

    const handleDragStart = (index: number) => setDraggedIndex(index);
    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        const newItems = [...skills];
        const item = newItems.splice(draggedIndex, 1)[0];
        newItems.splice(index, 0, item);
        setSkills(newItems);
        setDraggedIndex(index);
    };
    const handleDragEnd = async () => {
        setDraggedIndex(null);
        await fetch("/api/skills", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reorder: true, skills }) });
    };

    return (
        <div className="space-y-12">
            <section className="rounded-[2.5rem] border border-white/5 bg-white/2 p-8 md:p-12 backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="grid gap-6">
                    <h2 className="text-lg font-bold text-white/60 mb-2 uppercase tracking-widest text-[10px]">
                        {isEditing ? "Editando Categoria" : "Nova Categoria"}
                    </h2>
                    <input required placeholder="Nome da Categoria (Ex: Front-end)" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm focus:border-(--color-accent)/50 outline-none" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                    <input required placeholder="Habilidades (separadas por vírgula)" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm focus:border-(--color-accent)/50 outline-none" value={formData.items} onChange={(e) => setFormData({ ...formData, items: e.target.value })} />
                    <div className="flex gap-4 pt-4">
                        <button type="submit" className="flex-1 rounded-full bg-(--color-accent) px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-black hover:scale-[1.02] active:scale-95 transition-all">
                            {isEditing ? "Salvar Alterações" : "Adicionar Categoria"}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={() => { setIsEditing(null); setFormData({ category: "", items: "" }); }} className="rounded-full border border-white/10 bg-white/5 px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">
                                Cancelar
                            </button>
                        )}
                    </div>
                    {message && <p className="text-center text-[10px] font-bold uppercase tracking-widest text-(--color-accent)">{message}</p>}
                </form>
            </section>

            <section className="space-y-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Categorias de Habilidades</h2>
                <div className="grid gap-4">
                    {loading ? <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-2 border-(--color-accent) border-t-transparent" /></div>
                        : skills.length === 0 ? <p className="text-white/30 text-center py-10">Nenhuma categoria ainda.</p>
                            : skills.map((skill, index) => (
                                <div key={skill.id} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd} className={`group flex items-center justify-between gap-6 p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl transition-all cursor-move ${draggedIndex === index ? "opacity-30 scale-95" : "hover:border-(--color-accent)/30 hover:bg-white/10"}`}>
                                    <div>
                                        <h3 className="font-bold text-white">{skill.category}</h3>
                                        <p className="text-xs text-white/40">{skill.items.join(" • ")}</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => handleEdit(skill)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white">✎</button>
                                        <button onClick={() => handleDelete(skill.id)} className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500/60 hover:text-red-500">🗑</button>
                                    </div>
                                </div>
                            ))}
                </div>
            </section>
        </div>
    );
}

function CertificatesAdmin() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState({ image: "", link: "", text: "" });
    const [message, setMessage] = useState("");
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { fetchCertificates(); }, []);

    async function fetchCertificates() {
        try {
            const res = await fetch("/api/certificates");
            if (res.ok) setCertificates(await res.json());
        } finally { setLoading(false); }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const method = isEditing ? "PUT" : "POST";
        const body = JSON.stringify({
            id: isEditing || undefined,
            image: formData.image,
            link: formData.link,
            text: formData.text,
        });

        const res = await fetch("/api/certificates", { method, headers: { "Content-Type": "application/json" }, body });
        if (res.ok) {
            setMessage(isEditing ? "Certificado atualizado! ✅" : "Certificado adicionado! 🚀");
            setFormData({ image: "", link: "", text: "" });
            setIsEditing(null);
        } else {
            const err = await res.json();
            setMessage(`Erro: ${err.error || "Falha ao salvar"}`);
        }
        fetchCertificates();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "link") => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formDataObj = new FormData();
        formDataObj.append("file", file);

        try {
            setMessage("Enviando arquivo...");
            const res = await fetch("/api/upload", { method: "POST", body: formDataObj });
            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, [field]: data.url }));
                setMessage("Arquivo carregado com sucesso! ✅");
            } else {
                setMessage("Erro ao enviar imagem. Vercel não permite upload real.");
            }
        } catch {
            setMessage("Erro no upload");
        }
    };

    const handleEdit = (cert: Certificate) => {
        setIsEditing(cert.id);
        setFormData({ image: cert.image, link: cert.link || "", text: cert.text });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir?")) return;
        await fetch(`/api/certificates?id=${id}`, { method: "DELETE" });
        fetchCertificates();
    };

    const handleDragStart = (index: number) => setDraggedIndex(index);
    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        const newItems = [...certificates];
        const item = newItems.splice(draggedIndex, 1)[0];
        newItems.splice(index, 0, item);
        setCertificates(newItems);
        setDraggedIndex(index);
    };
    const handleDragEnd = async () => {
        setDraggedIndex(null);
        await fetch("/api/certificates", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reorder: true, certificates }) });
    };

    return (
        <div className="space-y-12">
            <section className="rounded-[2.5rem] border border-white/5 bg-white/2 p-8 md:p-12 backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="grid gap-6">
                    <h2 className="text-lg font-bold text-white/60 mb-2 uppercase tracking-widest text-[10px]">
                        {isEditing ? "Editando Certificado" : "Novo Certificado"}
                    </h2>

                    <div className="relative">
                        <input required placeholder="URL ou Upload do Certificado (PDF/PNG)" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 pr-12 text-sm focus:border-(--color-accent)/50 outline-none transition-all" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-(--color-accent) transition-colors" title="Ou faça upload do documento completo">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(e, 'link')} />
                    </div>

                    <div className="relative">
                        <input required placeholder="Imagem de Capa (Exibida no Card)" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 pr-12 text-sm focus:border-(--color-accent)/50 outline-none transition-all" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                        <button type="button" onClick={() => imageInputRef.current?.click()} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-(--color-accent) transition-colors" title="Ou faça upload de uma imagem de capa">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </button>
                        <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
                    </div>

                    <input required placeholder="Nome do Certificado" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm focus:border-(--color-accent)/50 outline-none" value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} />
                    <div className="flex gap-4 pt-4">
                        <button type="submit" className="flex-1 rounded-full bg-(--color-accent) px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-black hover:scale-[1.02] active:scale-95 transition-all">
                            {isEditing ? "Salvar Alterações" : "Adicionar Certificado"}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={() => { setIsEditing(null); setFormData({ image: "", link: "", text: "" }); }} className="rounded-full border border-white/10 bg-white/5 px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">
                                Cancelar
                            </button>
                        )}
                    </div>
                    {message && <p className="text-center text-[10px] font-bold uppercase tracking-widest text-(--color-accent)">{message}</p>}
                </form>
            </section>

            <section className="space-y-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Certificados</h2>
                <div className="grid gap-4">
                    {loading ? <div className="flex justify-center py-10"><div className="h-8 w-8 animate-spin rounded-full border-2 border-(--color-accent) border-t-transparent" /></div>
                        : certificates.length === 0 ? <p className="text-white/30 text-center py-10">Nenhum certificado ainda.</p>
                            : certificates.map((cert, index) => (
                                <div key={cert.id} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd} className={`group flex items-center justify-between gap-6 p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl transition-all cursor-move ${draggedIndex === index ? "opacity-30 scale-95" : "hover:border-(--color-accent)/30 hover:bg-white/10"}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-12 bg-black overflow-hidden rounded"><img src={cert.image} alt={cert.text} className="w-full h-full object-cover" /></div>
                                        <h3 className="font-bold text-white">{cert.text}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => handleEdit(cert)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white">✎</button>
                                        <button onClick={() => handleDelete(cert.id)} className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500/60 hover:text-red-500">🗑</button>
                                    </div>
                                </div>
                            ))}
                </div>
            </section>
        </div>
    );
}
