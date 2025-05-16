import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reports')
    .select('id, title, content, created_at, media_urls, type')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  console.log("🔥 최신 제보:", data);
  console.log("⚠️ 에러:", error);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ message: "No report found." });
  }

  return NextResponse.json({ latest: data });
}
