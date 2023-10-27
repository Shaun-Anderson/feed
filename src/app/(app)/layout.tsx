import { Bookmark, Tv2 } from "lucide-react";
import NavBarLink from "~/components/navbar-lnk";
import {
  getSession,
  getUserDetails,
  getSubscription,
} from "~/app/supabase-server";
import { redirect } from "next/navigation";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { CollectionSelect } from "~/components/collection/collection-select";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { AddFeedDialog } from "~/components/add-feed-dialog";
import { FeedList } from "~/components/feed-list";

export default async function Layout({ children }) {
  const [session, userDetails] = await Promise.all([
    getSession(),
    getUserDetails(),
  ]);

  console.log(userDetails);

  const user = session?.user;
  console.log(user);

  if (!session) {
    return redirect("/signin");
  }
  return (
    <html lang="en">
      <body className="flex w-full flex-col items-center justify-center">
        <ReactQueryProvider>
          <nav className="mt-4 flex w-full max-w-4xl  items-start justify-between gap-4 p-4">
            <div className="flex items-center gap-1">
              <div className="rounded-full bg-black p-2" />
              /
              <CollectionSelect />
              <NavBarLink
                href="/favorites"
                icon={<Bookmark size={18} />}
                text=""
              />
            </div>

            <ul className="flex ">
              <AddFeedDialog />
              <FeedList />
            </ul>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </nav>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
