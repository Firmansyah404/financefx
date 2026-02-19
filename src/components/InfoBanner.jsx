export default function InfoBanner() {
  return (
    <div className="mx-4 mt-4 bg-zinc-800 rounded-xl p-3 flex gap-3">
      <span className="text-yellow-400">⚠️</span>
      <p className="text-sm text-zinc-300">
        Create a login to avoid losing data and sync across devices.
      </p>
    </div>
  )
}