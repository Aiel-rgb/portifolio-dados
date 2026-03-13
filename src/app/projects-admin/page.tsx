"use client";

import { FormEvent, useState } from "react";

type FormState = {
  name: string;
  link: string;
  description: string;
  stacks: string;
};

export default function ProjectsAdminPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    link: "",
    description: "",
    stacks: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error ?? "Erro ao salvar projeto");
      }

      setForm({
        name: "",
        link: "",
        description: "",
        stacks: "",
      });
      setMessage("Projeto cadastrado com sucesso! Ele já aparece na home.");
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Erro inesperado ao salvar.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/80 p-8 shadow-xl shadow-black/40 backdrop-blur">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Área de projetos
            </p>
            <h1 className="mt-1 text-2xl font-semibold">
              Cadastrar novo projeto
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Preencha os campos abaixo para adicionar um novo card na página
              principal do portfólio.
            </p>
          </div>
          <a
            href="/"
            className="rounded-full border border-[var(--color-border-subtle)] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
          >
            Voltar para o portfólio
          </a>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]"
            >
              Nome do projeto
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm outline-none ring-0 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
              placeholder="Ex: Análise de Vendas"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="link"
              className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]"
            >
              Link do projeto
            </label>
            <input
              id="link"
              type="url"
              required
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm outline-none ring-0 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
              placeholder="URL do GitHub, Kaggle, portfólio etc."
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]"
            >
              Descrição
            </label>
            <textarea
              id="description"
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="min-h-[120px] w-full resize-none rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm outline-none ring-0 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
              placeholder="Explique em poucas linhas o objetivo do projeto e os principais resultados."
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="stacks"
              className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]"
            >
              Stacks usadas
            </label>
            <input
              id="stacks"
              type="text"
              value={form.stacks}
              onChange={(e) => setForm({ ...form, stacks: e.target.value })}
              className="w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm outline-none ring-0 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
              placeholder="Ex: Python, pandas, numpy, matplotlib, scikit-learn, BI"
            />
            <p className="text-xs text-[var(--color-text-muted)]">
              Separe as tecnologias por vírgula. Elas aparecerão em forma de
              chips no card.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4">
            <p className="text-xs text-[var(--color-text-muted)]">
              Os projetos são mantidos em memória apenas enquanto o servidor
              estiver rodando. Para produção, é recomendável usar um banco de
              dados.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-bg)] shadow-lg shadow-[var(--color-accent)]/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Salvando..." : "Salvar projeto"}
            </button>
          </div>

          {message && (
            <p className="pt-2 text-sm text-[var(--color-text-muted)]">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

