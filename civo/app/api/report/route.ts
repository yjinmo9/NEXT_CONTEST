export const runtime = 'nodejs'; // 👈 이거 추가
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ✅ 사용자 위치와 신고 위치 간 거리 계산 함수 (Haversine 공식 사용)
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // 지구 반지름 (미터 단위)
  const toRad = (deg: number) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function POST(request: Request) {
  const supabase = await createClient(); // Supabase 클라이언트 생성
  const body = await request.json();     // 요청 본문 파싱

  // ✅ 요청에서 필요한 필드 추출
  const {
    user_id,
    type,               // 'incident' | 'damage' | 'missing'
    title,
    content, // 신고 내용
    category, // 신고 카테고리
    media_urls, // 신고 이미지 주소
    user_lat, // 신고자 위도
    user_lng, // 신고자 경도
    report_lat, // 신고 위도
    report_lng, // 신고 경도
    // 실종 제보 전용 필드
    missing_name, // 실종자 이름  
    missing_age, // 실종자 나이
    missing_gender, // 실종자 성별
    missing_lat, // 실종자 위도
    missing_lng, // 실종자 경도
  } = body;

  // ✅ 필수값 유효성 검사
  if (
    !user_id || !type || !title || !content ||
    user_lat == null || user_lng == null ||
    report_lat == null || report_lng == null
  ) {
    return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 });
  }

  // ✅ 사용자 위치와 신고 위치 간 거리 계산 (미터 단위)
  const distance_m = getDistanceInMeters(user_lat, user_lng, report_lat, report_lng);
  console.log('Calculated distance:', distance_m);

  // ✅ 저장할 데이터 구성
  const reportData: any = {
    user_id,
    type,
    title,
    content,
    category: type === 'missing' ? '실종' : category || null, // ✅ 이 라인!
    media_urls: media_urls || [],
    user_lat,
    user_lng,
    report_lat,
    report_lng,
    distance_m,
    status: 'pending',
  };
  console.log('Report data to insert:', reportData);

  // ✅ 실종 제보의 경우, 추가 정보 저장
  if (type === 'missing') {
    reportData.missing_name = missing_name || null;
    reportData.missing_age = missing_age || null;
    reportData.missing_gender = missing_gender || null;
    reportData.missing_lat = missing_lat || null;
    reportData.missing_lng = missing_lng || null;
  }

  // ✅ Supabase에 삽입
  const { data, error } = await supabase
    .from('reports')
    .insert([reportData])
    .select(); // 삽입 후 결과 반환

  if (error) {
    console.error('제보 삽입 오류:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: '제보 등록 성공', data }, { status: 201 });
}