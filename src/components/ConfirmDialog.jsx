export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Hapus",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  danger = false,
}) {
  if (!open) return null

  return (
<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      {/* BACKDROP BLUR */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* DIALOG */}
<div className="
  bg-zinc-900 z-10 rounded-2xl w-[90%] max-w-sm
  animate-[scaleIn_.18s_ease-out]
">
        {/* CONTENT */}
        <div className="p-5 text-center">
          <h2 className="text-lg font-semibold mb-1">
            {title}
          </h2>

          {message && (
<p className="text-sm text-zinc-400 whitespace-pre-line leading-relaxed">
              {message}
            </p>
          )}
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-zinc-800" />

        {/* BUTTONS */}
        <div className="flex">
          <button
            onClick={onCancel}
            className="
              flex-1 py-3
              text-sm font-medium
              text-white
              active:bg-zinc-800
              transition
            "
          >
            {cancelText}
          </button>

          <div className="w-px bg-zinc-800" />

          <button
            onClick={onConfirm}
            className={`
              flex-1 py-3
              text-sm font-medium
              transition
              active:bg-zinc-800
              ${
                danger
                  ? "text-rose-500"
                  : "text-emerald-400"
              }
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}