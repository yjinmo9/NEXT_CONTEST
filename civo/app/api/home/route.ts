import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  try {
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // ✅ 필터링 로직
    const filtered = reports.filter((item) => {
      const isMissing = item.type === 'missing';
      const isNearby = item.distance_m !== null && item.distance_m <= 100;
      return isMissing || isNearby;
    });

    // ✅ 디버깅 출력
    console.log('📦 원본 reports 개수:', reports.length);
    console.log('📍 필터링된 reports 개수:', filtered.length);

    return NextResponse.json({ 
      reports: filtered,
      message: '지도 렌더링용 제보 데이터 반환 성공'
    });

  } catch (error) {
    console.error('❌ 제보 조회 오류:', error);
    return NextResponse.json(
      { error: '데이터를 가져오는데 실패했습니다.' }, 
      { status: 500 }
    );
  }
}







