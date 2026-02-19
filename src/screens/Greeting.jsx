import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Greeting() {
  const [name, setName] = useState("")
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-6">
      
      {/* HEADER */}
      <div className="mt-20 text-center">
        <h1 className="text-2xl font-semibold mb-2">
          Nama Panggilan
        </h1>
        <p className="text-zinc-400">
          Anda ingin dipanggil apa?
        </p>
        <p className="text-sm text-zinc-500 mt-1">
          Nama Anda hanya akan digunakan untuk sapaan.
        </p>
      </div>

      {/* INPUT */}
      <div className="w-full max-w-sm">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Misalnya: Firmansyah"
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-center outline-none"
        />
      </div>

      {/* ACTION */}
      <div className="w-full flex justify-end gap-3">
        <button
          disabled={!name}
          onClick={() => {
            localStorage.setItem("username", name)
            navigate("/create-wallet")
          }}
          className={`px-6 py-3 rounded-full font-medium transition
            ${name
              ? "bg-indigo-600 text-white"
              : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
            }`}
        >
          Berikutnya
        </button>
      </div>
    </div>
  )
}