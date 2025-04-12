type News = {
    id : number
    title : string
    content : string
    created_at : string
}

type NewsListProps = {
    newsList: News[]
}

export const NewsList:React.FC<NewsListProps> = ({ newsList }) => {

    return(
        <>
        {newsList.map((news) => (
            <div key={news.id} className="mb-4 p-4 border rounded">
            <h2 className="text-xl font-semibold">{news.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{news.created_at}</p>
            <p>{news.content}</p>
        </div>
        ))}
        </>
    )
}