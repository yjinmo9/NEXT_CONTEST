import { NewsList } from "@/components/news/news-list"
import { getNewListAction } from "@/app/actions"

export type News = {
    id: number;
    title: string;
    press: string;
    url: string;
    created_at: string;
    image: string;
  };
  

export default async function NewsPage() {
    const newsList:News[] = await getNewListAction();

    return(
        <div className="w-full z-30 bg-white space-y-4 min-h-screen pointer-events-auto">
            <span className="px-[20px] pt-[8px] pb-[8px] text-[15px] font-semibold">주요 뉴스</span>
            <div className="pb-[100px] overflow-y-auto">
                <NewsList newsList={newsList}/>
            </div>
        </div>
    )
}