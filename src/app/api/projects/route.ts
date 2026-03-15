import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export type Project = {
  id: string; // UUID is a string
  name: string;
  github_link: string;
  site_link?: string;
  description: string;
  stacks: string;
  display_order: number;
};

export async function GET() {
  console.log("API: GET /api/projects starting...");
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("API: GET /api/projects error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`API: GET /api/projects success. Count: ${data?.length}`);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("API: POST /api/projects starting with body:", body);

  if (!body.name || !body.link || !body.description) {
    console.warn("API: POST /api/projects missing fields.");
    return NextResponse.json(
      { error: "Campos obrigatórios não preenchidos." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        name: String(body.name),
        github_link: String(body.link),
        site_link: body.siteLink ? String(body.siteLink) : null,
        description: String(body.description),
        stacks: String(body.stacks ?? ""),
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("API: POST /api/projects error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("API: POST /api/projects success:", data.id);
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  console.log("API: PUT /api/projects starting with body:", body);

  if (body.reorder) {
    console.log("API: PUT /api/projects - Reordering projects.");
    // Assuming body.projects is an array of projects with updated display_order
    const updates = body.projects.map((project: any, index: number) => ({
      id: project.id,
      display_order: index, // Or whatever logic determines the new order
    }));

    const { error } = await supabase
      .from("projects")
      .upsert(updates, { onConflict: 'id' });

    if (error) {
      console.error("API: PUT /api/projects reorder error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.log("API: PUT /api/projects reorder success.");
    return NextResponse.json({ message: "Projects reordered successfully." });
  }

  if (!body.id) {
    console.warn("API: PUT /api/projects missing ID for update.");
    return NextResponse.json({ error: "ID do projeto não fornecido." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("projects")
    .update({
      name: body.name,
      github_link: body.link,
      site_link: body.siteLink,
      description: body.description,
      stacks: body.stacks,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    console.error("API: PUT /api/projects update error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    console.warn(`API: PUT /api/projects project with ID ${body.id} not found.`);
    return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
  }

  console.log(`API: PUT /api/projects success for ID: ${data.id}`);
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  console.log(`API: DELETE /api/projects starting for ID: ${id}`);

  if (!id) {
    console.warn("API: DELETE /api/projects missing ID.");
    return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("API: DELETE /api/projects error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Check if any row was actually deleted (Supabase delete doesn't return data directly)
  // A more robust check would be to try fetching before deleting, or rely on error object.
  // For now, assuming no error means success.
  console.log(`API: DELETE /api/projects success for ID: ${id}`);
  return NextResponse.json({ message: "Projeto excluído com sucesso." });
}

