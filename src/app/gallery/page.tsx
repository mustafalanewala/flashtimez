"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Pagination } from "@/components/ui/pagination";
import { paginateItems } from "@/lib/news-utils";
import Image from "next/image";

export default function GalleryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Fewer items per page since galleries are larger

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
        Error loading galleries
      </div>
    );

  const galleries = data?.data?.galleries || [];
  const paginatedGalleries = paginateItems(
    galleries,
    currentPage,
    itemsPerPage
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-headline font-bold text-white mb-6">
          Galleries
        </h1>

        <div className="space-y-8">
          {paginatedGalleries.items.map((g: any) => (
            <section
              key={g.galleryMaster_id || g.id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  {g.galleryMaster_Title}
                </h2>
                <span className="text-sm text-gray-400">
                  {new Date(
                    g.insert_Date || g.insertDate || ""
                  ).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(g.gallerDetailList || g.galleryDetailList || []).map(
                  (img: any) => (
                    <div
                      key={
                        img.gallery_Detail_id ||
                        img.galleryDetailId ||
                        img.fileName
                      }
                      className="relative h-36 w-full rounded overflow-hidden"
                    >
                      <Image
                        src={img.fileName}
                        alt={g.galleryMaster_Title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Pagination */}
        {paginatedGalleries.totalPages > 1 && (
          <div className="mt-12 mb-8">
            <div className="flex flex-col items-center space-y-4">
              {/* Page Info */}
              <div className="text-sm text-gray-400">
                Page {currentPage} of {paginatedGalleries.totalPages} •{" "}
                {galleries.length} total galleries
              </div>

              {/* Pagination Component */}
              <Pagination
                currentPage={currentPage}
                totalPages={paginatedGalleries.totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  // Scroll to top of galleries section
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
                    setCurrentPage(paginatedGalleries.totalPages);
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                  disabled={currentPage === paginatedGalleries.totalPages}
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
