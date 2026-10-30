import Icon from "./ui/Icon";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="מעבר בין עמודים" className="mt-8 flex items-center justify-center gap-3">
      <button type="button" className="btn btn-secondary btn-icon sm:w-auto sm:px-4" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <Icon name="chevronRight" /> <span className="hidden sm:inline">הקודם</span><span className="sr-only sm:hidden">הקודם</span>
      </button>

      <span className="text-sm whitespace-nowrap text-muted">
        עמוד <strong className="font-semibold text-ink">{page}</strong> מתוך {totalPages}
      </span>

      <button type="button" className="btn btn-secondary btn-icon sm:w-auto sm:px-4" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        <span className="hidden sm:inline">הבא</span><span className="sr-only sm:hidden">הבא</span> <Icon name="chevronLeft" />
      </button>
    </nav>
  );
}
