import { useState } from "react";
import type { FormEvent } from "react";
import type { Participant } from "../../../types";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Fields";
import { Button } from "../../../components/ui/Button";
export type ParticipantFormValues = Pick<
  Participant,
  "fullName" | "email" | "phone"
>;
export function ParticipantForm({
  initialValues,
  onClose,
  onSubmit,
  loading = false,
  error,
}: {
  initialValues?: ParticipantFormValues;
  onClose: () => void;
  onSubmit: (values: ParticipantFormValues) => void;
  loading?: boolean;
  error?: string;
}) {
  const [values, setValues] = useState<ParticipantFormValues>(
    initialValues
      ? {
          fullName: initialValues.fullName,
          email: initialValues.email,
          phone: initialValues.phone,
        }
      : { fullName: "", email: "", phone: null },
  );
  function handleClose() {
    if (!loading) {
      onClose();
    }
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) {
      return;
    }
    onSubmit(values);
  }
  return (
    <Modal
      title={initialValues ? "Edit participant" : "Add participant"}
      onClose={handleClose}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="Full name"
          required
          value={values.fullName}
          onChange={(e) => setValues({ ...values, fullName: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          required
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
        <Input
          label="Phone (optional)"
          type="tel"
          value={values.phone ?? ""}
          onChange={(e) =>
            setValues({ ...values, phone: e.target.value || null })
          }
        />
        {error && (
          <p role="alert" className="text-danger">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button primary type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save participant"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
