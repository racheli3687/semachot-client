type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="מעבר בין עמודים">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        → הקודם
      </button>

      <span> עמוד {page} מתוך {totalPages} </span>

      <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        הבא ←
      </button>
    </nav>
  );
}