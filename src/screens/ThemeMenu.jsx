import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function ThemeMenu() {
  const navigate = useNavigate()

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
        <h1 className="text-lg font-semibold">Tema</h1>
      </div>

      {/* MENU */}
      <div className="space-y-3">

        <button
          onClick={() => navigate("/settings/theme-global")}
          className="w-full themed-card rounded-2xl p-4 text-left"
        >
          Tema Global
        </button>

        <button
          onClick={() => navigate("/settings/theme")}
          className="w-full themed-card rounded-2xl p-4 text-left"
        >
          Tema Navigasi Bar
        </button>

      </div>
    </div>
  )
}