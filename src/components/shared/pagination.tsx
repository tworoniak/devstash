import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

function pageUrl(basePath: string, page: number): string {
  return `${basePath}?page=${page}`;
}

function getPages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];
  const lo = Math.max(2, current - 1);
  const hi = Math.min(total - 1, current + 1);

  if (lo > 2) pages.push('ellipsis');
  for (let p = lo; p <= hi; p++) pages.push(p);
  if (hi < total - 1) pages.push('ellipsis');
  pages.push(total);

  return pages;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPages(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const baseLink =
    'flex items-center justify-center h-8 min-w-[2rem] px-2 rounded text-sm transition-colors';
  const activeLink = `${baseLink} bg-accent text-foreground font-medium`;
  const inactiveLink = `${baseLink} text-muted-foreground hover:text-foreground hover:bg-accent/50`;
  const disabledLink = `${baseLink} text-muted-foreground/40 pointer-events-none select-none`;

  return (
    <nav className="flex items-center justify-center gap-1 pt-6" aria-label="Pagination">
      {hasPrev ? (
        <Link href={pageUrl(basePath, currentPage - 1)} className={inactiveLink} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={disabledLink} aria-disabled="true" aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {pages.map((page, i) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${i}`}
            className="flex items-center justify-center h-8 w-8 text-sm text-muted-foreground/40"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={pageUrl(basePath, page)}
            className={page === currentPage ? activeLink : inactiveLink}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Link>
        )
      )}

      {hasNext ? (
        <Link href={pageUrl(basePath, currentPage + 1)} className={inactiveLink} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={disabledLink} aria-disabled="true" aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
