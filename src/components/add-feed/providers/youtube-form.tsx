import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { trpc } from "~/lib/trpc/client";

const formSchema = z.object({
  url: z.string().min(2, {
    message: "feed url is required.",
  }),
});

export const YouTubeFeedForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { mutate: addFeedMutation } = trpc.feed.createYoutube.useMutation({
    onSuccess,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
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
          name="url"
          render={({ field }) => (
            <FormItem className="w-full">
              {/* <FormLabel>Username</FormLabel> */}
              <FormControl>
                <Input
                  placeholder="channel url"
                  {...field}
                  className="rounded-r-none"
                />
              </FormControl>
              {/* <FormDescription>
              This is your public display name.
            </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          variant="outline"
          className="rounded-l-none"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
