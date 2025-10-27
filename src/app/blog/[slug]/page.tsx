"use client";

import { use } from "react";
import useSWR from "swr";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { fetcher } from "@/lib/fetcher";
import { formatDate } from "@/lib/news-utils";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data, error, isLoading } = useSWR("/api/news", fetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Error Loading Blog
          </h1>
          <p className="text-gray-300">Please try again later.</p>
        </div>
      </div>
    );
  }

  const blogsData = data?.data?.blogs || [];
  const blogItem = blogsData.find(
    (item: any) => (item.slug || item.Slug) === slug
  );

  if (!blogItem) {
    notFound();
  }

  const relatedBlogs = blogsData
    .filter((item: any) => (item.slug || item.Slug) !== slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-gray-400 hover:text-flash-accent transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-600">/</span>
            <Link
              href="/blog"
              className="text-gray-400 hover:text-flash-accent transition-colors"
            >
              Blog
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium truncate">
              {blogItem.blog_Title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
              {/* Header */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-4 py-2 bg-flash-accent rounded-full text-sm font-semibold text-white">
                    Blog
                  </span>
                  <span className="text-gray-300 text-sm font-medium">
                    {formatDate(
                      blogItem.insert_Date || blogItem.insertDate || ""
                    )}
                  </span>
                  <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                  <span className="text-gray-300 text-sm">
                    Language: {blogItem.language || "English"}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  {blogItem.blog_Title}
                </h1>

                {/* Social Share */}
                <div className="flex items-center space-x-4 pb-6 border-b border-gray-700">
                  <span className="text-gray-300 font-medium">Share:</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        const url = encodeURIComponent(window.location.href);
                        const text = encodeURIComponent(blogItem.blog_Title);
                        window.open(
                          `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045C7.728 8.088 4.1 6.128 1.671 3.149c-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        const url = encodeURIComponent(window.location.href);
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                      className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        const url = encodeURIComponent(window.location.href);
                        window.open(
                          `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {blogItem.image && (
                <div className="relative h-64 sm:h-80 lg:h-96">
                  <Image
                    src={blogItem.image}
                    alt={blogItem.blog_Title}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 sm:p-8">
                <div className="prose prose-lg max-w-none prose-invert">
                  {blogItem.blog_Summary && (
                    <div
                      className="text-gray-300 leading-relaxed text-lg"
                      dangerouslySetInnerHTML={{
                        __html: blogItem.blog_Summary,
                      }}
                    />
                  )}

                  {blogItem.blog_Content && (
                    <div className="mt-6">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: blogItem.blog_Content,
                        }}
                      />
                    </div>
                  )}

                  {/* Additional content for better reading experience */}
                  <p className="text-gray-300 leading-relaxed mt-6">
                    This blog post provides valuable insights into the topic.
                    Our editorial team ensures that all content is
                    well-researched and presented in an engaging manner.
                  </p>
                </div>

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-gray-300 font-medium">Tags:</span>
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                      Blog
                    </span>
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                      {blogItem.language || "English"}
                    </span>
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                      Featured
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  Related Blogs
                </h3>
                <div className="space-y-4">
                  {relatedBlogs.map((item: any) => (
                    <Link
                      key={item.blog_id || item.blogId || item.id}
                      href={`/blog/${item.slug || item.Slug || ""}`}
                      className="block group"
                    >
                      <div className="flex space-x-3">
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.blog_Title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white group-hover:text-flash-accent transition-colors duration-200 line-clamp-2">
                            {item.blog_Title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(
                              item.insert_Date || item.insertDate || ""
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Blogs */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">
                Popular Blogs
              </h3>
              <div className="space-y-4">
                {blogsData
                  .filter((item: any) => (item.slug || item.Slug) !== slug)
                  .sort(
                    (a: any, b: any) =>
                      new Date(b.insert_Date || b.insertDate || "").getTime() -
                      new Date(a.insert_Date || a.insertDate || "").getTime()
                  )
                  .slice(0, 5)
                  .map((item: any) => (
                    <Link
                      key={item.blog_id || item.blogId || item.id}
                      href={`/blog/${item.slug || item.Slug || ""}`}
                      className="block group"
                    >
                      <div className="flex space-x-3">
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.blog_Title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white group-hover:text-flash-accent transition-colors duration-200 line-clamp-2 leading-tight">
                            {item.blog_Title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-400">
                              {formatDate(
                                item.insert_Date || item.insertDate || ""
                              )}
                            </span>
                            <span className="text-xs text-flash-primary font-medium">
                              Blog
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
