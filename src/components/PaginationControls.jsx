import React from 'react';

// Simple Chevron Icons (or use an icon library like react-icons)
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);


export default function PaginationControls({ currentPage, totalPages, onPageChange }) {

  // Don't render pagination if there's only one page or less
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    if (pageNumber !== currentPage) {
      onPageChange(pageNumber);
    }
  };

  // Generate page numbers array: [1, 2, ..., totalPages]
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Basic button styling (customize as needed)
  const baseButtonClass = "px-[11px] sm:px-3 py-1 hover:bg-arsenic transition-colors duration-150 ease-in-out";
  const inactiveButtonClass = "bg-muted-blue text-cultured";
  const activeButtonClass = "bg-persian-pink hover:bg-persian-pink font-bold text-white cursor-default";
  const disabledButtonClass = "opacity-50 hover:bg-muted-blue";

  return (
    <nav aria-label="Song list pagination" className="flex items-center justify-center sm:mt-6 sm:mb-4">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`${baseButtonClass} ${inactiveButtonClass} ${currentPage === 1 ? disabledButtonClass : ''} flex items-center space-x-1 mr-2`}
        aria-label="Go to previous page"
      >
        <ChevronLeftIcon />
        <span>Prev</span>
      </button>

      {/* Page Number Buttons */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageClick(pageNumber)}
            disabled={pageNumber === currentPage}
            className={`${baseButtonClass} ${pageNumber === currentPage ? activeButtonClass : inactiveButtonClass}`}
            aria-current={pageNumber === currentPage ? 'page' : undefined} // Accessibility
            aria-label={`Go to page ${pageNumber}`}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`${baseButtonClass} ${inactiveButtonClass} ${currentPage === totalPages ? disabledButtonClass : ''} flex items-center space-x-1 ml-2`}
        aria-label="Go to next page"
      >
         <span>Next</span>
        <ChevronRightIcon />
      </button>
    </nav>
  );
}