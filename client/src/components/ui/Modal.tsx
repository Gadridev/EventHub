import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const focusable = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-32px)] max-w-[462px] overflow-y-auto rounded-card border border-border bg-surface p-5 text-ink shadow-xl backdrop:bg-sidebar/70"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id={titleId} className="text-2xl">
          {title}
        </h2>
        <Button
          aria-label="Close dialog"
          onClick={onClose}
          className="!min-h-8 !p-1.5"
        >
          <X size={16} />
        </Button>
      </div>
      {children}
    </dialog>
  );
}
export function ConfirmDialog({
  title,
  description,
  onClose,
  onConfirm,
}: {
  title: string;
  description: string;
  onClose: () => void;
  onConfirm?: () => void;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="mb-4 text-muted">{description}</p>
      {!onConfirm && <PreviewNotice />}
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onClose}>Go back</Button>
        <Button primary disabled={!onConfirm} onClick={onConfirm}>
          {title}
        </Button>
      </div>
    </Modal>
  );
}
export function PreviewNotice() {
  return (
    <p className="text-xs leading-relaxed text-muted">
      UI preview only. Submission will be available when this form is connected.
    </p>
  );
}
