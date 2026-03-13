import { NextRequest, NextResponse } from "next/server";

export type Project = {
  id: number;
  name: string;
  link: string;
  siteLink?: string;
  description: string;
  stacks: string;
};

// Armazena projetos em memória enquanto o servidor estiver rodando.
// Para produção, substitua por um banco de dados real.
let projects: Project[] = [
  {
    id: 1,
    name: "Análise Exploratória Netflix",
    link: "https://github.com/Aiel-rgb/netflix-analysis",
    description:
      "Exploração do catálogo da Netflix utilizando Python, Pandas e Matplotlib para identificar tendências de crescimento e gêneros dominantes.",
    stacks: "Python, Pandas, Matplotlib",
  },
  {
    id: 2,
    name: "PITON - AI Coder",
    link: "https://github.com/Aiel-rgb/piton-ai-coder",
    siteLink: "https://aiel-rgb-piton-coder-ia-coder-qklja7.streamlit.app/",
    description:
      "Assistente de IA especializado em Python construído com Streamlit e Groq API para auxílio em debugging e boas práticas de código.",
    stacks: "Python, Streamlit, Groq API, AI",
  },
];

export async function GET() {
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.link || !body.description) {
    return NextResponse.json(
      { error: "Campos obrigatórios não preenchidos." },
      { status: 400 },
    );
  }

  const newProject: Project = {
    id: Date.now(),
    name: String(body.name),
    link: String(body.link),
    siteLink: body.siteLink ? String(body.siteLink) : undefined,
    description: String(body.description),
    stacks: String(body.stacks ?? ""),
  };

  projects = [newProject, ...projects];

  return NextResponse.json(newProject, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  if (body.reorder) {
    projects = body.projects;
    return NextResponse.json(projects);
  }

  const index = projects.findIndex((p) => p.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
  }

  projects[index] = { ...projects[index], ...body };
  return NextResponse.json(projects[index]);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });
  }

  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
  }

  projects.splice(index, 1);
  return NextResponse.json({ message: "Projeto excluído com sucesso." });
}

