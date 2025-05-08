import Image from "next/image"
import Link from "next/link"
import type { News } from "@/app/(navs)/news/page"
import { use } from 'react'
import { time } from "console"

type NewsListProps = {
    newsList: News[]
}

export const NewsList: React.FC<NewsListProps> = ({ newsList }) => {
    return(
        <>
        {newsList.map((news) => (
            <Link href={news.url} key={news.id} target="_blank" className="w-full block">
                <div className="px-[20px] pb-[20px]">
                    <div className="relative h-[188px] w-full text-center bg-[#F2F2F2] rounded-[10px]">
                        {news.image ? (
                            <Image 
                                src={news.image} 
                                alt="뉴스이미지" 
                                fill 
                                className="rounded-[10px] object-cover" 
                                unoptimized
                                priority // 이미지 우선 로딩
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-full h-full bg-[#F2F2F2] rounded-[10px]" />
                            </div>
                        )}
                    </div>
                    <div className="mt-[10px] flex flex-col gap-[6px]">
                        <div className="flex items-center gap-[6px]">
                            <span className="text-[11px] text-[#666666]">{news.press}</span>
                        </div>
                        <h2 className="text-[15px] font-normal text-black leading-[22px]">{news.title}</h2>
                        <time className="text-[12px] font-normal text-[#999999]" dateTime={news.created_at}>
                            {news.created_at}
                        </time>
                    </div>
                    <div className="mt-[20px] border-t border-[#EEEEEE]" />
                </div>
            </Link>
        ))}
        </>
    )
}
