import { Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const slugify = (text: string) => {
  return text
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\_/g, "-") // Replace _ with -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/\-$/g, ""); // Remove trailing -
};

export default function FavButton({
  faved,
  title,
}: {
  faved: boolean;
  title: string;
}) {
  // eslint-disable-next-line @typescript-eslint/require-await
  async function addItem(data) {
    "use server";

    const favs = cookies().get("favs")?.value.split(",");
    const slug = slugify(title);

    if (!favs) return cookies().set("favs", `${slug}`);
    revalidateTag("");
    revalidateTag("favorites");
    if (favs.includes(slug)) {
      const newFavs = favs.filter((x) => x !== slug);
      return cookies().set("favs", `${newFavs.join(",")}}`);
    }
    return cookies().set("favs", `${favs.join(",")},${slugify(title)}`);
  }
  return (
    <form action={addItem}>
      <Button
        type="submit"
        size={"icon"}
        variant={"ghost"}
        className={cn("", faved && "bg-amber-400 text-amber-600")}
      >
        <Bookmark size={18} />
      </Button>
    </form>
  );
}
