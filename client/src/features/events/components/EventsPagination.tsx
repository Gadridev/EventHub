import { Button } from "../../../components/ui/Button";

type EventsPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  onPageChange: (page: number) => void;
};

export function EventsPagination({
  page,
  totalPages,
  total,
  loading,
  onPageChange,
}: EventsPaginationProps) {
  return (
    <nav
      aria-label="Events pagination"
      className="flex items-center justify-between gap-3"
    >
      <Button
        disabled={page <= 1 || loading}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-muted">
        Page {page} of {Math.max(1, totalPages)} · {total} events
      </span>
      <Button
        disabled={page >= totalPages || loading}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
