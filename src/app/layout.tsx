import { Bookmark, Tv2 } from "lucide-react";
import NavBarLink from "~/components/navbar-lnk";
import SupabaseProvider from "./supabase-provider";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="flex w-full flex-col items-center justify-center">
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
