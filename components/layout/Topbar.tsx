"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Topbar = () => {
  const { isSignedIn } = useAuth();
  const topRoutes = [
    { label: "Instrutor", path: "/instructor/courses" },
    { label: "Aprendizado", path: "/learning" },
  ];
  return (
    <div className="flex justify-between items-center p-4">
      <Link href="/">
        <Image src="/logo.png" height={100} width={100} alt="logo" />
      </Link>

      <div className="max-md:hidden w-[400px] rounded-full flex">
        <input
          className="flex-grow bg-[#EBF5FF] rounded-l-full border-none outline-none text-sm pl-4 py-3"
          placeholder="Procure por cursos..."
        />
        <button className="bg-[#043C6C] rounded-r-full border-none outline-none cursor-pointer px-4 py-3 hover:bg-[#043C6C]/80 text-white">
          <Search className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-6 items-center">
        <div className="max-sm:hidden flex gap-6">
          {topRoutes.map((route) => (
            <Link
              href={route.path}
              key={route.path}
              className="text-sm font-bold hover:text-[#043C6C]"
            >
              {route.label}
            </Link>
          ))}
        </div>
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/sign-in" />
        ) : (
          <Link href="/sign-in">
            <Button>Entrar</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Topbar;
