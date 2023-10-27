"use server";

import { cookies } from "next/headers";
import { parse } from "rss-to-json";
import FavButton, { slugify } from "~/components/FavButton";

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
    if (!m) continue;
    urls.push(m[1]);
  }

  return urls;
}

function extractFaviconUrl(url: string): string {
  const components = url.split("/");
  return `${components[0]}//${components[2]}/favicon.ico`;
}

export async function fetchFeed() {
  const feeds: Feed[] = [
    // { name: "Eth", url: "https://blog.ethereum.org/feed.xml" },
    {
      name: "Reddit",
      avatarUrl: "https://www.reddit.com/favicon.ico",
      url: "http://www.reddit.com/.rss",
    },
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
  return articles;
}
