import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/skills.json");

function readSkills() {
    try {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeSkills(skills: Record<string, unknown>[]) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(skills, null, 2), "utf-8");
        return true;
    } catch {
        return false;
    }
}

export async function GET() {
    const skills = readSkills();
    return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.category || !body.items) {
        return NextResponse.json({ error: "Campos obrigatórios." }, { status: 400 });
    }

    const skills = readSkills();
    const newSkill = {
        id: crypto.randomUUID(),
        category: String(body.category),
        items: Array.isArray(body.items) ? body.items : String(body.items).split(",").map(s => s.trim()),
    };

    skills.push(newSkill);
    const ok = writeSkills(skills);

    if (!ok) {
        return NextResponse.json({ error: "Filesystem read-only. Use localmente." }, { status: 500 });
    }

    return NextResponse.json(newSkill, { status: 201 });
}

export async function PUT(req: NextRequest) {
    const body = await req.json();

    if (body.reorder && Array.isArray(body.skills)) {
        const ok = writeSkills(body.skills);
        if (!ok) return NextResponse.json({ error: "Filesystem read-only." }, { status: 500 });
        return NextResponse.json({ message: "Reordenado." });
    }

    if (!body.id) {
        return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });
    }

    const skills = readSkills();
    const idx = skills.findIndex((s: Record<string, string>) => s.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });

    skills[idx] = {
        ...skills[idx],
        category: body.category ?? skills[idx].category,
        items: body.items ? (Array.isArray(body.items) ? body.items : String(body.items).split(",").map(s => s.trim())) : skills[idx].items,
    };

    const ok = writeSkills(skills);
    if (!ok) return NextResponse.json({ error: "Filesystem read-only." }, { status: 500 });
    return NextResponse.json(skills[idx]);
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });

    const skills = readSkills();
    const filtered = skills.filter((s: Record<string, string>) => s.id !== id);
    if (filtered.length === skills.length) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });

    const ok = writeSkills(filtered);
    if (!ok) return NextResponse.json({ error: "Filesystem read-only." }, { status: 500 });
    return NextResponse.json({ message: "Excluído." });
}
