import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Clean filename and add timestamp to avoid collisions
        const cleanName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
        const filename = `${Date.now()}-${cleanName}`;

        const dir = path.join(process.cwd(), "public", "certificados");

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(path.join(dir, filename), buffer);

        return NextResponse.json({ url: `/certificados/${filename}` }, { status: 201 });
    } catch (e) {
        console.error("Upload error:", e);
        // Em produção no Vercel isso falhará devido a Read-only filesystem
        return NextResponse.json({ error: "Falha ao enviar arquivo (Vercel é Read-only?)" }, { status: 500 });
    }
}
