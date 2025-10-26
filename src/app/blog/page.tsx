"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Pagination } from "@/components/ui/pagination";
import { paginateItems } from "@/lib/news-utils";
import Image from "next/image";
import Link from "next/link";

function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Use internal API proxy to avoid CORS from client
  const apiUrl = "/api/news";
  const { data, error, isLoading } = useSWR(apiUrl, fetcher);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Error loading blogs
      </div>
    );

  const blogs = data?.data?.blogs || [];
  const paginatedBlogs = paginateItems(blogs, currentPage, itemsPerPage);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-headline font-bold text-white mb-6">
          Blog
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBlogs.items.map((b: any) => (
            <article
              key={b.blog_id || b.blogId || b.id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
            >
              <div className="relative h-44 w-full">
                {b.image && (
                  <Image
                    src={b.image}
                    alt={b.blog_Title || b.blog_Title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {b.blog_Title}
                </h2>
                <p className="text-sm text-gray-300 mb-4">
                  {stripHtml(
                    b.blog_Summary || b.blog_Summary || b.blog_Content
                  ).slice(0, 140)}
                  ...
                </p>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/blog/${b.slug || b.Slug || ""}`}
                    className="text-sm text-flash-primary font-medium"
                  >
                    Read more
                  </Link>
                  <span className="text-xs text-gray-400">
                    {b.language || ""}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {paginatedBlogs.totalPages > 1 && (
          <div className="mt-12 mb-8">
            <div className="flex flex-col items-center space-y-4">
              {/* Page Info */}
              <div className="text-sm text-gray-400">
                Page {currentPage} of {paginatedBlogs.totalPages} •{" "}
                {blogs.length} total blogs
              </div>

              {/* Pagination Component */}
              <Pagination
                currentPage={currentPage}
                totalPages={paginatedBlogs.totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  // Scroll to top of articles section
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="justify-center"
              />

              {/* Quick Navigation */}
              <div className="flex items-center space-x-4 text-sm">
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className="text-flash-accent hover:text-flash-primary disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  First
                </button>
                <span className="text-gray-600">|</span>
                <button
                  onClick={() => {
                    setCurrentPage(paginatedBlogs.totalPages);
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                  disabled={currentPage === paginatedBlogs.totalPages}
                  className="text-flash-accent hover:text-flash-primary disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
