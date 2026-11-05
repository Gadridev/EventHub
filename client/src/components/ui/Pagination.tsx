import { Button } from "./Button";

export function Pagination({
  page,
  totalPages,
  total,
  noun,
  loading,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  noun: string;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  return (
    <nav
      aria-label={`${noun} pagination`}
      className="flex items-center justify-between gap-3"
    >
      <Button
        disabled={page <= 1 || loading}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-muted">
        Page {page} of {Math.max(1, totalPages)} · {total} {noun}
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
