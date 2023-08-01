"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavBarLinkProps {
  icon: ReactNode;
  href: string;
  text?: ReactNode;
  preSelectNested?: boolean;
  disabled?: boolean;
}
const NavBarLink = (props: NavBarLinkProps) => {
  const { icon, href, preSelectNested, text } = props;
  const pathname = usePathname();

  const preSelected = preSelectNested
    ? pathname?.includes(href)
    : pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center justify-center gap-2  text-sm  ${
        preSelected ? " border-neutral-200 font-medium" : ""
      } rounded-lg p-2 hover:bg-neutral-100`}
    >
      {icon} {text}
    </Link>
  );
};

export default NavBarLink;
