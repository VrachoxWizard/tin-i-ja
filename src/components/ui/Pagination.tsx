"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  total: number;
  pageSize: number;
  currentPage: number;
}

export function Pagination({ total, pageSize, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Straničenje"
      className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground"
    >
      <span>
        Stranica {currentPage} od {totalPages} · {total} ukupno
      </span>
      <div className="flex items-center gap-2">
        {hasPrev ? (
          <Link href={buildHref(currentPage - 1)}>
            <Button variant="outline" size="sm" className="rounded-none gap-1">
              <ChevronLeft className="w-3.5 h-3.5" />
              Prethodna
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" className="rounded-none gap-1" disabled>
            <ChevronLeft className="w-3.5 h-3.5" />
            Prethodna
          </Button>
        )}
        {hasNext ? (
          <Link href={buildHref(currentPage + 1)}>
            <Button variant="outline" size="sm" className="rounded-none gap-1">
              Sljedeća
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" className="rounded-none gap-1" disabled>
            Sljedeća
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </nav>
  );
}

export function parsePage(searchParams: Record<string, string | undefined>): number {
  const raw = searchParams["page"];
  const n = raw ? parseInt(raw, 10) : 1;
  return Number.isFinite(n) && n >= 1 ? n : 1;
}
