import "~/styles/globals.css";
import { parse } from "rss-to-json";
import { Button } from "~/components/ui/button";
import { Bookmark } from "lucide-react";
import { headers, cookies } from "next/headers";
import FavButton, { slugify } from "~/components/FavButton";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";

type Feed = {
  name: string;
  avatarUrl?: string;
  url: string;
};

async function getAllFeeds() {
  const feeds: Feed[] = [
    { name: "Eth", url: "https://blog.ethereum.org/feed.xml" },
    {
      name: "Reddit",
      avatarUrl: "https://www.reddit.com/favicon.ico",
      url: "http://www.reddit.com/.rss",
    },
    {
      name: "TechCrunch",
      avatarUrl: "https://techcrunch.com/favicon.ico",
      url: "https://techcrunch.com/feed/",
    },
  ];
  const favs = cookies().get("favs")?.value.split(",");
  // console.log("COOKIES ON PAGE LOAD: ", favs);
  const data = await Promise.all(
    feeds.map(async (feed) =>
      (
        await parse(feed.url)
      ).items.map((x) => ({
        ...x,
        created: new Date(x.created),
        faved: favs?.includes(slugify(x.title)),
        // avatarUrl: feed.avatarUrl ?? extractFaviconUrl(feed.url),
        avatarUrl: feed.avatarUrl,
        origin: feed.name,
      }))
    )
  );
  const articles = data.flat().sort((a, b) => b.created - a.created);
  console.log(articles);
  return articles;
}

function extractFaviconUrl(url: string): string {
  const components = url.split("/");
  return `${components[0]}//${components[2]}/favicon.ico`;
}

export default async function Page() {
  const rss = await getAllFeeds();

  return (
    <section className="mb-4 rounded-lg">
      <h2 className="my-4 flex gap-2 text-sm">
        <Bookmark size={18} /> Favourites
      </h2>
      <ul className="grid grid-cols-12 gap-0">
        {rss
          .filter((x) => x.faved)
          .map((x, index) => (
            <a
              href={x.link}
              target="_blank"
              key={index}
              className=" relative col-span-12 flex items-center justify-between py-3 text-xs"
            >
              <div className="group w-full overflow-hidden">
                <h3 className="text-sm font-medium group-hover:underline">
                  {x.title}
                </h3>
                <h4 className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-neutral-500">
                  {x.description}
                </h4>
              </div>
              <div className=" shrink-0">
                <FavButton faved={x.faved} title={x.title} />
              </div>
            </a>
          ))}
      </ul>
    </section>
  );
}
