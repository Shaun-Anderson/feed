import "~/styles/globals.css";
import { parse } from "rss-to-json";
import { Button } from "~/components/ui/button";
import { Bookmark } from "lucide-react";
import { headers, cookies } from "next/headers";
import FavButton, { slugify } from "~/components/FavButton";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";
import Script from "next/script";
import FeedMason from "~/components/feed-mason";
import ImageCard from "~/components/ImageCard";
import { Masonry } from "react-plock";
import { fetchFeed } from "./actions";
import { AddFeedDialog } from "~/components/add-feed-dialog";
import { FeedList } from "~/components/feed-list";

export default function Page() {
  // const rss = await fetchFeed();

  return (
    <>
      <main className="w-full  justify-center p-4">
        {/* <FeedMason /> */}
        {/* <ul className="grid grid-cols-12 gap-2">
          {rss.map((x, index) => (
            <ImageCard key={index} article={x} />
          ))}
        </ul> */}
        {/* <div className="my-2 flex w-full  items-center justify-center gap-2">
          <AddFeedDialog />
          <FeedList />
        </div> */}
        <FeedMason />
      </main>
    </>
  );
}
