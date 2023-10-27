// import FavButton from "./FavButton";
import { Badge } from "./ui/badge";

export default function ImageCard({ article }: { article: any }) {
  return (
    <a
      href={article.link}
      className="group relative col-span-6 flex h-fit flex-col gap-2 overflow-hidden rounded-xl border bg-white p-1 hover:bg-accent"
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
      {article.title && (
        <div className=" absolute bottom-0 z-10 -mx-1 bg-gradient-to-t from-black/60  px-2 pt-10 text-white opacity-0 transition-all duration-500  group-hover:opacity-100">
          <h3 className="text-sm font-medium">{article.title}</h3>
          {article?.image?.length === 0 && (
            <h4 className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm text-neutral-500">
              {article.description}
            </h4>
          )}
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
          {/* <span className="text-xs text-neutral-500">
          {article.created.toDateString()}
        </span> */}
        </div>
      )}
      {article.image?.length > 0 && (
        <div className="relative w-full">
          <img
            src={article.image[0]}
            alt=""
            title=""
            className="w-full rounded-lg"
          />
        </div>
      )}
    </a>
  );
}
