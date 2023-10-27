import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, t } from "../trpc";
import { parse } from "rss-to-json";
import { slugify } from "~/components/FavButton";
import { ArticleType } from "~/lib/utils";

export type Feed = {
  name: string;
  avatarUrl?: string;
  url: string;
  type: ArticleType;
};

export function extractImage(string: string): string[] {
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

const IMAGE_DOMAINS = ["pinterest"];
const VIDEO_DOMAINS = ["youtube"];
export function getArticleType(articleUrl: string): ArticleType {
  if (IMAGE_DOMAINS.some((domain) => articleUrl.includes(domain))) {
    return ArticleType.Image;
  }
  if (VIDEO_DOMAINS.some((domain) => articleUrl.includes(domain))) {
    return ArticleType.Video;
  }
  return ArticleType.Text;
}

export const feedRouter = t.router({
  get: publicProcedure.query(async ({ ctx }) => {
    const { data: feeds } = await ctx.supabase!.from("feeds").select();
    return feeds;
  }),
  getFeedsContent: publicProcedure.query(async ({ ctx }) => {
    try {
      const { data: feeds } = await ctx.supabase!.from("feeds").select();

      // const favs = cookies().get("favs")?.value.split(",");
      const finalFeeds = feeds?.map((x) => ({
        ...x,
        type: getArticleType(x.url),
      }));

      // console.log(finalFeeds);
      // console.log("COOKIES ON PAGE LOAD: ", favs);
      const data = await Promise.all(
        finalFeeds.map(async (feed) =>
          (
            await parse(feed.url)
          ).items.map((x) => ({
            ...x,
            created: new Date(x.created),
            // faved: favs?.includes(slugify(x.title)),
            image:
              feed.type === ArticleType.Image
                ? extractImage(x.description)
                : undefined,
            avatarUrl: feed.avatarUrl ?? extractFaviconUrl(feed.url),
            // avatarUrl: feed.avatarUrl,
            origin: feed.name,
            type: feed.type,
          }))
        )
      );
      console.log(data);
      const articles = data.flat().sort((a, b) => b.created - a.created);
      // return articles;
      return articles;
    } catch (error) {
      console.log(error);
    }
  }),
  create: publicProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx
        .supabase!.from("feeds")
        .insert({ user_id: ctx.session?.user.id, url: input.url });
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
          cause: error.details,
        });
      }
    }),
  createReddit: publicProcedure
    .input(z.object({ subreddit: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const rssUrl = `https://www.reddit.com/r/${input.subreddit}.rss`;
        const { error } = await ctx
          .supabase!.from("feeds")
          .insert({ user_id: ctx.session?.user.id, url: rssUrl });
        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            cause: error.details,
          });
        }
      } catch (errpr) {
        // throw new TRPCError({
        //   code: "INTERNAL_SERVER_ERROR",
        //   message: error.message,
        //   cause: error.details,
        // });
      }
    }),
  createYoutube: publicProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("awjkdbaioudw");

        const response = await fetch(input.url, { method: "GET" });
        const html = await response.text();
        const channelIdMatches = html.match('channel_id=([^"]*)"');
        if (!channelIdMatches) {
          return;
        }
        const youtubeId = channelIdMatches[1];
        console.log("MATCH: ", youtubeId);
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeId}`;

        const { error } = await ctx
          .supabase!.from("feeds")
          .insert({ user_id: ctx.session?.user.id, url: rssUrl });
        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            cause: error.details,
          });
        }
      } catch (errpr) {
        // throw new TRPCError({
        //   code: "INTERNAL_SERVER_ERROR",
        //   message: error.message,
        //   cause: error.details,
        // });
      }
    }),
});
