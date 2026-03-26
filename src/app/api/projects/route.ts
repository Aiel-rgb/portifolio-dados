import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/projects.json");

function readProjects() {
    try {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeProjects(projects: Record<string, unknown>[]) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");
        return true;
    } catch {
        // Vercel: filesystem read-only — falha silenciosamente
        return false;
    }
}

export async function GET() {
    const projects = readProjects();
    return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.name || !body.github_link || !body.description) {
        return NextResponse.json({ error: "Campos obrigatórios." }, { status: 400 });
    }

    const projects = readProjects();
    const newProject = {
        id: crypto.randomUUID(),
        name: String(body.name),
        github_link: String(body.github_link),
        site_link: body.site_link ? String(body.site_link) : undefined,
        description: String(body.description),
        stacks: String(body.stacks ?? ""),
    };

    projects.push(newProject);
    const ok = writeProjects(projects);

    if (!ok) {
        return NextResponse.json({ error: "Filesystem read-only. Use localmente." }, { status: 500 });
    }

    return NextResponse.json(newProject, { status: 201 });
}

export async function PUT(req: NextRequest) {
    const body = await req.json();

    if (body.reorder && Array.isArray(body.projects)) {
        const ok = writeProjects(body.projects);
        if (!ok) return NextResponse.json({ error: "Filesystem read-only." }, { status: 500 });
        return NextResponse.json({ message: "Reordenado." });
    }

    if (!body.id) {
        return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });
    }

    const projects = readProjects();
    const idx = projects.findIndex((p: Record<string, string>) => p.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });

    projects[idx] = {
        ...projects[idx],
        name: body.name ?? projects[idx].name,
        github_link: body.github_link ?? projects[idx].github_link,
        site_link: body.site_link ?? projects[idx].site_link,
        description: body.description ?? projects[idx].description,
        stacks: body.stacks ?? projects[idx].stacks,
    };

    const ok = writeProjects(projects);
    if (!ok) return NextResponse.json({ error: "Filesystem read-only." }, { status: 500 });
    return NextResponse.json(projects[idx]);
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });

    const projects = readProjects();
    const filtered = projects.filter((p: Record<string, string>) => p.id !== id);
    if (filtered.length === projects.length) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });

    const ok = writeProjects(filtered);
    if (!ok) return NextResponse.json({ error: "Filesystem read-only." }, { status: 500 });
    return NextResponse.json({ message: "Excluído." });
}
