"use client";

import { useTheme } from "next-themes";
import { Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { IoLogOut } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { RiMenu2Line, RiMenu3Line } from "react-icons/ri";
import { GrProjects } from "react-icons/gr";
import { SiRetool } from "react-icons/si";
import { RiBloggerLine } from "react-icons/ri";
import Link from "next/link";

import useScreenWidth from "../hooks/useScreenWidth";
import { ThemeSwitch } from "../UI/theme-switch";

import { logout } from "@/src/services/AuthService";

const Sidebar = () => {
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [smScreen, setSmScreen] = useState(false);
  const screenWidth = useScreenWidth();

  const logoutUser = async () => {
    await logout();
    window.location.href = "/";
  };

  useEffect(() => {
    if (screenWidth! < 801) {
      setCollapsed(true);
      setSmScreen(true);
    } else {
      setCollapsed(false);
      setSmScreen(false);
    }
  }, [screenWidth]);

  if (screenWidth === null) {
    return <div>Loading...</div>;
  }

  const menuItems = [
    { icon: <FaHome className="w-6 h-6" />, label: "Dashboard", path: "/" },
    {
      icon: <GrProjects className="w-6 h-6" />,
      label: "Project",
      path: "/project",
    },
    {
      icon: <SiRetool className="w-6 h-6" />,
      label: "Skill",
      path: "/skill",
    },
    {
      icon: <RiBloggerLine className="w-6 h-6" />,
      label: "Blog",
      path: "/blog",
    },
  ];

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-full transition-all duration-300 ${theme === "dark" ? "bg-zinc-900" : "bg-zinc-300"} py-4 rounded-tr-lg shadow-lg`}
    >
      {/* Header */}
      {!smScreen && (
        <div className="p-4 flex justify-between items-center">
          {!collapsed && <h1 className="text-xl font-bold">Tonmoy Talukder</h1>}
          <button
            className={`p-2 rounded-md ${theme === "dark" ? "text-white" : "text-black"} hover:bg-zinc-600`}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <RiMenu3Line /> : <RiMenu2Line />}
          </button>
        </div>
      )}

      {/* Menu */}
      <div className="mt-4">
        {menuItems.map((item, index) =>
          collapsed ? (
            <Tooltip
              key={index}
              className="w-full"
              content={item.label}
              placement="right"
            >
              <Link href={item.path}>
                <div
                  className={`flex flex-col items-center gap-x-0 mb-7 py-2 cursor-pointer ${
                    theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-400"
                  } rounded-md`}
                >
                  {item.icon}
                </div>
              </Link>
            </Tooltip>
          ) : (
            <Link key={index} href={item.path}>
              <div
                className={`flex flex-row items-center gap-4 p-4 cursor-pointer ${
                  theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-400"
                } rounded-md`}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            </Link>
          ),
        )}

        {collapsed ? (
          <Tooltip
            key="logout"
            className="w-full"
            content="Logout"
            placement="right"
          >
            <button
              className={`flex flex-col items-center gap-x-0 mb-7 py-2 cursor-pointer w-full ${
                theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-400"
              } rounded-md`}
              onClick={logoutUser}
            >
              <IoLogOut className="w-6 h-6" />
            </button>
          </Tooltip>
        ) : (
          <button
            key="logout"
            className={`flex flex-row items-center gap-4 p-4 cursor-pointer ${
              theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-400"
            } rounded-md w-full`}
            onClick={logoutUser}
          >
            <IoLogOut className="w-6 h-6" />
            <span>Logout</span>
          </button>
        )}

        {collapsed ? (
          <Tooltip
            key="theme"
            className="w-full"
            content="Theme"
            placement="right"
          >
            <button
              className={`flex flex-col items-center gap-x-0 mb-7 py-2 cursor-pointer w-full ${
                theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-400"
              } rounded-md`}
            >
              <ThemeSwitch />
            </button>
          </Tooltip>
        ) : (
          <div
            key="theme"
            className={`flex flex-row items-center gap-4 p-4 rounded-md w-full`}
          >
            <ThemeSwitch />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
