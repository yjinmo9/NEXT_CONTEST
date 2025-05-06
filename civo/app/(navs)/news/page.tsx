import { NewsList } from "@/components/news/news-list"
import { getNewListAction } from "@/app/actions"

type News = {
    id : number
    title : string
    content : string
    created_at : string
}

export default async function NewsPage() {
    const newsList:News[] = await getNewListAction();

    return(
        <div className="w-full z-30 bg-white space-y-4 min-h-screen pointer-events-auto">
            <span className="px-[20px] pt-[8px] pb-[8px] text-[15px] font-semibold">주요 뉴스</span>
            <div className="pb-[89px] overflow-y-auto max-h-[calc(100vh-181.65px)]">
                <NewsList newsList={newsList}/>
            </div>
        </div>
    )
}