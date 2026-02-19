import { useNavigate } from "react-router-dom"
import { ArrowLeft, Check } from "lucide-react"
import { useState, useEffect } from "react"

export default function ThemeGlobal() {
  const navigate = useNavigate()
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    const saved = localStorage.getItem("globalTheme")
    if (saved) setTheme(saved)
  }, [])

  const applyTheme = (value) => {
    setTheme(value)
    localStorage.setItem("globalTheme", value)
    document.body.className = ""
document.body.classList.add(`theme-${value}`)
window.dispatchEvent(new Event("themeChange"))
  }

  const Item = ({ value, label }) => (
    <button
      onClick={() => applyTheme(value)}
      className="w-full themed-card rounded-2xl p-4 flex justify-between items-center"
    >
      <span>{label}</span>
      {theme === value && <Check size={18} />}
    </button>
  )

  return (
    <div className="min-h-screen themed-page p-4">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full themed-card flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Tema Global</h1>
      </div>

      {/* OPTIONS */}
      <div className="space-y-3">
      <Item value="light" label="Terang" />  
        <Item value="dark" label="Gelap" />
        <Item value="liquid" label="Liquid Glass" />
        <Item value="neo" label="Neobrutalism" />
        <Item value="pastel" label="Pastel"/>
      </div>
    </div>
  )
}