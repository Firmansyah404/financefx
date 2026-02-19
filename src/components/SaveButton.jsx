export default function SaveButton({
  disabled = false,
  onClick,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          w-full h-14 rounded-full font-semibold text-lg
          transition-all duration-200
          ${disabled
            ? "bg-blue-500/40 text-white/60"
            : "bg-blue-500 text-white active:scale-[0.98]"
          }
        `}
      >
        Simpan &amp; Selesai
      </button>
    </div>
  )
}