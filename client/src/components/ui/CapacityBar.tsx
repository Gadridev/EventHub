export function CapacityBar({
  used,
  capacity,
  large = false,
}: {
  used: number;
  capacity: number;
  large?: boolean;
}) {
  return (
    <div
      role="progressbar"
      aria-label="Seat utilization"
      aria-valuenow={used}
      aria-valuemin={0}
      aria-valuemax={capacity}
      className={`overflow-hidden rounded bg-border ${large ? "h-3.5" : "h-2"}`}
    >
      <div
        className="h-full rounded bg-accent"
        style={{
          width: `${capacity > 0 ? Math.min(100, (used / capacity) * 100) : 0}%`,
        }}
      />
    </div>
  );
}
