import { NextRequest } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return new Response(JSON.stringify({ error: '좌표가 부족합니다.' }), { status: 400 });
  }

  try {
    const response = await axios.get(
      'https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc',
      {
        params: {
          coords: `${lat},${lon}`, // 반드시 x(경도),y(위도)
          output: 'json',
          orders: 'roadaddr',
        },
        headers: {
          'X-NCP-APIGW-API-KEY-ID': process.env.NEXT_PUBLIC_MAP_CLIENT_ID!,
          'X-NCP-APIGW-API-KEY': process.env.NEXT_PUBLIC_MAP_CLIENT_SECRET!,
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[NAVER REVERSE GEO ERROR]', error.response?.data || error.message);
    return new Response(JSON.stringify({
      error: 'NAVER API 호출 실패',
      details: error.response?.data || error.message,
    }), { status: 500 });
  }
}
