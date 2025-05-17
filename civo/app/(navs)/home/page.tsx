'use client';

import Image from 'next/image';
import Navermap from "@/components/home/navermap";
import searchGlyphImg from '@/src/img/Search Glyph.png';
import Latest from '@/components/home/Latest';
import { useEffect, useState } from 'react';
import Preview from '@/components/home/Preview';

type Report = {
    id?: string;
    type: string;
    report_lat: number;
    report_lng: number;
    distance_m?: number | null;
    title?: string;
    category?: string;
    media_url: string;
    created_at: string;
    content?: string;
    user_id?: string;
    views: number;
};


function mapToReport(raw: any): Report {
  const lat = raw.report_lat ?? raw.missing_lat;
  const lng = raw.report_lng ?? raw.missing_lng;

  return {
    id: raw.id,
    type: raw.type,
    report_lat: lat,
    report_lng: lng,
    distance_m: raw.distance_m ?? null,
    title: raw.title,
    category: raw.category,
    media_url: raw.media_urls?.[0] || "",
    created_at: raw.created_at,
    content: raw.content,
    user_id: raw.user_id,
    views: raw.views ?? 0,
  };
}


export default function HomePage() {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedReport, setSelectedReport] = useState<any>(null);

  const handleSelect = async (suggestion: any) => {
    const result = await fetch(`/api/home/reportGet?id=${suggestion.id}`)
    const report = await result.json()

    console.log(mapToReport(report))

    setSelectedReport(mapToReport(report))
    setShowSuggestions(false)
    setQuery('')
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query?.length > 1) {
        // 게시글 자동완성 API 호출
        fetch(`/api/home/search?keyword=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((data) => {

            const results = data.reports.map((item: any) => ({
              title: item.title,
              created_at: item.created_at,
              id: item.id,
            }));
            console.log(results)
            setSuggestions(results);
            setShowSuggestions(true);
          });
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className='relative w-full h-full overflow-hidden px-[20px] z-20'>
      {/* 🗺️ 지도 컴포넌트에 reports 전달 */}
      <div className="fixed inset-0 z-0">
        <Navermap onSelectReport={setSelectedReport}/>
      </div>

      {/* 🔍 검색창 */}
      {showSuggestions && (
        <div className="absolute inset-0 bg-white pointer-events-auto" />
      )}
      <div
        id="searchfield"
        className={`fixed inset-0 mt-[108px] mx-[10px] pt-[8px] pb-[7px] pl-[8px] pr-[8px] h-[36px] z-50 ${showSuggestions ? "bg-gray-100" : "bg-white"} rounded-[10px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)] flex gap-[8px] pointer-events-auto`}
      >
        <Image src={searchGlyphImg} alt="돋보기" width={21} height={19} />
        <input
          type="text"
          placeholder="사건 검색"
          className={`w-full text-[13px] ${showSuggestions ? "bg-gray-100" : "bg-white"}`}
          value={query}
          onChange={(e) => { setShowSuggestions(true); setQuery(e.target.value ?? ''); }}
        />{
          query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute mb-[10px] right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          )
        }
      </div>
      {showSuggestions && (
        <div className="fixed inset-0 mt-[175px] mx-[15px] z-60 rounded-t-10px text-gray-600 flex flex-col bg-white">
          <div className="px-[10px] text-[15px] font-semibold">추천</div>
          <ul className="px-[10px] bg-white w-full mt-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-[5px] hover:bg-gray-100 cursor-pointer h-[22px] w-full text-[15px] rounded-[5px] flex gap-[5px]"
                onClick={() => handleSelect(suggestion)}
              >
                <Image src={searchGlyphImg} alt="돋보기" width={13.5} height={12} className="py-[4px]" />
                {suggestion.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 최신 이슈글 */}
      {selectedReport ? (
        <div className="fixed bottom-[12vh] inset-x-0 z-50 px-4 pb-4 pointer-events-none">
          <Preview report={selectedReport} handleClose={setSelectedReport} />
        </div>
      ) : (
        <div className="fixed bottom-[12vh] inset-x-0 z-20 px-4 pb-4 pointer-events-none">
          <Latest />
        </div>
      )}
    </div>
  );
}
