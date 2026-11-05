import { useEffect, useState } from "react";
import type { Participant } from "../../../types";
import type { ParticipantsQuery } from "../participants.api";
import { useParticipants } from "../hooks/useParticipants";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { fieldClass } from "../../../components/ui/Fields";
import { ListState } from "../../../components/ui/ListState";
import { Pagination } from "../../../components/ui/Pagination";
import { ParticipantsTable } from "../components/ParticipantsTable";
import { ParticipantFormDialog } from "../components/ParticipantFormDialog";
import { ParticipantDeleteDialog } from "../components/ParticipantDeleteDialog";

export function ParticipantsPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState<ParticipantsQuery>({ page: 1, limit: 10 });
  const [form, setForm] = useState<Participant | "new" | null>(null);
  const [deletion, setDeletion] = useState<{
    participant: Participant;
    pageAfterDelete: number;
  } | null>(null);
  const participants = useParticipants(query);

  useEffect(() => {
    const timer = window.setTimeout(
      () =>
        setQuery((current) => ({ ...current, search: search.trim(), page: 1 })),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [search]);

  function handlePageChange(page: number) {
    setQuery((current) => ({ ...current, page }));
  }
  function openDelete(participant: Participant) {
    const pageAfterDelete =
      participants.data?.data.length === 1
        ? Math.max(1, query.page - 1)
        : query.page;
    setDeletion({ participant, pageAfterDelete });
  }
  function handleDeleted() {
    if (!deletion) {
      return;
    }
    handlePageChange(deletion.pageAfterDelete);
    setDeletion(null);
  }
  function renderParticipants() {
    if (participants.isPending)
      return <ListState state="loading" noun="participants" />;
    if (participants.isError)
      return (
        <ListState
          state="error"
          noun="participants"
          errorMessage={getApiErrorMessage(
            participants.error,
            "Unable to load participants.",
          )}
          onRetry={() => void participants.refetch()}
        />
      );
    if (participants.data.data.length === 0)
      return <ListState state="empty" noun="participants" />;
    return (
      <ParticipantsTable
        participants={participants.data.data}
        onEdit={setForm}
        onDelete={openDelete}
      />
    );
  }
  return (
    <>
      <PageHeader
        title="Participants"
        action={
          <Button primary onClick={() => setForm("new")}>
            Add participant
          </Button>
        }
      />
      <input
        aria-label="Search participants"
        placeholder="Search name or email"
        className={`${fieldClass} max-w-[360px]`}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {renderParticipants()}
      {participants.data && (
        <Pagination
          {...participants.data.pagination}
          noun="participants"
          loading={participants.isFetching}
          onPageChange={handlePageChange}
        />
      )}
      {form && (
        <ParticipantFormDialog
          key={form === "new" ? "new" : form.id}
          participant={form === "new" ? undefined : form}
          onClose={() => setForm(null)}
        />
      )}
      {deletion && (
        <ParticipantDeleteDialog
          participant={deletion.participant}
          onClose={() => setDeletion(null)}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}
