import { type ReactNode } from "react";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal" onClick={onCancel}>
      <div 
        className="confirm-dialog" 
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="confirm-title">{title}</h2>
        <p className="confirm-message">{message}</p>
        <div className="confirm-buttons">
          <button className="confirm-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="confirm-delete" onClick={onConfirm}>
            Apagar
          </button>
        </div>
      </div>
    </div>
  );
}
