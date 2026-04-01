import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/certificates.json");

function readCertificates() {
    try {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeCertificates(certificates: Record<string, unknown>[]) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(certificates, null, 2), "utf-8");
        return true;
    } catch {
        return false;
    }
}

export async function GET() {
    const certificates = readCertificates();
    return NextResponse.json(certificates);
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.image || !body.text) {
        return NextResponse.json({ error: "Campos obrigatórios." }, { status: 400 });
    }

    const certificates = readCertificates();
    const newCertificate = {
        id: crypto.randomUUID(),
        image: String(body.image),
        text: String(body.text),
    };

    certificates.push(newCertificate);
    const ok = writeCertificates(certificates);

    if (!ok) {
        return NextResponse.json({ error: "Filesystem read-only. Use localmente." }, { status: 500 });
    }

    return NextResponse.json(newCertificate, { status: 201 });
}

export async function PUT(req: NextRequest) {
    const body = await req.json();

    if (body.reorder && Array.isArray(body.certificates)) {
        const ok = writeCertificates(body.certificates);
        if (!ok) return NextResponse.json({ error: "Filesystem read-only." }, { status: 500 });
        return NextResponse.json({ message: "Reordenado." });
    }

    if (!body.id) {
        return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });
    }

    const certificates = readCertificates();
    const idx = certificates.findIndex((c: Record<string, string>) => c.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });

    certificates[idx] = {
        ...certificates[idx],
        image: body.image ?? certificates[idx].image,
        text: body.text ?? certificates[idx].text,
    };

    const ok = writeCertificates(certificates);
    if (!ok) return NextResponse.json({ error: "Filesystem read-only." }, { status: 500 });
    return NextResponse.json(certificates[idx]);
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });

    const certificates = readCertificates();
    const filtered = certificates.filter((c: Record<string, string>) => c.id !== id);
    if (filtered.length === certificates.length) return NextResponse.json({ error: "Não encontrado." }, { status: 404 });

    const ok = writeCertificates(filtered);
    if (!ok) return NextResponse.json({ error: "Filesystem read-only." }, { status: 500 });
    return NextResponse.json({ message: "Excluído." });
}
