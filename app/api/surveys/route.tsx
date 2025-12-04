import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";


export async function GET() {
  // hapus baris itu, karena supabase sudah di-import langsung


  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
