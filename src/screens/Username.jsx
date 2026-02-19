import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Username() {
  const [name, setName] = useState("")
  const navigate = useNavigate()

  const handleNext = () => {
    const trimmed = name.trim()
    if (!trimmed) return

    // simpan username
    localStorage.setItem("username", trimmed)

    // ⬇️ WAJIB: paksa React pindah route
    navigate("/create-wallet", { replace: true })
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Nama Panggilan
      </h1>

      <p className="text-zinc-400 mb-6 text-center">
        Anda ingin dipanggil apa?
      </p>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama kamu"
        className="bg-zinc-800 rounded-xl px-4 py-3 text-white w-full max-w-xs mb-8 outline-none"
      />

      <button
        onClick={handleNext}
        disabled={!name.trim()}
        className="bg-indigo-600 px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
      >
        Berikutnya
      </button>
    </div>
  )
}