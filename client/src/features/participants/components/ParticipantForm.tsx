import { useState } from "react";
import type { Participant } from "../../../types";
import { Modal, PreviewNotice } from "../../../components/ui/Modal";
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
  onSubmit?: (values: ParticipantFormValues) => void;
  loading?: boolean;
  error?: string;
}) {
  const [values, setValues] = useState<ParticipantFormValues>(
    initialValues ?? { fullName: "", email: "", phone: null },
  );
  return (
    <Modal
      title={initialValues ? "Edit participant" : "Add participant"}
      onClose={onClose}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(values);
        }}
      >
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
        {!onSubmit && <PreviewNotice />}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button primary type="submit" disabled={!onSubmit || loading}>
            {loading ? "Saving…" : "Save participant"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
