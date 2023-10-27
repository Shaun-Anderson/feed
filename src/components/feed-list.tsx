"use client";

import { Loader2, RssIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { z } from "zod";
import { trpc } from "~/lib/trpc/client";
import { Skeleton } from "./ui/skeleton";

export const FeedList = () => {
  const { data: feeds, isLoading } = trpc.feed.get.useQuery();
  // if (isLoading) {
  //   return <Skeleton className="h-[36px] w-32" />;
  // }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative flex gap-2">
          <RssIcon className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500">
            {isLoading ? <Loader2 className="animate-spin" /> : feeds?.length}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Current feeds</DialogTitle>
          <DialogDescription>Manage your current feeds/</DialogDescription>
        </DialogHeader>
        {feeds?.map((feed) => (
          <p key={feed.id}>{feed.url}</p>
        ))}
      </DialogContent>
    </Dialog>
  );
};
