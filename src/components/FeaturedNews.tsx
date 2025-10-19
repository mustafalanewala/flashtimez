"use client";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { formatDate, getImageUrl, getExcerpt } from "@/lib/news-utils";
import { NewsItem } from "@/lib/types";
import { Clock, ArrowRight, Flame } from "lucide-react";

export default function FeaturedNews() {
  const { data: news, isLoading } = useSWR("/api/news", fetcher);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded-xl"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-flash-muted">No featured news available</p>
      </div>
    );
  }

  const featuredArticle = news[0] as NewsItem;
  const sideArticles = news.slice(1, 5) as NewsItem[];

  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-flash-gradient rounded-full flex items-center justify-center">
          <Flame className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-3xl font-headline font-bold text-white">
          Featured Stories
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-flash-primary/20 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Featured Article */}
        <article className="group">
          <Link href={`/news/${featuredArticle.slug}`}>
            <div className="flash-card overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
              <div className="relative h-64 lg:h-80">
                <Image
                  src={getImageUrl(featuredArticle)}
                  alt={featuredArticle.news_Title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="category-pill bg-flash-primary text-white">
                    {featuredArticle.categrory_Name}
                  </span>
                </div>

                {/* Read Time */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                    <Clock className="h-3 w-3" />
                    <span>5 min</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl lg:text-2xl font-headline font-bold text-white group-hover:text-flash-accent transition-colors mb-3 line-clamp-2">
                  {featuredArticle.news_Title}
                </h3>

                <p className="text-gray-300 mb-4 line-clamp-3">
                  {getExcerpt(featuredArticle.news_Content, 150)}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{featuredArticle.news_Source}</span>
                    <span>•</span>
                    <span>{formatDate(featuredArticle.insert_Date)}</span>
                  </div>

                  <div className="flex items-center gap-1 text-flash-accent group-hover:gap-2 transition-all">
                    <span className="text-sm font-medium">Read More</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </article>

        {/* Side Articles */}
        <div className="space-y-2">
          <h3 className="text-xl font-headline font-semibold text-white mb-6">
            More Headlines
          </h3>

          {sideArticles.map((article: NewsItem, index: number) => (
            <article key={article.news_Id || index} className="group">
              <Link href={`/news/${article.slug}`}>
                <div className="flex gap-4 p-4 rounded-lg hover:bg-gray-800/50 transition-colors bg-gray-900/30">
                  <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={getImageUrl(article)}
                      alt={article.news_Title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <span className="category-pill text-xs bg-flash-primary text-white">
                        {article.categrory_Name}
                      </span>
                    </div>

                    <h4 className="font-semibold text-white group-hover:text-flash-accent transition-colors line-clamp-2 mb-2">
                      {article.news_Title}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{formatDate(article.insert_Date)}</span>
                      <span>•</span>
                      <span>3 min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
