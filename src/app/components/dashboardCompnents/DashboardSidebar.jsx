"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client"
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";

const DashboardSidebar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  // console.log("user data :",user);


  const artistDashboard = [
    {
      title: "Dashboard Home",
      path: "/dashboard/artist",
      icon: "solar:home-angle-bold-duotone",
    },
    {
      title: "All Artworks",
      path: "/dashboard/artist/allarts",
      icon: "solar:gallery-bold-duotone",
    },
    {
      title: "Post New Art",
      path: "/dashboard/artist/allarts/newArt",
      icon: "solar:add-circle-bold-duotone",
    },
    {
      title: "Company Profile",
      path: "/dashboard/artist/company",
      icon: "solar:user-circle-bold-duotone",
    },
    {
      title: "Profile Management",
      path: "/dashboard/artist/profile",
      icon: "solar:user-circle-bold-duotone",
    },

  ];

  const userDashboard = [
    {
      title: "Profile Management",
      path: "/dashboard/user/profile",
      icon: "solar:user-circle-bold-duotone",
    },
    {
      title: "Purchase History",
      path: "/dashboard/user/purchase-history",
      icon: "solar:history-bold-duotone",
    },
    {
      title: "Bought Artworks",
      path: "/dashboard/user/bought-arts",
      icon: "solar:palette-round-bold-duotone",
    }
  ]



  const menuItems =
  user?.role === "artist"
    ? artistDashboard
    : user?.role === "buyer"
    ? userDashboard
    : [];


    const panelTitle =
  user?.role === "artist"
    ? "Artist Panel"
    : user?.role === "buyer"
    ? "User Panel"
    : "Dashboard";

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  const isLinkActive = (path) => {
    if (path === "/dashboard/artist") {
      return pathname === "/dashboard/artist";
    }
    return pathname.startsWith(path);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#11120e] text-gray-300 border-r border-[#D4AF37]/20">
      {/* Branding / Logo */}
      <div className="p-6 border-b border-[#D4AF37]/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#AA7C11] via-[#D4AF37] to-[#FFE58F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/10">
          <Icon icon="solar:palette-bold" className="text-black text-2xl" />
        </div>
        <div>
          <h1 className="font-serif text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11]">
           {panelTitle}
          </h1>
          <p className="text-[10px] tracking-widest text-gray-500 uppercase">ArtHub Creator</p>
        </div>
      </div>

      {/* User Info Card */}
      <div className="p-4 mx-4 mt-6 rounded-2xl bg-gradient-to-b from-[#1c1d17] to-[#141510] border border-[#D4AF37]/10 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full border border-[#D4AF37]/30 overflow-hidden bg-gray-800 shrink-0">
          {user?.image ? (
            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#e8dcb8] text-lg font-bold bg-[#1a1b16]">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-white truncate">{user?.name || "Artist Name"}</h4>
          <p className="text-[11px] text-gray-400 truncate">{user?.email || "artist@arthub.com"}</p>
          <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold text-black bg-[#D4AF37] rounded-full uppercase tracking-wider">
            {user?.role || "Artist"}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-3">Menu</p>
        {menuItems.map((item) => {
          const active = isLinkActive(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group ${active
                  ? "bg-[#D4AF37]/10 text-[#D4AF37] border-l-4 border-[#D4AF37] font-semibold"
                  : "hover:bg-[#1a1b16] hover:text-white"
                }`}
            >
              <Icon
                icon={item.icon}
                className={`text-xl transition-transform duration-300 group-hover:scale-110 ${active ? "text-[#D4AF37]" : "text-gray-500 group-hover:text-[#D4AF37]"
                  }`}
              />
              <span className="text-sm">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-[#D4AF37]/10 space-y-2">
        <Link href="/" className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300">
          <Icon icon="solar:arrow-left-linear" />
          Back to Website
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 transition-all duration-300 cursor-pointer"
        >
          <Icon icon="solar:logout-3-bold" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 shrink-0 select-none">
        {sidebarContent}
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between bg-[#11120e] border-b border-[#D4AF37]/20 px-4 py-3 sticky top-0 z-50 w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center shadow-md shadow-[#D4AF37]/10">
            <Icon icon="solar:palette-bold" className="text-black text-lg" />
          </div>
          <span className="font-serif text-md font-bold text-[#D4AF37]">
            Artist Panel
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
          aria-label="Toggle Navigation Sidebar"
        >
          <Icon icon={isOpen ? "solar:close-square-linear" : "solar:hamburger-menu-linear"} className="text-2xl" />
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          {/* Drawer Panel */}
          <aside className="relative flex flex-col w-72 max-w-[80vw] h-full bg-[#11120e] shadow-2xl animate-slideRight">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default DashboardSidebar;