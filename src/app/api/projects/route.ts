import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PROJECTS_FILE = path.join(process.cwd(), "src/data/projects.ts");

function readProjects() {
    try {
        const content = fs.readFileSync(PROJECTS_FILE, "utf-8");
        // Extract the array from the TS file using regex
        const match = content.match(/export const PROJECTS:\s*Project\[\]\s*=\s*(\[[\s\S]*?\]);/);
        if (!match) return [];
        // Use Function constructor to parse the array literal
        const parsed = new Function(`return ${match[1]}`)();
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeProjects(projects: Array<Record<string, string | undefined>>) {
    const entries = projects
        .map((p) => {
            const siteField = p.site_link ? `\n    site_link: ${JSON.stringify(p.site_link)},` : "";
            return `  {
    id: ${JSON.stringify(p.id)},
    name: ${JSON.stringify(p.name)},
    github_link: ${JSON.stringify(p.github_link)},${siteField}
    description: ${JSON.stringify(p.description)},
    stacks: ${JSON.stringify(p.stacks)},
  }`;
        })
        .join(",\n");

    const fileContent = `export type Project = {
  id: string;
  name: string;
  github_link: string;
  site_link?: string;
  description: string;
  stacks: string;
};

/**
 * Array estático de projetos.
 * Gerenciado via /admin
 */
export const PROJECTS: Project[] = [
${entries}${entries ? "," : ""}
];
`;

    fs.writeFileSync(PROJECTS_FILE, fileContent, "utf-8");
}

export async function GET() {
    const projects = readProjects();
    return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.name || !body.github_link || !body.description) {
        return NextResponse.json({ error: "Campos obrigatórios não preenchidos." }, { status: 400 });
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
    writeProjects(projects);

    return NextResponse.json(newProject, { status: 201 });
}

export async function PUT(req: NextRequest) {
    const body = await req.json();

    if (body.reorder && Array.isArray(body.projects)) {
        writeProjects(body.projects);
        return NextResponse.json({ message: "Reordenado com sucesso." });
    }

    if (!body.id) {
        return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });
    }

    const projects = readProjects();
    const index = projects.findIndex((p: Record<string, string>) => p.id === body.id);
    if (index === -1) {
        return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
    }

    projects[index] = {
        ...projects[index],
        name: body.name ?? projects[index].name,
        github_link: body.github_link ?? projects[index].github_link,
        site_link: body.site_link ?? projects[index].site_link,
        description: body.description ?? projects[index].description,
        stacks: body.stacks ?? projects[index].stacks,
    };

    writeProjects(projects);
    return NextResponse.json(projects[index]);
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });
    }

    const projects = readProjects();
    const filtered = projects.filter((p: Record<string, string>) => p.id !== id);

    if (filtered.length === projects.length) {
        return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
    }

    writeProjects(filtered);
    return NextResponse.json({ message: "Excluído com sucesso." });
}
