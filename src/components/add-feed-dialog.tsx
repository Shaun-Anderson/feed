"use client";

import { YoutubeIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { YouTubeFeedForm } from "./add-feed/providers/youtube-form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "~/lib/trpc/client";
import { RedditFeedForm } from "./add-feed/providers/reddit-form";
import { useState } from "react";

const formSchema = z.object({
  url: z.string().min(2, {
    message: "feed url is required.",
  }),
});

export const AddFeedDialog = () => {
  const ctx = trpc.useContext();
  const { mutate: addFeedMutation } = trpc.feed.create.useMutation({
    onSuccess: async () => {
      await ctx.feed.getFeedsContent.invalidate();
      await ctx.feed.get.invalidate();
      setOpen(false);
    },
  });
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    addFeedMutation(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-32">
          Add Feed
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new Feed</DialogTitle>
          <DialogDescription>Add a new rss feed</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start gap-2"
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="w-full">
                  {/* <FormLabel>Username</FormLabel> */}
                  <FormControl>
                    <Input placeholder="feed url..." {...field} />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <hr />
        <span className="w-full text-center text-sm text-neutral-500">
          or select a source below
        </span>
        <Tabs className="w-full ">
          <TabsList className="gap-2 bg-transparent p-0">
            <TabsTrigger
              value="youtube"
              className="h-12 w-12 rounded-lg border border-transparent data-[state=active]:border-border data-[state=active]:fill-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="100%"
                width="100%"
                viewBox="0 0 576 512"
              >
                <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
              </svg>
            </TabsTrigger>
            <TabsTrigger
              value="reddit"
              className="h-12 w-12 rounded-lg border border-transparent data-[state=active]:border-border data-[state=active]:fill-orange-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="100%"
                width="100%"
                viewBox="0 0 512 512"
              >
                <path d="M201.5 305.5c-13.8 0-24.9-11.1-24.9-24.6 0-13.8 11.1-24.9 24.9-24.9 13.6 0 24.6 11.1 24.6 24.9 0 13.6-11.1 24.6-24.6 24.6zM504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-132.3-41.2c-9.4 0-17.7 3.9-23.8 10-22.4-15.5-52.6-25.5-86.1-26.6l17.4-78.3 55.4 12.5c0 13.6 11.1 24.6 24.6 24.6 13.8 0 24.9-11.3 24.9-24.9s-11.1-24.9-24.9-24.9c-9.7 0-18 5.8-22.1 13.8l-61.2-13.6c-3-.8-6.1 1.4-6.9 4.4l-19.1 86.4c-33.2 1.4-63.1 11.3-85.5 26.8-6.1-6.4-14.7-10.2-24.1-10.2-34.9 0-46.3 46.9-14.4 62.8-1.1 5-1.7 10.2-1.7 15.5 0 52.6 59.2 95.2 132 95.2 73.1 0 132.3-42.6 132.3-95.2 0-5.3-.6-10.8-1.9-15.8 31.3-16 19.8-62.5-14.9-62.5zM302.8 331c-18.2 18.2-76.1 17.9-93.6 0-2.2-2.2-6.1-2.2-8.3 0-2.5 2.5-2.5 6.4 0 8.6 22.8 22.8 87.3 22.8 110.2 0 2.5-2.2 2.5-6.1 0-8.6-2.2-2.2-6.1-2.2-8.3 0zm7.7-75c-13.6 0-24.6 11.1-24.6 24.9 0 13.6 11.1 24.6 24.6 24.6 13.8 0 24.9-11.1 24.9-24.6 0-13.8-11-24.9-24.9-24.9z" />
              </svg>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="youtube">
            <YouTubeFeedForm onSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="reddit">
            <RedditFeedForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
