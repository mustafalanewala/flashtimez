"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { formatDate, getImageUrl } from "@/lib/news-utils";
import { NewsItem } from "@/lib/types";
import { ChevronLeft, ChevronRight, Play, Clock, User } from "lucide-react";

export default function HeroSection() {
  const { data: news, isLoading } = useSWR("/api/news", fetcher);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get featured news (first 5 articles)
  const featuredNews: NewsItem[] = news?.slice(0, 5) || [];

  // Auto-advance slides
  useEffect(() => {
    if (featuredNews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [featuredNews.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredNews.length) % featuredNews.length
    );
  };

  if (isLoading) {
    return (
      <div className="relative h-96 lg:h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="loading-shimmer w-full h-full"></div>
        </div>
      </div>
    );
  }

  if (!featuredNews.length) return null;

  const currentNews = featuredNews[currentSlide];

  return (
    <section className="relative overflow-hidden">
      {/* Main Hero Slider */}
      <div className="relative h-96 lg:h-[600px]">
        {featuredNews.map((article: NewsItem, index: number) => (
          <div
            key={article.news_Id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={getImageUrl(article)}
                alt={article.news_Title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-end">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-20 w-full">
                <div className="max-w-3xl">
                  {/* Breaking Badge */}
                  <div className="mb-4">
                    <span className="breaking-badge">BREAKING NEWS</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-headline font-bold text-white mb-4 leading-tight">
                    {article.news_Title}
                  </h1>

                  {/* Description */}
                  <p className="text-lg lg:text-xl text-gray-200 mb-6 line-clamp-2">
                    {article.news_Content?.slice(0, 200)}...
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center gap-6 text-sm text-gray-300 mb-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{article.news_Source || "FlashTimez Staff"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(article.insert_Date)}</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/news/${article.slug}`}
                      className="btn-flash-primary"
                    >
                      Read Full Story
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-4 flex items-center">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        <div className="absolute inset-y-0 right-4 flex items-center">
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {featuredNews.map((_: NewsItem, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Secondary Headlines */}
      <div className="bg-white border-b border-flash-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredNews
              .slice(1, 4)
              .map((article: NewsItem, index: number) => (
                <Link
                  key={article.news_Id || index}
                  href={`/news/${article.slug}`}
                  className="group"
                >
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={getImageUrl(article)}
                        alt={article.news_Title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-flash-secondary group-hover:text-flash-primary transition-colors line-clamp-2 mb-2">
                        {article.news_Title}
                      </h3>
                      <p className="text-sm text-flash-muted">
                        {formatDate(article.insert_Date)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
