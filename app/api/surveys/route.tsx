import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseClient";

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
