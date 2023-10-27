"use client";

import { Badge } from "~/components/ui/badge";
import FavButton from "./FavButton";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Masonry } from "react-plock";
import { trpc } from "~/lib/trpc/client";
import ImageCard from "./ImageCard";
import TextCard from "./TextCard";
import { Loader2Icon, ShellIcon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import VideoCard from "./VideoCard";
import { ArticleType } from "~/lib/utils";

export default function wrapper() {
  return <FeedMason />;
}

const ArticleCard = ({ article }: { article: any }) => {
  switch (article.type) {
    case ArticleType.Text:
      return <TextCard article={article} />;
    case ArticleType.Image:
      return <ImageCard article={article} />;
    case ArticleType.Video:
      return <VideoCard article={article} />;
  }
};

function FeedMason() {
  const { data, isLoading } = trpc.feed.getFeedsContent.useQuery();
  console.log(data);

  if (isLoading)
    return (
      <div className="grid h-full w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  if (!data) return <p>No posts found</p>;

  const videos = data.filter((x) => x.type === ArticleType.Video);
  const texts = data.filter((x) => x.type === ArticleType.Text);

  return (
    <>
      <div className="-mx-4 w-auto overflow-hidden ">
        <ul className="flex gap-2 overflow-scroll pl-2 md:pl-16 lg:pl-36 xl:pl-64 [&>*:nth-child(even)]:-rotate-1 [&>*:nth-child(odd)]:rotate-1">
          {videos.map((video, index) => (
            <li key={index} className=" w-64 shrink-0">
              <VideoCard article={video} />
            </li>
          ))}
        </ul>
      </div>
      {/* <section className="flex w-full justify-center">
        <ul className="flex w-full max-w-3xl flex-col gap-2 divide-y overflow-scroll">
          {texts.map((text, index) => (
            <li key={index} className=" flex w-full gap-2 rounded-lg p-2">
              <span className="flex items-center justify-between text-xs text-neutral-500">
                <span className="flex items-center gap-2">
                  {text.avatarUrl && (
                    <Image
                      src={text.avatarUrl}
                      width={16}
                      height={16}
                      alt={`icon for source ${text.origin}`}
                    />
                  )}
                  {text.origin}
                </span>
              </span>
              <span className="text-neutral-900">{text.title}</span>
            </li>
          ))}
        </ul>
      </section> */}
      <section className="flex w-full justify-center">
        <Masonry
          className="max-w-4xl"
          items={data}
          config={{
            columns: [1, 2, 3],
            gap: [24, 12, 6],
            media: [640, 768, 1024],
          }}
          render={(item, idx) => <ArticleCard key={idx} article={item} />}
        />
      </section>
    </>
  );
}
