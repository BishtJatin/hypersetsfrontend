"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // optional: icons

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) =>
    pathname === path ? "text-blue-500 font-semibold" : "text-gray-700";

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          Hyprsets
        </Link>

        {/* Mobile menu icon */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Links (desktop) */}
        <div className="hidden md:flex gap-6">
          <Link href="/" className={isActive("/")}>
            Home
          </Link>
          <Link href="/login" className={isActive("/login")}>
            Login
          </Link>
          <Link href="/register" className={isActive("/register")}>
            Register
          </Link>
          <Link href="/profile" className={isActive("/profile")}>
            Profile
          </Link>
          <Link href="/leaderboard" className={isActive("/leaderboard")}>
            Leaderboard
          </Link>
        </div>
      </div>

      {/* Links (mobile dropdown) */}
      {isOpen && (
        <div className="flex flex-col mt-4 gap-3 md:hidden px-4">
          <Link href="/" className={isActive("/")}>
            Home
          </Link>
          <Link href="/login" className={isActive("/login")}>
            Login
          </Link>
          <Link href="/register" className={isActive("/register")}>
            Register
          </Link>
          <Link href="/profile" className={isActive("/profile")}>
            Profile
          </Link>
          <Link href="/leaderboard" className={isActive("/leaderboard")}>
            Leaderboard
          </Link>
        </div>
      )}
    </nav>
  );
}
