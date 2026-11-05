import { Pencil, Trash2 } from "lucide-react";
import type { Participant } from "../../../types";
import { dateLabel } from "../../../lib/dates";
import { Button } from "../../../components/ui/Button";

export function ParticipantsTable({
  participants,
  onEdit,
  onDelete,
}: {
  participants: Participant[];
  onEdit: (participant: Participant) => void;
  onDelete: (participant: Participant) => void;
}) {
  return (
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
          {participants.map((person) => (
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
                    onClick={() => onEdit(person)}
                    className="!min-h-7 !p-1.5"
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    aria-label={`Delete ${person.fullName}`}
                    onClick={() => onDelete(person)}
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
  );
}
