"use client";

import Link from "next/link";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import { fetcher } from "@/lib/fetcher";
import { getCategories, slugifyCategory } from "@/lib/news-utils";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Bell,
  Globe,
  Zap,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function Navbar() {
  const { data, isLoading } = useSWR("/api/news", fetcher);
  const categories = getCategories(data || []);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featuredCategories = categories.slice(0, 6);
  const allCategories = categories;

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="sticky top-0 z-50">
      {/* Breaking News Ticker */}
      <div className="bg-flash-gradient text-white py-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <Zap className="h-4 w-4 animate-pulse" />
              <span className="breaking-badge">BREAKING</span>
            </div>
            <div className="overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                <span className="text-sm font-medium">
                  Stay informed with FlashTimez - Latest breaking news from
                  around the world • International coverage you can trust •
                  Real-time updates 24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={cn(
          "bg-white/95 backdrop-blur-lg shadow-lg transition-all duration-300",
          isScrolled && "shadow-xl"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-3 border-b border-flash-light">
            {/* Left: Time & Location */}
            <div className="hidden lg:flex items-center gap-4 text-sm text-flash-muted">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{currentTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>Global Edition</span>
              </div>
            </div>

            {/* Center: Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="text-3xl font-headline font-bold">
                  <span className="gradient-text">Flash</span>
                  <span className="text-flash-secondary">Timez</span>
                </div>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-flash-gradient transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-flash-secondary/10 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-flash-secondary" />
              </button>

              <button className="p-2 rounded-full hover:bg-flash-secondary/10 transition-colors relative">
                <Bell className="h-5 w-5 text-flash-secondary" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-flash-accent rounded-full"></span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-flash-secondary/10 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-flash-secondary" />
                ) : (
                  <Menu className="h-6 w-6 text-flash-secondary" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="py-4 border-b border-flash-light">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-flash-muted" />
                <input
                  type="text"
                  placeholder="Search for news, topics, or keywords..."
                  className="w-full pl-12 pr-4 py-3 border border-flash-light rounded-lg focus:outline-none focus:ring-2 focus:ring-flash-primary focus:border-transparent bg-flash-secondary/5"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Main Navigation Links */}
          <div className="hidden lg:flex items-center justify-between py-4">
            <nav className="flex items-center space-x-8">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold text-flash-secondary hover:text-flash-primary transition-colors group"
              >
                <TrendingUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Home
              </Link>

              {featuredCategories.map((category) => (
                <Link
                  key={category}
                  href={`/category/${slugifyCategory(category)}`}
                  className="font-medium text-flash-secondary hover:text-flash-primary transition-colors relative group"
                >
                  {category}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-flash-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}

              {/* All Categories Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                  className="flex items-center gap-1 font-medium text-flash-secondary hover:text-flash-primary transition-colors"
                >
                  More
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isCategoriesOpen && (
                  <div
                    onMouseEnter={() => setIsCategoriesOpen(true)}
                    onMouseLeave={() => setIsCategoriesOpen(false)}
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-flash-light py-6 z-50"
                  >
                    <div className="px-6 mb-4">
                      <h3 className="font-headline font-semibold text-flash-secondary mb-2">
                        All Categories
                      </h3>
                      <p className="text-sm text-flash-muted">
                        Explore news by topic
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 px-6">
                      {allCategories.map((category) => (
                        <Link
                          key={category}
                          href={`/category/${slugifyCategory(category)}`}
                          className="p-3 rounded-lg hover:bg-flash-secondary/5 transition-colors group"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          <span className="text-sm font-medium text-flash-secondary group-hover:text-flash-primary transition-colors">
                            {category}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Removed Site ID and Language info */}
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-6 border-t border-flash-light">
              <div className="space-y-4">
                <Link
                  href="/"
                  className="flex items-center gap-3 py-2 font-semibold text-flash-secondary hover:text-flash-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <TrendingUp className="h-5 w-5" />
                  Home
                </Link>

                {allCategories.map((category) => (
                  <Link
                    key={category}
                    href={`/category/${slugifyCategory(category)}`}
                    className="block py-2 font-medium text-flash-secondary hover:text-flash-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
