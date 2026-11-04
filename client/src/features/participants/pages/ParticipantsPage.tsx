import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Participant } from "../../../types";
import { participants, dateLabel } from "../../../data/mockData";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { fieldClass } from "../../../components/ui/Fields";
import { ConfirmDialog } from "../../../components/ui/Modal";
import { StatePreview, ListState } from "../../../components/ui/ListState";
import type { PreviewState } from "../../../components/ui/ListState";
import { ParticipantForm } from "../components/ParticipantForm";
export function ParticipantsPage() {
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<Participant | "new" | null>(null);
  const [remove, setRemove] = useState<Participant | null>(null);
  const [state, setState] = useState<PreviewState>("ready");
  const visible = participants.filter((person) =>
    `${person.fullName} ${person.email}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
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
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {state === "ready" && visible.length ? (
        <div className="relative overflow-x-auto rounded-card border border-border bg-surface">
          <table className="w-full min-w-[800px] border-collapse [&_td]:py-2">
            <caption className="sr-only">Participant directory</caption>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Created</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((person) => (
                <tr key={person.id}>
                  <td>{person.fullName}</td>
                  <td>{person.email}</td>
                  <td className="whitespace-nowrap text-muted">
                    {person.phone ?? "—"}
                  </td>
                  <td className="whitespace-nowrap">
                    {dateLabel(person.createdAt)}
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <Button
                        aria-label={`Edit ${person.fullName}`}
                        onClick={() => setForm(person)}
                        className="!min-h-7 !p-1.5"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        aria-label={`Delete ${person.fullName}`}
                        onClick={() => setRemove(person)}
                        className="!min-h-7 !p-1.5"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ListState
          state={state === "ready" ? "empty" : state}
          noun="participants"
        />
      )}
      <StatePreview value={state} onChange={setState} />
      {form && (
        <ParticipantForm
          initialValues={form === "new" ? undefined : form}
          onClose={() => setForm(null)}
        />
      )}
      {remove && (
        <ConfirmDialog
          title="Delete participant"
          description={`Review deletion of ${remove.fullName}. This preview does not delete any records.`}
          onClose={() => setRemove(null)}
        />
      )}
    </>
  );
}
