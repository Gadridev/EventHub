import { useState } from "react";
import type { FormEvent } from "react";
import { toLocalDateTime, toIsoDateTime } from "../../../lib/dates";
import type { Event } from "../../../types";
import { Modal, PreviewNotice } from "../../../components/ui/Modal";
import { Input, Textarea } from "../../../components/ui/Fields";
import { Button } from "../../../components/ui/Button";
export type EventFormValues = Pick<
  Event,
  "title" | "description" | "location" | "eventDate" | "maxParticipants"
>;
interface EventFormProps {
  onClose: () => void;
  onSubmit?: (values: EventFormValues) => void;
  initialValues?: EventFormValues;
  loading?: boolean;
  error?: string;
}
export function EventForm({
  onClose,
  onSubmit,
  initialValues,
  loading = false,
  error,
}: EventFormProps) {
  const [values, setValues] = useState(
    initialValues
      ? {
          title: initialValues.title,
          description: initialValues.description,
          location: initialValues.location,
          maxParticipants: initialValues.maxParticipants,
          eventDate: toLocalDateTime(initialValues.eventDate),
        }
      : {
          title: "",
          description: "",
          location: "",
          eventDate: "",
          maxParticipants: 50,
        },
  );
  function handleClose() {
    if (!loading) onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !onSubmit) return;
    // Keep the original instant (including seconds) when the date is unchanged.
    const eventDate =
      initialValues &&
      values.eventDate === toLocalDateTime(initialValues.eventDate)
        ? initialValues.eventDate
        : toIsoDateTime(values.eventDate);
    onSubmit({ ...values, eventDate });
  }

  return (
    <Modal
      title={initialValues ? "Edit event" : "New event"}
      onClose={handleClose}
    >
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <Input
          label="Title"
          required
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
        <Input
          label="Location"
          required
          value={values.location}
          onChange={(e) => setValues({ ...values, location: e.target.value })}
        />
        <Textarea
          label="Description"
          required
          value={values.description}
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Event date (local time)"
            type="datetime-local"
            required
            value={values.eventDate}
            onChange={(e) =>
              setValues({
                ...values,
                eventDate: e.target.value,
              })
            }
          />
          <Input
            label="Capacity"
            type="number"
            min={1}
            required
            value={values.maxParticipants}
            onChange={(e) =>
              setValues({
                ...values,
                maxParticipants: e.target.valueAsNumber || 0,
              })
            }
          />
        </div>
        {error && (
          <p role="alert" className="text-danger">
            {error}
          </p>
        )}
        {!onSubmit && <PreviewNotice />}
        <div className="flex justify-end gap-2">
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button primary type="submit" disabled={!onSubmit || loading}>
            {loading
              ? "Saving…"
              : initialValues
                ? "Save changes"
                : "Create draft"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
