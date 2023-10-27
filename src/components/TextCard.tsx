import Image from "next/image";
import { Badge } from "./ui/badge";

export default function TextCard({ article }: { article: any }) {
  console.log(article);
  return (
    <a
      href={article.link}
      className="relative col-span-6 flex flex-col gap-2 rounded-lg border p-4 hover:bg-accent"
    >
      <span className="flex items-center justify-between text-xs text-neutral-500">
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
        {/* <FavButton faved={article.faved} title={article.title} /> */}
      </span>
      <h3 className="text-sm font-medium text-neutral-900">{article.title}</h3>
      {/* {article.image.length === 0 && (
        
      )} */}
      {article.image ? (
        <div className="relative w-full">
          <img src={article.image[0]} alt="" title="" className="w-full" />

          <Image src={article.image[0]} fill alt="" objectFit={"contain"} />
        </div>
      ) : (
        <h4 className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm text-neutral-500">
          {article.title}
        </h4>
      )}
      <div className="my-2 flex gap-1 overflow-auto">
        {Array.isArray(article.category) ? (
          article.category.map((c) => <Badge>{c}</Badge>)
        ) : (
          <Badge variant="outline">
            {typeof article.category === "object"
              ? article.category.label
              : article.category}
          </Badge>
        )}
      </div>
      <span className="text-xs text-neutral-500">
        {article.created && article.created.toDateString()}
      </span>
    </a>
  );
}
