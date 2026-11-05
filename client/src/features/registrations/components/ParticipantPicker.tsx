import { useState } from "react";
import { PagedSelect } from "../../../components/ui/PagedSelect";
import type { Selection } from "../../../components/ui/PagedSelect";
import { useParticipants } from "../../participants/hooks/useParticipants";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage";

export function ParticipantPicker({
  selected,
  onChange,
}: {
  selected: Selection | null;
  onChange: (selection: Selection | null) => void;
}) {
  const [query, setQuery] = useState({ page: 1, limit: 10, search: "" });
  const participants = useParticipants(query);
  return (
    <PagedSelect
      label="Participant"
      placeholder="Choose a participant"
      selected={selected}
      options={(participants.data?.data ?? []).map((person) => ({
        id: person.id,
        label: `${person.fullName} — ${person.email}`,
      }))}
      pagination={participants.data?.pagination}
      loading={participants.isFetching}
      error={
        participants.error
          ? getApiErrorMessage(
              participants.error,
              "Unable to load participants.",
            )
          : undefined
      }
      onChange={onChange}
      onSearch={(search) => setQuery({ ...query, search, page: 1 })}
      onPageChange={(page) => setQuery({ ...query, page })}
      onRetry={() => void participants.refetch()}
    />
  );
}
