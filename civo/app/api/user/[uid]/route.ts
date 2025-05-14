import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { uid: string } }) {
  const supabase = await createClient();
  const uid = params.uid;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", uid)
    .single();

  if (error) {
    console.error("유저 조회 에러:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
