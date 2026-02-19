import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Wallet,
  Landmark,
  CreditCard,
  Banknote,
  ArrowLeft,
  Palette,
} from "lucide-react"
import ColorPickerSheet from "../components/ColorPickerSheet"

export default function AddWallet() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [icon, setIcon] = useState("wallet")
  const [color, setColor] = useState("#4f46e5")
  const [balance, setBalance] = useState(0)
  const [includeInTotal, setIncludeInTotal] = useState(false)

  const [showColorPicker, setShowColorPicker] = useState(false)

  const formatRupiahInput = (value) =>
    `Rp ${value.toLocaleString("id-ID")}`

  const handleBalanceChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "")
    setBalance(raw ? Number(raw) : 0)
  }

  const icons = [
    { key: "wallet", icon: Wallet },
    { key: "cash", icon: Banknote },
    { key: "bank", icon: Landmark },
    { key: "card", icon: CreditCard },
  ]

  const isDisabled = !name.trim() || balance <= 0

  const handleSave = () => {
    if (isDisabled) return

    const wallets =
      JSON.parse(localStorage.getItem("wallets")) || []

    const newWallet = {
      id: Date.now(),
      name: name.trim(),
      balance: Number(balance),
      icon,
      color,
      includeInTotal,
    }

    localStorage.setItem(
      "wallets",
      JSON.stringify([...wallets, newWallet])
    )

    navigate("/wallet", {
      state: { walletCreated: true },
    })
  }

  const SelectedIcon =
    icons.find((i) => i.key === icon)?.icon || Wallet

  const isGradient = color.startsWith("linear-gradient")

  return (
    <div className="min-h-[100dvh] themed-page p-4 pb-32">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full themed-card flex items-center justify-center"
        >
          <ArrowLeft size={20} className="themed-text" />
        </button>

        <h1 className="text-lg font-semibold themed-text">
          Tambah Dompet
        </h1>
      </div>

      <div className="space-y-6">

        {/* PREVIEW */}
        <div
          className="rounded-3xl p-4 aspect-[2/1] flex flex-col justify-between themed-card-shadow text-white"
          style={{ background: color }}
        >
          <div className="bg-white/20 w-fit p-2 rounded-xl">
            <SelectedIcon size={22} className="text-white" />
          </div>

          <div>
            <p className="text-sm text-white/90">
              {name || "Nama Dompet"}
            </p>

            <p className="font-semibold text-white">
              {formatRupiahInput(balance)}
            </p>
          </div>
        </div>

        {/* NAMA */}
        <div>
          <p className="text-sm themed-text-muted mb-2">
            Nama Dompet
          </p>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full themed-card rounded-2xl p-4 outline-none themed-text"
            placeholder="Misalnya Uang Tunai"
          />
        </div>

        {/* SALDO */}
        <div>
          <p className="text-sm themed-text-muted mb-2">
            Saldo Awal
          </p>

          <input
            type="text"
            inputMode="numeric"
            value={formatRupiahInput(balance)}
            onChange={handleBalanceChange}
            className="w-full themed-card rounded-2xl p-4 text-lg outline-none themed-text"
          />
        </div>

        {/* ICON */}
        <div>
          <p className="text-sm themed-text-muted mb-3">
            Ikon Dompet
          </p>

          <div className="flex gap-3">
            {icons.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.key}
                  onClick={() => setIcon(item.key)}
                  className={`p-4 rounded-2xl transition active:scale-95 ${
                    icon === item.key
                      ? "bg-indigo-600 text-white"
                      : "themed-card themed-text-muted"
                  }`}
                >
                  <Icon size={20} />
                </button>
              )
            })}
          </div>
        </div>

        {/* PILIH WARNA */}
        <div>
          <p className="text-sm themed-text-muted mb-2">
            Warna Dompet
          </p>

          <button
            onClick={() => setShowColorPicker(true)}
            className="w-full rounded-2xl p-4 themed-card flex items-center justify-between"
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

        {/* INCLUDE */}
        <div className="themed-card rounded-3xl p-4 flex justify-between items-center">
          <div>
            <p className="font-medium themed-text">
              Sertakan dalam Saldo Total
            </p>

            <p className="text-sm themed-text-soft">
              Sertakan dompet dalam perhitungan saldo total
            </p>
          </div>

          <button
            onClick={() =>
              setIncludeInTotal((prev) => !prev)
            }
            className={`relative w-14 h-8 rounded-full transition ${
              includeInTotal ? "bg-indigo-600" : "bg-zinc-400/50"
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition ${
                includeInTotal ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* SAVE */}
      <div className="fixed bottom-6 left-4 right-4">
        <button
          onClick={handleSave}
          disabled={isDisabled}
          className={`w-full rounded-2xl py-4 font-semibold transition shadow-lg ${
            isDisabled
              ? "bg-zinc-400/50 text-zinc-500"
              : "bg-indigo-600 text-white active:scale-95"
          }`}
        >
          Simpan Dompet
        </button>
      </div>

      {/* COLOR PICKER */}
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