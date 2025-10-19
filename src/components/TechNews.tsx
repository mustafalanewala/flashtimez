"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { NewsItem } from "@/lib/types";
import { fetcher } from "@/lib/fetcher";
import { formatDate, getImageUrl, getExcerpt } from "@/lib/news-utils";
import { Cpu, ArrowRight, Clock, TrendingUp } from "lucide-react";

export default function TechNews() {
  const { data: news, isLoading } = useSWR("/api/news", fetcher);

  if (isLoading) {
    return (
      <div className="news-grid">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flash-card overflow-hidden">
            <div className="h-48 loading-shimmer"></div>
            <div className="p-6 space-y-3">
              <div className="h-4 loading-shimmer rounded w-20"></div>
              <div className="h-6 loading-shimmer rounded"></div>
              <div className="h-4 loading-shimmer rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="text-center py-12">
        <Cpu className="h-12 w-12 text-flash-muted mx-auto mb-4" />
        <p className="text-flash-muted">No technology news available</p>
      </div>
    );
  }

  // Filter for technology news
  const techNews = news
    .filter(
      (item: NewsItem) =>
        item.categrory_Name?.toLowerCase().includes("technology") ||
        item.categrory_Name?.toLowerCase().includes("tech")
    )
    .slice(0, 3) as NewsItem[];

  // If no tech news found, use general news with tech-related keywords
  const displayNews =
    techNews.length > 0 ? techNews : (news.slice(0, 4) as NewsItem[]);

  return (
    <div>
      <div className="news-grid">
        {displayNews.map((article: NewsItem, index: number) => (
          <article
            key={article.news_Id || index}
            className="flash-card overflow-hidden group"
          >
            <Link href={`/news/${article.slug}`}>
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={getImageUrl(article)}
                  alt={article.news_Title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Tech Badge */}
                <div className="absolute top-3 left-3">
                  <div className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    <Cpu className="h-3 w-3" />
                    <span>TECH</span>
                  </div>
                </div>

                {/* Trending Badge (for first article) */}
                {index === 0 && (
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 bg-flash-accent text-white px-2 py-1 rounded-full text-xs">
                      <TrendingUp className="h-3 w-3" />
                      <span>HOT</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-flash-muted mb-3">
                  <span>{article.news_Source}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(article.insert_Date)}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-headline font-semibold text-lg text-white group-hover:text-blue-600 transition-colors mb-3 line-clamp-2 leading-tight">
                  {article.news_Title}
                </h3>

                {/* Excerpt */}
                <p className="text-flash-muted text-sm line-clamp-2 mb-4 leading-relaxed">
                  {getExcerpt(article.news_Content, 100)}
                </p>

                {/* Read More */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-all group-hover:gap-2">
                    <span className="text-sm font-medium">Read More</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>

                  <span className="category-pill text-xs">
                    {article.categrory_Name}
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
