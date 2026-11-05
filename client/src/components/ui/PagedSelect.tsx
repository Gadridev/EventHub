import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Input, Select } from "./Fields";
import { Button } from "./Button";
import type { PaginationData } from "../../types";

export type Selection = { id: string; label: string };
export type SelectOption = Selection & { disabled?: boolean };

export function PagedSelect({
  label,
  placeholder,
  selected,
  options,
  pagination,
  loading,
  error,
  onSearch,
  onPageChange,
  onChange,
  onRetry,
}: {
  label: string;
  placeholder: string;
  selected: Selection | null;
  options: SelectOption[];
  pagination?: PaginationData;
  loading: boolean;
  error?: string;
  onSearch: (search: string) => void;
  onPageChange: (page: number) => void;
  onChange: (selection: Selection | null) => void;
  onRetry: () => void;
}) {
  const [search, setSearch] = useState("");
  const selectedOnPage = options.some((option) => option.id === selected?.id);

  function handleSelection(id: string) {
    if (!id) {
      onChange(null);
      return;
    }
    const option = options.find((item) => item.id === id);
    if (option) {
      onChange({ id: option.id, label: option.label });
    }
  }

  function handleSearch() {
    onSearch(search.trim());
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <Input
            label={`Search ${label.toLowerCase()}`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          Search
        </Button>
      </div>
      <Select
        label={label}
        value={selected?.id ?? ""}
        disabled={loading || Boolean(error)}
        onChange={(event) => handleSelection(event.target.value)}
      >
        <option value="">{placeholder}</option>
        {selected && !selectedOnPage && (
          <option value={selected.id}>{selected.label} (selected)</option>
        )}
        {options.map((option) => (
          <option key={option.id} value={option.id} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </Select>
      {loading && (
        <p role="status" className="text-xs text-muted">
          Loading options…
        </p>
      )}
      {error && (
        <div role="alert" className="text-xs text-danger">
          {error} <Button onClick={onRetry}>Retry</Button>
        </div>
      )}
      {!loading && !error && pagination && (
        <div
          className="flex items-center justify-between gap-2 text-xs text-muted"
          aria-label={`${label} options pagination`}
        >
          <Button
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          <span>
            Page {pagination.page} of {Math.max(1, pagination.totalPages)} ·{" "}
            {pagination.total} results
          </span>
          <Button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
      {!loading && !error && options.length === 0 && (
        <p className="text-xs text-muted">
          No matching options. Try another search.
        </p>
      )}
    </div>
  );
}
