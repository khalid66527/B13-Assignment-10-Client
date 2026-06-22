"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Link, Button } from "@heroui/react";
import { Magnifier, ChevronDown } from "@gravity-ui/icons";
import { useSession, authClient } from "@/lib/auth-client";

export default function CustomHeader() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userRole = user?.role || null;


  // console.log('userdata ', user)

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const pathname = usePathname();

  useEffect(() => {
    const handleClose = () => setIsProfileOpen(false);
    if (isProfileOpen) {
      document.addEventListener("click", handleClose);
    }
    return () => document.removeEventListener("click", handleClose);
  }, [isProfileOpen]);

  // useEffect(() => {
  //   const savedTheme = localStorage.getItem("theme") || "dark";
  //   setTheme(savedTheme);
  //   if (savedTheme === "dark") {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, []);

  const toggleTheme = (e) => {
    e.stopPropagation();
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    setIsProfileOpen(false);
    window.location.reload();
  };

  // Helper function for active routes
  const isActive = (path) => pathname === path;
  
  // Custom styling classes
  const linkClass = "text-[#e8dcb8] hover:text-white transition-colors text-sm lg:text-base cursor-pointer flex items-center h-full py-4";
  const activeClass = "text-white font-bold border-b-2 border-[#e8dcb8]";
  const dropdownItemClass = "block px-4 py-2.5 text-[#e8dcb8] hover:bg-[#e8dcb8] hover:text-[#1a1b16] transition-colors text-sm";

  // Dynamic Title Generator based on active route
  const getPageTitle = (path) => {
    if (path === "/") return "Home";
    if (path.startsWith("/about")) return "About Us";
    if (path.startsWith("/shop")) return "Shop";
    if (path.startsWith("/collections")) return "Collections";
    if (path.startsWith("/exhibitions")) return "Exhibitions";
    if (path.startsWith("/contact")) return "Contact";
    if (path.startsWith("/team")) return "Our Team";
    if (path.startsWith("/pricing")) return "Pricing";
    
    // Fallback: Remove slashes, replace dashes with spaces, and capitalize
    const formatted = path.replace(/^\//, "").replace(/-/g, " ");
    return formatted ? formatted.charAt(0).toUpperCase() + formatted.slice(1) : "Home";
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <header 
      // Changed from sticky to relative, and increased height (min-h-[450px])
      className="relative z-50 w-full border-b border-[#3a3c2f]/50 bg-black/80 bg-cover bg-center bg-no-repeat flex flex-col min-h-[450px] lg:min-h-[500px]"
      style={{ backgroundImage: "url('/image/Navimg.jpg')", backgroundColor: "rgba(26, 27, 22, 0.9)" }} 
    >
      {/* --- TOP NAVBAR SECTION --- */}
      <nav className="mx-auto flex h-20 w-full w-10/12 items-center justify-between px-4 lg:px-8 relative z-20">
        
        


        {/* --- LEFT SIDE: Hamburger & Navigation Links --- */}
        <div className="flex flex-1 items-center gap-4 justify-start">
          <button
            className="lg:hidden text-[#e8dcb8]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <ul className="hidden items-center gap-6 lg:flex h-full">
            
            {/* Tailwind Group-Hover Dropdown for HOME */}
            <li className="relative group h-full flex items-center">
              <span className={`${linkClass} gap-1`}>
                Home <ChevronDown width={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <div className="absolute top-[70px] left-0 min-w-[200px] bg-[#1f2019] border border-[#3a3c2f] shadow-xl rounded-b-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <Link href="/shop" className={dropdownItemClass}>Shop</Link>
                <Link href="/collections" className={dropdownItemClass}>Collections</Link>
                <Link href="/exhibitions" className={dropdownItemClass}>Exhibitions</Link>
                <Link href="/contact" className={dropdownItemClass}>Contact</Link>
                <Link href="/top-art-hall" className={dropdownItemClass}>Top Art Hall</Link>
              </div>
            </li>

            {/* Pages Dropdown */}
            <li className="relative group h-full flex items-center">
              <span className={`${linkClass} gap-1`}>
                Pages <ChevronDown width={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <div className="absolute top-[70px] left-0 min-w-[180px] bg-[#1f2019] border border-[#3a3c2f] shadow-xl rounded-b-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <Link href="/about" className={dropdownItemClass}>About Us</Link>
                <Link href="/team" className={dropdownItemClass}>Our Team</Link>
                <Link href="/pricing" className={dropdownItemClass}>Pricing</Link>
              </div>
            </li>

            {/* Exhibitions Dropdown */}
            <li className="relative group h-full flex items-center">
              <span className={`${linkClass} gap-1`}>
                Exhibitions <ChevronDown width={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <div className="absolute top-[70px] left-0 min-w-[180px] bg-[#1f2019] border border-[#3a3c2f] shadow-xl rounded-b-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <Link href="/exhibitions/list" className={dropdownItemClass}>List</Link>
                <Link href="/exhibitions/calendar" className={dropdownItemClass}>Calendar</Link>
              </div>
            </li>

            <li className="h-full flex items-center"><Link href="/shop" className={`${linkClass} ${isActive("/shop") ? activeClass : ""}`}>Shop</Link></li>
            <li className="h-full flex items-center"><Link href="/collections" className={`${linkClass} ${isActive("/collections") ? activeClass : ""}`}>Collections</Link></li>
            <li className="h-full flex items-center"><Link href="/contact" className={`${linkClass} ${isActive("/contact") ? activeClass : ""}`}>Contact_Us</Link></li>

            {/* Dashboard Dropdown (Role Based) */}
            {userRole && (
              <li className="relative group h-full flex items-center">
                <span className={`${linkClass} gap-1 font-medium`}>
                  Dashboard <ChevronDown width={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </span>
                <div className="absolute top-[70px] left-0 min-w-[200px] bg-[#1f2019] border border-[#3a3c2f] shadow-xl rounded-b-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {(userRole === "buyer" || userRole === "user") && <Link href="/dashboard/user" className={dropdownItemClass}>User Dashboard</Link>}
                  {userRole === "artist" && <Link href="/dashboard/artist" className={dropdownItemClass}>Artist Dashboard</Link>}
                  {userRole === "admin" && <Link href="/dashboard/admin" className={dropdownItemClass}>Admin Dashboard</Link>}
                </div>
              </li>
            )}
          </ul>
        </div>

         {/* --- CENTER: Logo --- */}
        <div className="flex flex-1 items-center justify-center">
          <Link href="/">
            <Image
              src="/image/logo.png"
              alt="ArtHub Logo"
              width={100}
              height={40}
              className="object-contain transition-transform hover:scale-105 duration-300 w-auto h-auto"
              priority
            />
          </Link>
        </div>

       

        {/* --- RIGHT SIDE: Search & Auth --- */}
        <div className="flex flex-1 items-center justify-end gap-4 lg:gap-6">
          <button aria-label="Search" className="hidden lg:block text-[#e8dcb8] hover:text-white transition-colors">
            <Magnifier width={20} />
          </button>
          {isPending ? (
            <div className="w-8 h-8 rounded-full border border-gray-700 animate-pulse bg-gray-800"></div>
          ) : session ? (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 focus:outline-none cursor-pointer"
              >
                <div className="relative w-9 h-9 rounded-full border border-[#e8dcb8]/40 overflow-hidden bg-[#1f2019]">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#e8dcb8] text-sm font-bold bg-[#1a1b16]">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
                <span className="hidden sm:inline text-sm text-[#e8dcb8] hover:text-white font-medium max-w-[100px] truncate">
                  {user?.name}
                </span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1f2019] border border-[#3a3c2f] rounded-lg shadow-xl py-2 z-50 text-left">
                  <div className="px-4 py-2 border-b border-[#3a3c2f] mb-1">
                    <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>

                  <Link href="/profile" className={dropdownItemClass}>
                    Profile
                  </Link>

                  <button 
                    onClick={toggleTheme}
                    className="w-full text-left px-4 py-2.5 text-[#e8dcb8] hover:bg-[#e8dcb8] hover:text-[#1a1b16] transition-colors text-sm flex items-center justify-between cursor-pointer"
                  >
                    <span>Theme</span>
                    <span className="text-xs font-semibold uppercase px-1.5 py-0.5 rounded bg-black/40 text-white">
                      {theme === "dark" ? "Dark 🌙" : "Light ☀️"}
                    </span>
                  </button>

                  <div className="border-t border-[#3a3c2f]/40 my-1"></div>
                  
                  <Link href="/dashboard/user" className={dropdownItemClass}>
                    Buyer Dashboard
                  </Link>
                  <Link href="/dashboard/artist" className={dropdownItemClass}>
                    Artist Dashboard
                  </Link>
                  <Link href="/dashboard/admin" className={dropdownItemClass}>
                    Admin Dashboard
                  </Link>

                  <Link href="/profile" className={dropdownItemClass}>
                    Settings
                  </Link>

                  <div className="border-t border-[#3a3c2f]/40 my-1"></div>

                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-sm font-medium cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/auth/signin" className="text-[#e8dcb8] hover:text-white transition-colors font-medium text-xs sm:text-sm">
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                variant="bordered" 
                radius="sm"
                className="text-[#e8dcb8] border-[#e8dcb8] hover:bg-[#e8dcb8] hover:text-[#1a1b16] font-semibold text-xs sm:text-sm px-2.5 py-1.5 sm:px-3 sm:py-2 border"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION / DYNAMIC PAGE TITLE --- */}

      {/* This creates the large "About Us" style text centered below the nav */}
      <div className="flex flex-1 items-center justify-center w-full pb-10 relative z-10">
        <div className="flex flex-col items-center gap-4 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#e8dcb8] tracking-wide text-center drop-shadow-lg">
            {pageTitle}
          </h1>
          {/* Optional: The small arrow below the text as seen in the image */}
          <ChevronDown width={24} height={24} className="text-[#e8dcb8] mt-2 opacity-80" />
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <div 
        className={`absolute top-[80px] left-0 w-full bg-[#1a1b16]/95 backdrop-blur-xl border-t border-[#3a3c2f]/50 transition-all duration-400 ease-in-out lg:hidden overflow-hidden z-30 ${
          isMenuOpen ? "max-h-[850px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col md:flex-row p-8 gap-10">
          <ul className="flex flex-col gap-6 w-full md:w-1/2">
            {["Home", "Pages", "Exhibitions", "Shop", "Collections", "Contact Us", "Dashboard"].map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="text-3xl font-serif text-[#e8dcb8] hover:text-white transition-all flex items-center group w-max"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-300 ml-2">→</span>
                </Link>
              </li>
            ))}
            {!session && (
              <li className="mt-4 flex flex-col gap-4 border-t border-[#3a3c2f] pt-6 sm:hidden">
                <Link href="/auth/signin" className="text-xl text-[#e8dcb8]" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                <Link href="/auth/signup" className="w-full text-center bg-[#e8dcb8] text-[#1a1b16] font-bold py-2.5 rounded-sm" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </li>
            )}
          </ul>

          {/* Contact Details in Mobile Menu */}
          <div className="flex flex-col gap-8 mt-6 md:mt-0 border-t border-[#3a3c2f] md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-10">
            <div>
              <p className="text-sm text-gray-400 mb-2 font-sans tracking-widest uppercase">Have a Project?</p>
              <a href="mailto:info@website.com" className="text-lg text-[#e8dcb8] border-b border-[#e8dcb8] hover:text-white transition-colors">
                info@website.com
              </a>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2 font-sans tracking-widest uppercase">Want to Work with Us?</p>
              <Link href="/contact" className="text-lg text-[#e8dcb8] flex items-center gap-2 hover:text-white transition-colors group">
                Send Brief <span className="group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2 font-sans tracking-widest uppercase">Want to Buy?</p>
              <Link href="/shop" className="text-lg text-[#e8dcb8] flex items-center gap-2 hover:text-white transition-colors group">
                Go to Shop <span className="group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}