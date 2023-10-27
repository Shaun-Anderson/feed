// import FavButton from "./FavButton";
import { Badge } from "./ui/badge";

export default function VideoCard({ article }: { article: any }) {
  return (
    <a
      href={article.link}
      className="relative col-span-6 flex h-fit w-full flex-col gap-2 rounded-xl  p-2 hover:bg-accent"
    >
      {/* <span className="flex items-center justify-between text-xs text-neutral-500">
        <span className="flex items-center gap-2">
          {article.avatarUrl && (
            <Image
              src={article.avatarUrl}
              width={16}
              height={16}
              alt={`icon for source ${article.origin}`}
            />
          )}
          {article.origin}
        </span>
        <FavButton faved={article.faved} title={article.title} />
      </span> */}

      {article.enclosures?.length > 0 && (
        <div className="relative w-full">
          <img
            src={article.enclosures[0]}
            alt=""
            title=""
            className="w-full rounded-lg"
          />
        </div>
      )}
      <div className=" z-10 w-full">
        <h3 className="text-sm font-medium">{article.title}</h3>
        <div className="my-2 flex gap-1 overflow-auto">
          {Array.isArray(article.category) ? (
            article.category.map((c) => <Badge>{c}</Badge>)
          ) : (
            <Badge>
              {typeof article.category === "object"
                ? article.category.label
                : article.category}
            </Badge>
          )}
        </div>
      </div>
    </a>
  );
}
