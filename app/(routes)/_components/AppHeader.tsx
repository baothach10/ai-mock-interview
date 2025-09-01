import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const MenuOption = [
  { name: "Upgrade", path: "/upgrade" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "How it works", path: "/how-it-works" },
];

function AppHeader() {
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center">
        <Link href={'/'}>
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
        </Link>
      </div>
      <div>
        <ul className="flex gap-5">
          {MenuOption.map((option) => (
            <Link href={option.path} key={option.name}>
              <li
                className="text-lg hover:scale-105 transition-all cursor-pointer"
              >
                {option.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <UserButton />
    </nav>
  );
}

export default AppHeader;
