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

function extractImage(string: string): string[] {
  let m;
  const urls: string[] = [];
  const rex = /<img[^>]+src="?([^"\s]+)"?\s*\>/g;

  while ((m = rex.exec(string))) {
    console.log(m);
    if (!m) continue;
    urls.push(m[1]);
  }

  return urls;
}

async function getAllFeeds() {
  const feeds: Feed[] = [
    // { name: "Eth", url: "https://blog.ethereum.org/feed.xml" },
    // {
    //   name: "Reddit",
    //   avatarUrl: "https://www.reddit.com/favicon.ico",
    //   url: "http://www.reddit.com/.rss",
    // },
    // {
    //   name: "TechCrunch",
    //   avatarUrl: "https://techcrunch.com/favicon.ico",
    //   url: "https://techcrunch.com/feed/",
    // },
    {
      name: "Pintrest",
      url: "https://www.pinterest.com.au/feliciaday/geekin.rss",
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
        image:
          feed.name === "Pintrest" ? extractImage(x.description) : undefined,
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
    <main className="max-w-3xl p-4">
      <ul className=" grid grid-cols-12 gap-2">
        {rss.map((x, index) => (
          <li
            key={index}
            className="relative col-span-6 flex flex-col gap-2 rounded-lg border p-4"
          >
            <span className="flex items-center justify-between text-xs text-neutral-500">
              <span className="flex items-center gap-2">
                {x.avatarUrl && (
                  <Image
                    src={x.avatarUrl}
                    width={16}
                    height={16}
                    alt={`icon for source ${x.origin}`}
                  />
                )}
                {x.origin}
              </span>
              <FavButton faved={x.faved} title={x.title} />
            </span>
            <h3 className="font-medium">{x.title}</h3>
            <h4 className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm text-neutral-500">
              {x.description}
            </h4>
            {x.image.length > 0 && (
              <div className="relative h-32 w-full">
                <Image src={x.image[0]} fill alt="" objectFit={"contain"} />
              </div>
            )}
            <div className="my-2 flex gap-1 overflow-auto">
              {Array.isArray(x.category) ? (
                x.category.map((c) => <Badge>{c}</Badge>)
              ) : (
                <Badge>
                  {typeof x.category === "object"
                    ? x.category.label
                    : x.category}
                </Badge>
              )}
            </div>
            <span className="text-xs text-neutral-500">
              {x.created.toDateString()}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
