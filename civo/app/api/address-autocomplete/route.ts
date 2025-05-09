// app/api/address-autocomplete/route.ts (Next.js App Router 기준)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query');

    if (!query) {
        return NextResponse.json({ results: [] }, { status: 400 });
    }

    const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_MAP_CLIENT_ID;
    const NAVER_CLIENT_SECRET = process.env.NEXT_PUBLIC_MAP_CLIENT_SECRET;

    const url = `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(query)}`;

    try {
        const res = await fetch(url, {
            headers: {
                'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID!,
                'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET!,
            },
        });

        if (!res.ok) {
            console.error("네이버 API 요청 실패:", res.status, await res.text());
            return NextResponse.json({ results: [], error: `API 요청 실패: ${res.status}` }, { status: res.status });
        }

        const data = await res.json();

        // 주소 결과 가공
        const results = data.addresses?.map((addr: any) => ({
            address: addr.roadAddress || addr.jibunAddress,
            lat: parseFloat(addr.y),
            lng: parseFloat(addr.x),
        })) || [];
        
        return NextResponse.json({ results });
    } catch (error) {
        console.error("네이버 API 요청 중 예외 발생:", error);
        return NextResponse.json({ results: [], error: "API 호출 오류" }, { status: 500 });
    }
}
