import Image from "next/image"

export type News = {
    id: number;
    title: string;
    press: string;
    url: string;
    created_at: string;
    image: string;
  };
  
type NewsListProps = {
    newsList: News[]
}

export const NewsList:React.FC<NewsListProps> = ({ newsList }) => {

    return(
        <>
        {newsList.map((news) => (
            <div key={news.id} className="w-full px-[20px]">
                <div className="relative h-[188px] w-full text-center bg-gray-300 rounded-[10px]">
                    <Image src={news.image} alt="뉴스이미지" fill className="rounded-[10px] object-cover" unoptimized/>
                </div>
                <div className="p-[10px] flex flex-col gap-[10px]">
                    <span className="text-writer text-[11px] ">{news.press}</span>
                    <span className="text-[15px] font-normal">{news.title}</span>
                    <p className="text-[12px] font-normal text-date">{news.created_at}</p>
                </div>
                <hr className="border-t-[1px] border-line pb-[20px]" />
            </div>
        ))}
        </>
    )
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };
