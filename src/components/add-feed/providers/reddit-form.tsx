import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { trpc } from "~/lib/trpc/client";

const formSchema = z.object({
  subreddit: z.string().min(2, {
    message: "subreddit url is required.",
  }),
});

export const RedditFeedForm = () => {
  const { mutate: addFeedMutation } = trpc.feed.createReddit.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subreddit: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      addFeedMutation(values);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-start gap-0"
      >
        <FormField
          control={form.control}
          name="subreddit"
          render={({ field }) => (
            <FormItem className="w-full space-y-0">
              <FormLabel className="sr-only m-0">Subreddit name</FormLabel>
              <FormControl>
                <div className="relative flex items-center gap-0">
                  <span className="absolute left-4">r/</span>
                  <Input
                    placeholder="Subreddit name"
                    {...field}
                    className="rounded-r-none pl-10"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="outline" className="rounded-l-none">
          Submit
        </Button>
      </form>
    </Form>
  );
};
