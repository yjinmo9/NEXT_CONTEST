import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  console.log("🔍 알림 API 요청 시작");

  // ❶ 뉴스 가져오기
  const { data: news, error: newsError } = await supabase
    .from('news')
    .select('id, title, url, image, keyword, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (newsError) {
    console.error("🚨 뉴스 조회 실패:", newsError.message);
  } else {
    console.log("✅ 뉴스 5개 불러옴:", news);
  }

  // ❷ 게시물 가져오기
  const { data: reports, error: reportsError } = await supabase
    .from('reports')
    .select('id, title, type, media_urls, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (reportsError) {
    console.error("🚨 제보글 조회 실패:", reportsError.message);
  } else {
    console.log("✅ 제보글 5개 불러옴:", reports);
  }

  // 에러 응답
  if (newsError || reportsError) {
    return NextResponse.json(
      { error: newsError?.message || reportsError?.message },
      { status: 500 }
    );
  }

  // ❸ 뉴스 데이터 정제
  const mappedNews = (news || []).map((n: { id: any; title: any; url: any; image: any; keyword: any; created_at: any; }) => ({
    source: 'news' as const,
    id: n.id,
    title: n.title,
    link_url: n.url,
    image: n.image,
    keyword: n.keyword,
    created_at: n.created_at,
  }));

  // ❹ 제보글 데이터 정제
  const mappedReports = (reports || []).map((r: { id: any; title: any; type: any; media_urls: string | any[]; created_at: any; }) => ({
    source: 'report' as const,
    id: r.id,
    title: r.title,
    type: r.type,
    image: Array.isArray(r.media_urls) && r.media_urls.length > 0 ? r.media_urls[0] : null,
    created_at: r.created_at,
  }));

  // ❺ 병합 + 정렬
  const combined = [...mappedNews, ...mappedReports]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  console.log("📦 최종 알림 리스트:", combined);

  return NextResponse.json({ notifications: combined });
}
