import { Button } from "./Button";
import { AlertCircle, LoaderCircle, SearchX } from "lucide-react";
import { fieldClass } from "./Fields";
export type PreviewState = "ready" | "loading" | "empty" | "error";
export function StatePreview({
  value,
  onChange,
}: {
  value: PreviewState;
  onChange: (state: PreviewState) => void;
}) {
  return (
    <details className="text-xs text-muted">
      <summary className="w-fit cursor-pointer">Preview display states</summary>
      <label className="mt-2 flex max-w-xs items-center gap-3">
        Display state
        <select
          className={fieldClass}
          value={value}
          onChange={(e) => {
            const next = e.target.value;
            if (
              next === "ready" ||
              next === "loading" ||
              next === "empty" ||
              next === "error"
            )
              onChange(next);
          }}
        >
          <option value="ready">Default</option>
          <option value="loading">Loading</option>
          <option value="empty">Empty</option>
          <option value="error">Error</option>
        </select>
      </label>
    </details>
  );
}
export function ListState({
  state,
  noun,
  errorMessage,
  onRetry,
}: {
  state: Exclude<PreviewState, "ready">;
  noun: string;
  errorMessage?: string;
  onRetry?: () => void;
}) {
  const Icon =
    state === "loading"
      ? LoaderCircle
      : state === "error"
        ? AlertCircle
        : SearchX;
  return (
    <div
      role={state === "error" ? "alert" : "status"}
      className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-card border border-border bg-surface p-8 text-muted"
    >
      <Icon
        size={24}
        className={state === "loading" ? "motion-safe:animate-spin" : ""}
      />
      <p>
        {state === "loading"
          ? `Loading ${noun}…`
          : state === "error"
            ? (errorMessage ?? `Unable to load ${noun}.`)
            : `No ${noun} match these filters.`}
      </p>
      {state === "error" && !onRetry && (
        <p className="text-xs">
          This is an error-state preview. Choose Default to return to the sample
          data.
        </p>
      )}
      {state === "error" && onRetry && <Button onClick={onRetry}>Retry</Button>}
    </div>
  );
}
