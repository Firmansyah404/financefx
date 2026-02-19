export default function Toast({ message }) {
  if (!message) return null

  return (
    <div
      className="
        fixed top-5 left-1/2 -translate-x-1/2
        bg-zinc-900 text-white
        px-5 py-3 rounded-full
        shadow-2xl z-50
        animate-toast-enter
      "
    >
      <span className="text-sm">{message}</span>
    </div>
  )
}