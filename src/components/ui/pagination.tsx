"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination logic
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push("...");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        pages.push(1);
        if (totalPages > 5) {
          pages.push("...");
        }
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show current page with context
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div
      className={cn("flex items-center justify-center space-x-2", className)}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
          currentPage === 1
            ? "text-gray-500 cursor-not-allowed bg-gray-800"
            : "text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-800"
        )}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </button>

      <div className="flex items-center space-x-1">
        {getPageNumbers().map((pageNumber, index) => (
          <button
            key={index}
            onClick={() => {
              if (typeof pageNumber === "number") {
                onPageChange(pageNumber);
              }
            }}
            disabled={pageNumber === "..."}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pageNumber === currentPage
                ? "bg-flash-primary text-white"
                : pageNumber === "..."
                ? "text-gray-500 cursor-default bg-gray-800"
                : "text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-800"
            )}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
          currentPage === totalPages
            ? "text-gray-500 cursor-not-allowed bg-gray-800"
            : "text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-800"
        )}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
}
