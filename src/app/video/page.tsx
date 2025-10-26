"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Pagination } from "@/components/ui/pagination";
import { paginateItems } from "@/lib/news-utils";
import Image from "next/image";

export default function VideoPage() {
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
        Error loading videos
      </div>
    );

  const videos = data?.data?.videos || [];
  const paginatedVideos = paginateItems(videos, currentPage, itemsPerPage);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-headline font-bold text-white mb-6">
          Videos
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedVideos.items.map((v: any) => (
            <div
              key={v.videoDetail_id || v.id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 group cursor-pointer"
            >
              <div className="relative w-full aspect-video">
                {v.fileName ? (
                  <>
                    <iframe
                      src={v.fileName}
                      title={v.videoTitle}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-end">
                      <div className="p-4 w-full">
                        <h2 className="text-lg font-semibold text-white line-clamp-2 drop-shadow-lg">
                          {v.videoTitle}
                        </h2>
                      </div>
                    </div>
                  </>
                ) : v.image ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={v.image}
                      alt={v.videoTitle || v.videoTitle}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                      <div className="text-center p-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-white line-clamp-2">
                          {v.videoTitle}
                        </h2>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-lg">
                    <div className="text-center p-4">
                      <svg
                        className="w-16 h-16 text-gray-400 mx-auto mb-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                      </svg>
                      <p className="text-sm text-gray-300">
                        Video not available
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {paginatedVideos.totalPages > 1 && (
          <div className="mt-12 mb-8">
            <div className="flex flex-col items-center space-y-4">
              {/* Page Info */}
              <div className="text-sm text-gray-400">
                Page {currentPage} of {paginatedVideos.totalPages} •{" "}
                {videos.length} total videos
              </div>

              {/* Pagination Component */}
              <Pagination
                currentPage={currentPage}
                totalPages={paginatedVideos.totalPages}
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
                    setCurrentPage(paginatedVideos.totalPages);
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                  disabled={currentPage === paginatedVideos.totalPages}
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
