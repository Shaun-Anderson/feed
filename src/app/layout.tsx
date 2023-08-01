import { Bookmark, Tv2 } from "lucide-react";
import NavBarLink from "~/components/navbar-lnk";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body className="flex w-full flex-col items-center justify-center">
        <nav className="mt-4 flex w-full max-w-3xl flex-col items-start gap-4 p-4">
          <h1>ffeed.me</h1>
          <ul className="flex ">
            <NavBarLink href="/" icon={<Tv2 size={18} />} text="Feed" />
            <NavBarLink
              href="/favorites"
              icon={<Bookmark size={18} />}
              text="Favorites"
            />
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
