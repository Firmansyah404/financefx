import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Wallet,
  Landmark,
  CreditCard,
  Banknote,
  ArrowLeft,
} from "lucide-react"
import { Palette } from "lucide-react"
import ColorPickerSheet from "../components/ColorPickerSheet"

export default function EditWallet() {
  const navigate = useNavigate()
  const { id } = useParams()
  const walletId = Number(id)

  const wallets = JSON.parse(localStorage.getItem("wallets") || "[]")
  const wallet = wallets.find((w) => w.id === walletId)

  if (!wallet) {
    return (
      <div className="min-h-screen themed-page p-4">
        <p className="themed-text">Dompet tidak ditemukan</p>
      </div>
    )
  }

  // ===== STATE =====
  const [name, setName] = useState(wallet.name)
  const [icon, setIcon] = useState(wallet.icon)
  const [color, setColor] = useState(wallet.color)
  const [includeInTotal, setIncludeInTotal] = useState(
    wallet.includeInTotal ?? true
  )

  const icons = [
    { key: "wallet", icon: Wallet },
    { key: "cash", icon: Banknote },
    { key: "bank", icon: Landmark },
    { key: "card", icon: CreditCard },
  ]

  const colors = [
    "#4f46e5",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#0ea5e9",
    "#a855f7",
  ]
  
  const [showColorPicker, setShowColorPicker] = useState(false)

const isGradient = color.startsWith("linear-gradient")


  const SelectedIcon =
    icons.find((i) => i.key === icon)?.icon || Wallet

  // ===== SAVE UPDATE =====
  const handleUpdate = () => {
    if (!name.trim()) return

    const updatedWallets = wallets.map((w) =>
      w.id === walletId
        ? {
            ...w,
            name,
            icon,
            color,
            includeInTotal,
          }
        : w
    )

    localStorage.setItem("wallets", JSON.stringify(updatedWallets))

    navigate(`/wallet/${walletId}`, {
      replace: true,
      state: {
        edited: true,
        walletName: name,
      },
    })
  }

  return (
    <div className="min-h-[100dvh] themed-page p-4 pb-32">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full themed-card flex items-center justify-center active:scale-95 transition"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-lg font-semibold themed-text">
          Edit Dompet
        </h1>
      </div>

      {/* PREVIEW CARD */}
      <div
        className="rounded-3xl p-5 mb-6 themed-card-shadow text-white"
        style={{ background: color }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 p-3 rounded-xl">
            <SelectedIcon size={22} className="text-white" />
          </div>
        </div>

        <p className="text-white/90">
          {name || "Nama Dompet"}
        </p>

        <p className="font-semibold text-white">
          Saldo:{" "}
          {wallet.balance.toLocaleString("id-ID")}
        </p>
      </div>

      {/* FORM */}
      <div className="space-y-6">

        {/* NAMA */}
        <div>
          <p className="text-sm themed-text-soft mb-2">
            Nama Dompet
          </p>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              w-full
              themed-card
              rounded-2xl
              p-4
              outline-none
              themed-text
            "
          />
        </div>

        {/* ICON */}
        <div>
          <p className="text-sm themed-text-soft mb-3">
            Ikon Dompet
          </p>

          <div className="flex gap-3">
            {icons.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.key}
                  onClick={() => setIcon(item.key)}
                  className={`
                    p-4 rounded-2xl transition
                    ${
                      icon === item.key
                        ? "bg-indigo-600 text-white"
                        : "themed-card themed-text-muted"
                    }
                  `}
                >
                  <Icon size={20} />
                </button>
              )
            })}
          </div>
        </div>

{/* WARNA */}
<div>
  <p className="text-sm themed-text-soft mb-3">
    Warna Dompet
  </p>

  <button
    onClick={() => setShowColorPicker(true)}
    className="
      w-full rounded-2xl p-4
      themed-card
      flex items-center justify-between
    "
    style={{
      background: isGradient ? color : undefined,
    }}
  >
    <span className="themed-text">
      Pilih Warna
    </span>

    <Palette size={18} />
  </button>
</div>

        {/* INCLUDE TOTAL */}
        <div className="themed-card rounded-2xl p-4 flex justify-between items-center">
          <div>
            <p className="font-medium themed-text">
              Sertakan dalam Saldo Total
            </p>

            <p className="text-sm themed-text-soft">
              Sertakan dompet dalam perhitungan saldo total
            </p>
          </div>

          {/* ✅ TOGGLE LURUS */}
<button
  onClick={() => setIncludeInTotal(!includeInTotal)}
  className={`
    relative w-14 h-8 rounded-full
    transition-colors duration-300 ease-in-out
    ${includeInTotal ? "bg-indigo-600" : "bg-zinc-400/50"}
  `}
>
  <div
    className={`
      absolute top-1 left-1
      w-6 h-6 rounded-full bg-white shadow-md
      transform transition-transform duration-300 ease-in-out
      ${includeInTotal ? "translate-x-6" : "translate-x-0"}
    `}
  />
</button>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="fixed bottom-6 left-4 right-4">
        <button
          onClick={handleUpdate}
          className="
            w-full
            bg-indigo-600
            text-white
            rounded-2xl
            py-4
            font-semibold
            active:scale-95
            transition
            shadow-lg
          "
        >
          Simpan Perubahan
        </button>
      </div>
      {showColorPicker && (
  <ColorPickerSheet
    selected={color}
    onSelect={(val) => {
      setColor(val)
      setShowColorPicker(false)
    }}
    onClose={() => setShowColorPicker(false)}
  />
)}
    </div>
  )
}