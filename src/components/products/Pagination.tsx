interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const baseBtn =
    "pagination-btn inline-flex h-[38px] items-center justify-center gap-2 rounded-[6px] border border-[#ddd] bg-[#f9f9f9] px-5 text-[13px] font-semibold uppercase tracking-[0.5px] text-[#333] transition-all duration-300 hover:border-saro-green hover:text-saro-green disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#ddd] disabled:hover:text-[#333]";

  const numberBtn =
    "pagination-btn pagination-btn-number inline-flex h-[38px] w-[38px] items-center justify-center rounded-[6px] border border-[#ddd] bg-[#f9f9f9] text-[13px] font-semibold text-[#333] transition-all duration-300 hover:border-saro-green hover:text-saro-green";

  const numberBtnActive =
    "pagination-btn pagination-btn-number active inline-flex h-[38px] w-[38px] items-center justify-center rounded-[6px] border border-saro-green bg-saro-green text-[13px] font-semibold text-white";

  return (
    <div className="pagination-container mt-[30px] flex flex-col items-center gap-5 border-t border-[#e5e5e5] pt-5 text-center">
      <div className="pagination-info">
        <span className="pagination-results text-[14px] text-[#666]">
          Showing {start}–{end} of {totalItems} products
        </span>
      </div>

      <div className="pagination-controls flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          className={`${baseBtn} pagination-btn-prev`}
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Previous
        </button>

        <div className="pagination-numbers flex items-center gap-2">
          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span
                key={`dots-${idx}`}
                className="pagination-ellipsis px-1 text-[#999]"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                className={currentPage === page ? numberBtnActive : numberBtn}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          className={`${baseBtn} pagination-btn-next`}
          aria-label="Next page"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
