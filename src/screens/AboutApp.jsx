import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { FaTelegramPlane, FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa"

export default function AboutApp() {
  const navigate = useNavigate()

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
        <h1 className="text-lg font-semibold">Tentang Aplikasi</h1>
      </div>

      {/* CONTENT */}
      <div className="bg-zinc-800 rounded-2xl p-4 space-y-3 animate-fadeIn">
        <p className="text-sm text-zinc-300">
          Cash Flow adalah aplikasi pencatat keuangan sederhana untuk membantu
          kamu mengelola pemasukan dan pengeluaran.
        </p>
        <div className="border-t border-zinc-700 pt-3 space-y-1 text-sm">
<p className="text-sm text-zinc-300">
          Made with <bold>"Vibe Code"</bold> Chat GPT, Acode, Termux 
        </p>
        </div>

        <div className="border-t border-zinc-700 pt-3 space-y-1 text-sm">
          <p><span className="text-zinc-400">Versi:</span> 1.0.0</p>
          <p><span className="text-zinc-400">Developer:</span> Yang tau tau aja</p>
        </div>
      </div>
      {/* SOCIAL MEDIA */}
<div className="pt-3">
  <p className="text-sm text-zinc-400 text-center mb-3">Ikuti kami</p>

 <div className="flex justify-center gap-4 mt-4">
    
    <a
      href="https://t.me/frmnFx"
      target="_blank"
      className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center"
    >
      <FaTelegramPlane size={18} />
    </a>

    <a
      href="https://instagram.com/frmn.fx"
      target="_blank"
      className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center"
    >
      <FaInstagram size={18} />
    </a>

    <a
      href="https://tiktok.com/@frmnfx"
      target="_blank"
      className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center"
    >
      <FaTiktok size={18} />
    </a>

    <a
      href="https://www.facebook.com/firmansyah.289046"
      target="_blank"
      className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center"
    >
      <FaFacebook size={18} />
    </a>

  </div>
</div>
    </div>
  )
}