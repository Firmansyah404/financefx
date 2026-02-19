import { useState } from "react"
import WalletCard from "../components/WalletCard"
import {
  Wallet,
  Landmark,
  Banknote,
  CreditCard,
  TrendingUp,
  Coins,
} from "lucide-react"

export default function OnboardingWallet() {
  /* ===== WARNA ===== */
  const COLORS = [
    "#4f46e5",
    "#7c3aed",
    "#db2777",
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
  ]

  /* ===== ICON (TERBATAS SESUAI PERMINTAAN) ===== */
  const ICONS = [
    { key: "wallet", Icon: Wallet },
    { key: "bank", Icon: Landmark },
    { key: "cash", Icon: Banknote },
    { key: "card", Icon: CreditCard },
    { key: "invest", Icon: TrendingUp },
    { key: "coins", Icon: Coins },
  ]

  const [color, setColor] = useState(COLORS[0])
  const [icon, setIcon] = useState("wallet")
  const [showIconPicker, setShowIconPicker] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-4 pt-8 relative">
      <h1 className="text-xl font-bold mb-4 text-center">
        Buat Dompet Pertama Anda
      </h1>

      {/* PREVIEW CARD */}
      <WalletCard
        name="Kas"
        balance="Rp0"
        color={color}
        icon={icon}
      />

      {/* COLOR PICKER */}
      <div className="mt-5">
        <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`min-w-[44px] min-h-[44px] rounded-full transition
                ${color === c ? "ring-2 ring-white scale-110" : "opacity-80"}
              `}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* INPUTS */}
      <div className="mt-6 space-y-4">
        <div className="bg-neutral-800 rounded-xl p-4">
          <p className="text-sm opacity-60">Nama Dompet</p>
          <p className="font-semibold mt-1">misalnya Uang Tunai</p>
        </div>

        {/* SALDO + ICON BUTTON */}
        <div className="flex gap-3">
          <div className="flex-1 bg-neutral-800 rounded-xl p-4">
            <p className="text-sm opacity-60">Saldo Awal</p>
            <p className="font-semibold mt-1">Rp0</p>
          </div>

          {/* TOMBOL ICON */}
          <button
            onClick={() => setShowIconPicker(true)}
            className="bg-neutral-800 rounded-xl px-4 flex items-center justify-center"
          >
            <Wallet size={20} />
          </button>
        </div>
      </div>

      {/* ===== ICON PICKER MODAL ===== */}
      {showIconPicker && (
        <div className="fixed inset-0 bg-black/60 flex items-end z-50">
          <div className="bg-neutral-900 w-full rounded-t-3xl p-5">
            <div className="w-12 h-1 bg-neutral-700 rounded-full mx-auto mb-4" />

            <h2 className="text-lg font-semibold mb-4">
              Pilih Ikon
            </h2>

            <div className="grid grid-cols-4 gap-4">
              {ICONS.map(({ key, Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setIcon(key)
                    setShowIconPicker(false)
                  }}
                  className={`p-4 rounded-xl flex items-center justify-center
                    ${icon === key
                      ? "bg-indigo-600"
                      : "bg-neutral-800"}
                  `}
                >
                  <Icon size={24} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}