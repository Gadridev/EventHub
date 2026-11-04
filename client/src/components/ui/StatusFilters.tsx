import { Button } from "./Button";
export function StatusFilters<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter by status"
    >
      {options.map((option) => (
        <Button
          key={option}
          primary={value === option}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className="capitalize"
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
