"use client";

import { usePathname, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/ui/pagination";

interface PaginatorProps {
  totalPages: number;
  currentPage: number;
  siblingCount?: number;
}

const Paginator = ({
  totalPages,
  currentPage,
  siblingCount = 2,
}: PaginatorProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper function to create page URL
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Helper function to generate page numbers array
  const generatePaginationNumbers = () => {
    // Always show first and last page
    const firstPage = 1;
    const lastPage = totalPages;

    // Calculate range around current page based on siblingCount
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Initialize markers for when to show ellipsis
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Generate the final array of numbers and ellipsis markers
    const pageNumbers: (number | string)[] = [];

    // Always add first page
    pageNumbers.push(firstPage);

    // Add left ellipsis if needed
    if (shouldShowLeftDots) {
      pageNumbers.push("leftEllipsis");
    }

    // Add page numbers around current page
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== firstPage && i !== totalPages) {
        pageNumbers.push(i);
      }
    }

    // Add right ellipsis if needed
    if (shouldShowRightDots) {
      pageNumbers.push("rightEllipsis");
    }

    // Always add last page if it's not already included
    if (lastPage !== 1) {
      pageNumbers.push(lastPage);
    }

    return pageNumbers;
  };

  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  const pageNumbers = generatePaginationNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {pageNumbers.map((pageNumber, index) => {
          // Handle ellipsis
          if (pageNumber === "leftEllipsis" || pageNumber === "rightEllipsis") {
            return (
              <PaginationItem key={`${pageNumber}-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          // Handle numbered pages
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={createPageURL(pageNumber)}
                isActive={currentPage === pageNumber}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={createPageURL(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginator;
