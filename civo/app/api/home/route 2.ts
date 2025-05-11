import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  
  // 3일 전 날짜 계산
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  try {
    // reports 테이블에서 최근 3일간의 데이터 조회
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*')
      .gte('created_at', threeDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      reports,
      message: '최근 3일간의 게시글을 성공적으로 가져왔습니다.' 
    });

  } catch (error) {
    console.error('데이터 조회 오류:', error);
    return NextResponse.json(
      { error: '데이터를 가져오는데 실패했습니다.' }, 
      { status: 500 }
    );
  }
}