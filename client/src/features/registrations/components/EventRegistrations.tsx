import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { ListState } from "../../../components/ui/ListState";
import { Pagination } from "../../../components/ui/Pagination";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { dateLabel } from "../../../lib/dates";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage";
import { useAuth } from "../../auth/hooks/useAuth";
import { useRegistrations } from "../hooks/useRegistrations";
import { RegistrationCreatePanel } from "./RegistrationCreatePanel";
import { RegistrationActionDialog } from "./RegistrationActionDialog";
import type {
  RegistrationDetails,
  RegistrationUpdateStatus,
} from "../registrations.api";

export function EventRegistrations({
  eventId,
  eventStatus,
}: {
  eventId: string;
  eventStatus: string;
}) {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<{
    registration: RegistrationDetails;
    status: RegistrationUpdateStatus;
  } | null>(null);
  const canManage = user?.role === "admin" || user?.role === "staff";
  const registrations = useRegistrations({ page, limit: 10, eventId });

  function renderContent() {
    if (registrations.isPending)
      return <ListState state="loading" noun="registrations" />;
    if (registrations.isError)
      return (
        <ListState
          state="error"
          noun="registrations"
          errorMessage={getApiErrorMessage(
            registrations.error,
            "Unable to load registrations.",
          )}
          onRetry={() => void registrations.refetch()}
        />
      );
    if (registrations.data.data.length === 0)
      return <ListState state="empty" noun="registrations" />;
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr>
              <th>Participant</th>
              <th>Status</th>
              <th>Registered</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {registrations.data.data.map((registration) => (
              <tr key={registration.id}>
                <td>
                  {registration.participant.fullName}
                  <p className="text-[13px] text-muted">
                    {registration.participant.email}
                  </p>
                </td>
                <td>
                  <StatusBadge status={registration.status} />
                </td>
                <td className="whitespace-nowrap text-muted">
                  {dateLabel(registration.createdAt)}
                </td>
                <td>
                  <div className="flex justify-end gap-1">
                    {canManage &&
                      registration.status === "pending" &&
                      eventStatus === "published" && (
                        <Button
                          onClick={() =>
                            setAction({ registration, status: "confirmed" })
                          }
                        >
                          Confirm
                        </Button>
                      )}
                    {canManage && registration.status !== "cancelled" && (
                      <Button
                        onClick={() =>
                          setAction({ registration, status: "cancelled" })
                        }
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <section className="rounded-card border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl">Registrations</h2>
        {canManage && (
          <div
            title={
              eventStatus === "published"
                ? undefined
                : "Publish this event before registering participants."
            }
          >
            <RegistrationCreatePanel
              eventId={eventId}
              disabled={eventStatus !== "published"}
            />
          </div>
        )}
      </div>
      {renderContent()}
      {registrations.data && (
        <Pagination
          {...registrations.data.pagination}
          noun="registrations"
          loading={registrations.isFetching}
          onPageChange={setPage}
        />
      )}
      {action && (
        <RegistrationActionDialog
          key={`${action.registration.id}-${action.status}`}
          {...action}
          onClose={() => setAction(null)}
        />
      )}
    </section>
  );
}
