export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Page {page} of {pages}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="pagination-btn pagination-btn-inactive disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        {getPageNumbers().map((num, idx) =>
          num === '...' ? (
            <span key={`dots-${idx}`} className="px-2 text-gray-400">...</span>
          ) : (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`pagination-btn ${
                num === page ? 'pagination-btn-active' : 'pagination-btn-inactive'
              }`}
            >
              {num}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="pagination-btn pagination-btn-inactive disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
