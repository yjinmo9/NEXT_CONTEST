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
        <div className="w-full pb-[100px] z-20 bg-white space-y-4 min-h-screen pointer-event-auto">
            <h1 className="text-2xl font-bold mb-4">News</h1>
            <NewsList newsList={newsList} />
        </div>
    )
}