// Utilities for working with NewsItem data without hardcoding content.
import type { NewsItem } from "./types"

export function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function slugifyCategory(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export function getCategories(items: NewsItem[]) {
  if (!Array.isArray(items)) {
    return []
  }
  const set = new Set(
    items.filter((i) => i.categrory_Name?.trim()).map((i) => i.categrory_Name.trim()),
  )
  return Array.from(set).sort()
}

export function getBySlug(items: NewsItem[], slug: string) {
  if (!Array.isArray(items)) {
    return undefined
  }
  return items.find((i) => i.slug === slug)
}

export function filterByCategory(items: NewsItem[], categorySlug: string) {
  if (!Array.isArray(items)) {
    return []
  }
  return items.filter((i) => slugifyCategory(i.categrory_Name) === categorySlug)
}

export function getCategoryFromSlug(items: NewsItem[], categorySlug: string) {
  if (!Array.isArray(items)) {
    return categorySlug
  }
  const found = items.find((i) => slugifyCategory(i.categrory_Name) === categorySlug)
  return found?.categrory_Name || categorySlug
}

export function paginateItems<T>(items: T[], page: number, itemsPerPage: number = 12) {
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = items.slice(startIndex, endIndex)
  const totalPages = Math.ceil(items.length / itemsPerPage)

  return {
    items: paginatedItems,
    totalPages,
    currentPage: page,
    totalItems: items.length,
    hasNext: page < totalPages,
    hasPrevious: page > 1
  }
}

export function getImageUrl(article: NewsItem): string {
  // Return the image URL if available, otherwise return a default placeholder
  if (article.image && article.image.trim()) {
    return article.image;
  }

  // Return a default placeholder image based on category
  const category = article.categrory_Name?.toLowerCase() || 'general';

  // You can customize these placeholder images based on your needs
  const placeholders = {
    business: '/images/placeholder-business.jpg',
    technology: '/images/placeholder-tech.jpg',
    sports: '/images/placeholder-sports.jpg',
    entertainment: '/images/placeholder-entertainment.jpg',
    health: '/images/placeholder-health.jpg',
    science: '/images/placeholder-science.jpg',
    general: '/images/placeholder-news.jpg'
  };

  return placeholders[category as keyof typeof placeholders] || placeholders.general;
}

export function getExcerpt(content: string, maxLength: number = 150): string {
  if (!content) return '';

  if (content.length <= maxLength) return content;

  // Try to break at a word boundary
  const truncated = content.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.7) {
    return truncated.slice(0, lastSpace) + '...';
  }

  return truncated + '...';
}

export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return formatDate(dateString);
}