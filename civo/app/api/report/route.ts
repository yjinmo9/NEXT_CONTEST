import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  
  // 요청 본문에서 데이터 가져오기
  const { title, content } = await request.json();

  // 데이터베이스에 제목과 내용 추가
  const { data, error } = await supabase
    .from("reports") // "reports" 테이블에 데이터 추가
    .insert([{ title, content }]); // 제목과 내용을 포함한 객체를 삽입

  // 에러 처리
  if (error) {
    console.error("데이터 삽입 오류:", error.message); // 에러 로그 추가
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // 성공적으로 데이터가 추가되면 응답
  return NextResponse.json({ message: "Report created successfully!" }, { status: 201 });
}