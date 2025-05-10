import Parser from 'rss-parser';
import { createClient } from '@/utils/supabase/server';

export type News = {
  id: number;
  title: string;
  press: string;
  url: string;
  created_at: string;
  image: string | null;
  keyword: string;
};

const RSS_URLS = [
  'https://www.yna.co.kr/rss/news.xml',
  'https://www.yna.co.kr/rss/economy.xml',
  'https://www.yna.co.kr/rss/politics.xml',
  'https://www.yna.co.kr/rss/society.xml'
];

const keywords = [
  '화재', '사고', '집회', '실종',
  '폭행', '범죄', '도난', '절도',
  '강도', '추락', '붕괴', '지진',
  '폭우', '산사태', '침수'
];

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      'description',
      'content'
    ]
  }
});

function extractImageUrl(item: any): string | null {
  if (item.mediaContent?.[0]?.$.url) {
    return item.mediaContent[0].$.url;
  }
  const content = item.description || item.content || '';
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : null;
}

export function formatRelativeTimeKST(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return `${diffDay}일 전`;
}

export async function fetchAndStoreNews(): Promise<void> {
  try {
    const supabase = await createClient();
    let allNewsItems: any[] = [];

    for (const url of RSS_URLS) {
      const feed = await parser.parseURL(url);
      console.log(`📡 ${url} RSS 뉴스 개수:`, feed.items.length);

      const newsItems = feed.items
        .filter(item => {
          const title = item.title || '';
          return keywords.some(keyword => title.includes(keyword));
        })
        .map(item => {
          const imageUrl = extractImageUrl(item);
          const keyword = keywords.find(kw => item.title?.includes(kw)) || '';

          return {
            title: item.title?.replace(/\[\[CDATA\[|\]\]/g, '').trim() || '',
            press: '연합뉴스',
            url: item.link || '',
            created_at: new Date(item.pubDate || '').toISOString(),
            image: imageUrl,
            keyword
          };
        });

      allNewsItems = [...allNewsItems, ...newsItems];
    }

    console.log("📰 전체 필터링된 뉴스 개수:", allNewsItems.length);
    if (allNewsItems.length === 0) {
      console.warn("⚠️ 필터링된 뉴스가 없습니다.");
      return;
    }

    // ✅ url 기준 중복 제거
    const uniqueNewsItems = Array.from(
      new Map(allNewsItems.map(item => [item.url, item])).values()
    );

    console.log("📦 삽입 직전 뉴스 샘플:", JSON.stringify(uniqueNewsItems[0], null, 2));

    const { error } = await supabase
      .from('news')
      .upsert(uniqueNewsItems, { onConflict: 'url' });

    if (error) {
      console.error('🚨 Supabase 뉴스 저장 에러:', error);
    } else {
      console.log('✅ 뉴스가 성공적으로 저장되었습니다!');
    }

  } catch (error) {
    console.error('❌ RSS 피드 파싱 에러:', error);
  }
}