"use client";

import { BarChart4, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const sidebarRoutes = [
    { icon: <MonitorPlay />, label: "Cursos", path: "/instructor/courses" },
    {
      icon: <BarChart4 />,
      label: "Performance",
      path: "/instructor/performance",
    },
  ];
  return (
    <div className="max-sm:hidden flex flex-col w-64 border-r shadow-md px-3 my-4 gap-4 text-sm font-medium text-[#043C6C]">
      {sidebarRoutes.map((route) => (
        <Link
          href={route.path}
          key={route.path}
          className={`flex items-center gap-4 p-3 rounded-lg hover:bg-[#EBF5FF] ${
            pathname.startsWith(route.path) &&
            "bg-[#043C6C] text-white hover:text-[#043C6C]"
          }
          `}
        >
          {route.icon}
          {route.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
