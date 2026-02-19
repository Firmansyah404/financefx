import { useNavigate } from "react-router-dom"
import { Check, ArrowLeft } from "lucide-react"
import { useState } from "react"

export default function Theme() {
  const navigate = useNavigate()

  const [theme, setTheme] = useState(
    localStorage.getItem("globalTheme") || "dark"
  )

  const changeTheme = (value) => {
    localStorage.setItem("globalTheme", value)
    setTheme(value)
    window.dispatchEvent(new Event("themeChange"))
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold">Tema</h1>
      </div>

      <div className="space-y-3">
        {/* DARK */}
        <button
          onClick={() => changeTheme("dark")}
          className={`w-full rounded-2xl p-4 flex justify-between items-center transition
            ${theme === "dark"
              ? "bg-indigo-500"
              : "bg-zinc-800"}
          `}
        >
          <span>Gelap</span>
          {theme === "dark" && <Check />}
        </button>

        {/* LIQUID */}
        <button
          onClick={() => changeTheme("liquid")}
          className={`w-full rounded-2xl p-4 flex justify-between items-center transition
            ${theme === "liquid"
              ? "bg-indigo-500"
              : "bg-zinc-800"}
          `}
        >
          <span>Liquid Glass</span>
          {theme === "liquid" && <Check />}
        </button>
      </div>
    </div>
  )
}