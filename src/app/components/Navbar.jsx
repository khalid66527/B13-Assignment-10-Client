"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { ChevronDown } from "@gravity-ui/icons";
import { useSession, authClient } from "@/lib/auth-client";
import { useCart } from "@/lib/context/CartContext";
import { useAICurator } from "@/lib/context/AICuratorContext";
import { Icon } from "@iconify/react";

export default function CustomHeader() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userRole = user?.role || null;
  const { cartCount, openCart } = useCart();
  const { openCurator } = useAICurator();


  // console.log('userdata ', user)

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const pathname = usePathname();

  useEffect(() => {
    const localTheme = localStorage.getItem("theme") || "dark";
    setTheme(localTheme);
    if (localTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const handleClose = () => setIsProfileOpen(false);
    if (isProfileOpen) {
      document.addEventListener("click", handleClose);
    }
    return () => document.removeEventListener("click", handleClose);
  }, [isProfileOpen]);

  useEffect(() => {
    if (user) {
      fetch("/api/jwt")
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch token");
          return res.json();
        })
        .then(data => {
          if (data?.token) {
            localStorage.setItem("jwt_token", data.token);
            document.cookie = `jwt_token=${data.token}; path=/; max-age=604800; SameSite=Strict`;
          }
        })
        .catch(err => console.error("Error setting JWT token:", err));
    } else if (!isPending) {
      localStorage.removeItem("jwt_token");
      document.cookie = "jwt_token=; path=/; max-age=0";
    }
  }, [user, isPending]);



  const toggleTheme = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const currentTheme = document.documentElement.classList.contains("light") ? "light" : "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    localStorage.removeItem("jwt_token");
    document.cookie = "jwt_token=; path=/; max-age=0";
    setIsProfileOpen(false);
    window.location.reload();
  };

  // Helper function for active routes
  const isActive = (path) => pathname === path;
  
  // Custom styling classes
  const linkClass = "text-[#e8dcb8] hover:text-white transition-colors text-sm lg:text-base cursor-pointer flex items-center h-full py-4";
  const activeClass = "text-white font-bold border-b-2 border-[#e8dcb8]";
  const dropdownItemClass = "block px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors text-sm";

  // Dynamic Title Generator based on active route
  const getPageTitle = (path) => {
    if (path === "/") return "Home";
    if (path.startsWith("/about")) return "About Us";
    if (path.startsWith("/shop")) return "Shop";
    if (path.startsWith("/team")) return "Our Team";
    if (path.startsWith("/plans")) return "Pricing";
    
    // Fallback: Remove slashes, replace dashes with spaces, and capitalize
    const formatted = path.replace(/^\//, "").replace(/-/g, " ");
    return formatted ? formatted.charAt(0).toUpperCase() + formatted.slice(1) : "Home";
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <header 
      className="site-header sticky top-0 z-50 w-full border-b border-white/5 bg-[#0A0A0A]/85 backdrop-blur-xl flex flex-col"
    >
      {/* --- TOP NAVBAR SECTION --- */}
      <nav className="site-nav mx-auto flex h-20 w-[88%] max-w-[1400px] items-center justify-between px-2 sm:px-4 relative z-20">
        
        


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
              <Link href="/" className={`${linkClass} gap-1`}>
                Home 
              </Link>
              
            </li>

            {/* Pages Dropdown */}
            <li className="relative group h-full flex items-center">
              <span className={`${linkClass} gap-1`}>
                Pages <ChevronDown width={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <div className="absolute top-[70px] left-0 min-w-[180px] bg-[#1f2019] border border-[#3a3c2f] shadow-xl rounded-b-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <Link href="/about" className={dropdownItemClass}>About Us</Link>
                <Link href="/team" className={dropdownItemClass}>Our Team</Link>
                <Link href="/plans" className={dropdownItemClass}>Pricing</Link>
              </div>
            </li>

       

            <li className="h-full flex items-center"><Link href="/shop" className={`${linkClass} ${isActive("/shop") ? activeClass : ""}`}>Shop</Link></li>

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
          <Link href="/" className="flex items-center justify-center py-2 group">
            <Image
              src="/image/logo.png"
              alt="ArtHub Logo"
              width={90}
              height={38}
              className="object-contain h-9 sm:h-10 max-h-10 w-auto transition-transform group-hover:scale-105 duration-300"
              priority
            />
          </Link>
        </div>

       

        {/* --- RIGHT SIDE: Search, Cart & Auth --- */}
        <div className="flex flex-1 items-center justify-end gap-2.5 sm:gap-3 lg:gap-4">

          {/* Shopping Cart Trigger (Visible only when logged in) */}
          {session && (
            <button
              onClick={openCart}
              aria-label="View Cart"
              className="relative p-2 rounded-xl text-[#e8dcb8] hover:text-white hover:bg-white/5 transition-all flex items-center justify-center cursor-pointer group"
            >
              <Icon icon="solar:cart-large-4-bold-duotone" className="size-6 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black text-[10px] font-black size-5 rounded-full flex items-center justify-center shadow-lg border border-black animate-pulse">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          )}

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
                    {userRole && (
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#FFE58F]">
                        {userRole}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      openCurator();
                    }}
                    className="w-full text-left px-4 py-2.5 text-[#FFE58F] hover:text-white hover:bg-white/5 transition-colors text-sm flex items-center justify-between cursor-pointer font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <Icon icon="solar:stars-minimalistic-bold-duotone" className="size-4 text-[#D4AF37]" />
                      <span>AI Art Curator</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#FFE58F]">AI</span>
                  </button>

                  <Link href="/profile" className={dropdownItemClass} onClick={() => setIsProfileOpen(false)}>
                    Profile
                  </Link>

                  <button 
                    onClick={toggleTheme}
                    className="w-full text-left px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors text-sm flex items-center justify-between cursor-pointer"
                  >
                    <span>Theme</span>
                    <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#FFE58F]">
                      {theme === "dark" ? "Dark 🌙" : "Light ☀️"}
                    </span>
                  </button>

                  <div className="border-t border-[#3a3c2f]/40 my-1"></div>
                  
                  {/* Role-based Dashboard Link */}
                  {(userRole === "buyer" || userRole === "user") && (
                    <Link href="/dashboard/user" className={dropdownItemClass} onClick={() => setIsProfileOpen(false)}>
                      User Dashboard
                    </Link>
                  )}
                  {userRole === "artist" && (
                    <Link href="/dashboard/artist" className={dropdownItemClass} onClick={() => setIsProfileOpen(false)}>
                      Artist Dashboard
                    </Link>
                  )}
                  {userRole === "admin" && (
                    <Link href="/dashboard/admin" className={dropdownItemClass} onClick={() => setIsProfileOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}

                  <Link href="/profile" className={dropdownItemClass} onClick={() => setIsProfileOpen(false)}>
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
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                className="p-2 rounded-xl text-[#e8dcb8] hover:text-white hover:bg-white/5 transition-all flex items-center justify-center cursor-pointer"
              >
                {theme === "dark" ? (
                  <Icon icon="solar:sun-2-bold-duotone" className="size-5 text-[#D4AF37]" />
                ) : (
                  <Icon icon="solar:moon-bold-duotone" className="size-5 text-[#B45309]" />
                )}
              </button>
              <Link href="/auth/signin" className="text-[#e8dcb8] hover:text-white transition-colors font-medium text-xs sm:text-sm">
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="text-[#e8dcb8] border-[#e8dcb8] hover:bg-[#e8dcb8] hover:text-[#1a1b16] font-semibold text-xs sm:text-sm px-2.5 py-1.5 sm:px-3 sm:py-2 border rounded-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      

      <div 
        className={`absolute top-[80px] left-0 w-full bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/5 transition-all duration-400 ease-in-out lg:hidden overflow-hidden z-30 ${
          isMenuOpen ? "max-h-[850px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col md:flex-row p-8 gap-10 w-[88%] max-w-[1400px] mx-auto">
          <ul className="flex flex-col py-5 gap-6 w-full md:w-1/2">
            {["About", "Shop", "Team", "Plans"].map((item) => (
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

            {session && (
              <>
                <li className="border-t border-[#3a3c2f]/60 pt-4">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      openCurator();
                    }}
                    className="w-full text-left text-2xl font-serif text-[#FFE58F] hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Icon icon="solar:stars-minimalistic-bold-duotone" className="size-6 text-[#D4AF37]" />
                      <span>✨ AI Curator</span>
                    </div>
                    <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#FFE58F] border border-[#D4AF37]/30">
                      Advisor
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      openCart();
                    }}
                    className="text-2xl font-serif text-[#e8dcb8] hover:text-white transition-all flex items-center gap-3 group w-max cursor-pointer"
                  >
                    <span>My Cart</span>
                    <span className="text-xs bg-[#D4AF37]/20 text-[#FFE58F] font-sans font-extrabold px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                      {cartCount} {cartCount === 1 ? "item" : "items"}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-300 ml-1">→</span>
                  </button>
                </li>
                <li>
                  {(userRole === "buyer" || userRole === "user") && (
                    <Link
                      href="/dashboard/user"
                      className="text-2xl font-serif text-[#e8dcb8] hover:text-white transition-all flex items-center group w-max"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      User Dashboard
                      <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-300 ml-2">→</span>
                    </Link>
                  )}
                  {userRole === "artist" && (
                    <Link
                      href="/dashboard/artist"
                      className="text-2xl font-serif text-[#e8dcb8] hover:text-white transition-all flex items-center group w-max"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Artist Dashboard
                      <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-300 ml-2">→</span>
                    </Link>
                  )}
                  {userRole === "admin" && (
                    <Link
                      href="/dashboard/admin"
                      className="text-2xl font-serif text-[#e8dcb8] hover:text-white transition-all flex items-center group w-max"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                      <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-300 ml-2">→</span>
                    </Link>
                  )}
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="text-2xl font-serif text-[#e8dcb8] hover:text-white transition-all flex items-center group w-max"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                    <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-300 ml-2">→</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="text-xl font-serif text-red-400 hover:text-red-300 transition-all flex items-center"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            )}

            <li className="border-t border-[#3a3c2f]/60 pt-4">
              <button
                onClick={toggleTheme}
                className="w-full text-left text-xl font-serif text-[#e8dcb8] hover:text-white transition-all flex items-center justify-between"
              >
                <span>Switch Theme</span>
                <span className="text-sm font-sans font-semibold uppercase px-2 py-1 rounded bg-[#D4AF37]/20 text-[#FFE58F]">
                  {theme === "dark" ? "Dark 🌙" : "Light ☀️"}
                </span>
              </button>
            </li>

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