import type { ReactNode } from "react";

type PopupProps = {
  open: boolean;
  title?: string;

  message?: ReactNode;
  content?: ReactNode;

  onClose: () => void;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;

  onConfirm?: () => void;
};

export default function Popup({
  open,
  message,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}: PopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white w-full max-w-sm mx-4 rounded-xl shadow-lg flex flex-col">

        {/* BODY */}
        <div className="p-4 space-y-3 text-center">
          {message && (
            <div className="text-sm text-gray-600">{message}</div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="p-2 flex gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border p-2 rounded"
          >
            {cancelText}
          </button>

          {onConfirm && (
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-red-500 text-white p-2 rounded disabled:opacity-50"
            >
              {loading ? "Loading..." : confirmText}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}