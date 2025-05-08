import axios from 'axios';

export type News = {
  id: number;
  title: string;
  press: string;
  url: string;
  created_at: string;
  image: string;
};

const keywords = ['화재', '사고', '집회', '실종'];

const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;
const NEWSDATA_API_URL = 'https://newsdata.io/api/1/news';

export async function fetchGoogleNewsAll(): Promise<News[]> {
  const allNews: News[] = [];
  let idCounter = 1;

  for (const keyword of keywords) {
    const newsItems = await fetchNewsData(keyword, idCounter);
    allNews.push(...newsItems);
    idCounter += newsItems.length;
  }

  return allNews;
}

async function fetchNewsData(keyword: string, startId = 1): Promise<News[]> {
  try {
    const response = await axios.get(NEWSDATA_API_URL, {
      params: {
        apikey: NEWSDATA_API_KEY,
        q: keyword,
        language: 'ko',
        country: 'kr',
        category: 'top',
      },
    });

    const items = response.data.results || [];

    return items.map((item: any, idx: number) => ({
      id: startId + idx,
      title: item.title,
      press: item.source_id || '언론사 미상',
      url: item.link,
      created_at: formatRelativeTimeKST(item.pubDate),
      image: item.image_url || null,
    }));
  } catch (error) {
    console.error('NewsData.io API Error:', error);
    return [];
  }
}

export function formatRelativeTimeKST(dateString: string | Date): string {
  const utcDate = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(utcDate.getTime())) return '';

  const now = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
  const kstTime = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

  const diffMs = now.getTime() - kstTime.getTime();
  if (diffMs < 0) return '방금 전';

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return `${diffSec}초 전`;
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHr < 24) return `${diffHr}시간 전`;
  return `${diffDay}일 전`;
}

export function formatKSTDateString(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';

  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const year = kst.getFullYear();
  const month = String(kst.getMonth() + 1).padStart(2, '0');
  const day = String(kst.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}
