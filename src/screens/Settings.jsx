import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function Settings() {
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
        <h1 className="text-lg font-semibold">Pengaturan</h1>
      </div>

      {/* LIST MENU */}
      <div className="space-y-3">

        <button className="w-full themed-card rounded-2xl p-4 text-left">
          Akun
        </button>

        <button className="w-full themed-card rounded-2xl p-4 text-left">
          Dompet & Kartu
        </button>

        <button className="w-full themed-card rounded-2xl p-4 text-left">
          Kategori
        </button>
        
       <button
  onClick={() => navigate("/settings/theme-global")}
  className="w-full themed-card rounded-2xl p-4 text-left"
>
  Tema
</button>

        <button className="w-full themed-card rounded-2xl p-4 text-left">
          Backup & Penyimpanan
        </button>
        
        <button
  onClick={() => navigate("/settings/about")}
  className="w-full themed-card rounded-2xl p-4 text-left"
>
  Tentang Aplikasi
</button>

        <button className="w-full themed-card rounded-2xl p-4 text-left text-rose-400">
          Keluar
        </button>
      </div>
    </div>
  )
}