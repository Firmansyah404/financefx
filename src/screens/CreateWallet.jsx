import { useState } from "react"
import WalletCard from "../components/WalletCard"
import ColorPicker from "../components/ColorPicker"
import SaveButton from "../components/SaveButton"
import IconPicker from "../components/IconPicker"
import CalculatorSheet from "../components/CalculatorSheet"
import {
  Wallet,
  Landmark,
  Banknote,
  CreditCard,
  TrendingUp,
  Coins,
} from "lucide-react"
import { formatRupiah } from "../utils/formatRupiah"
import { useNavigate } from "react-router-dom"

export default function CreateWallet() {
  const [name, setName] = useState("")
  const [balance, setBalance] = useState(0)
  const [color, setColor] = useState("#4f46e5")
  const [icon, setIcon] = useState("wallet")

  const [showCalculator, setShowCalculator] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)

  const username = localStorage.getItem("username") || "Pengguna"
  const navigate = useNavigate()

  // ICON MAP
  const iconMap = {
    wallet: Wallet,
    bank: Landmark,
    cash: Banknote,
    card: CreditCard,
    invest: TrendingUp,
    coins: Coins,
  }

  const SelectedIcon = iconMap[icon] || Wallet

  const handleSave = () => {
    const existingWallets = JSON.parse(
      localStorage.getItem("wallets") || "[]"
    )

    const newWallet = {
      id: Date.now(),
      name,
      balance,
      color,
      icon,
    }

    existingWallets.push(newWallet)

    localStorage.setItem(
      "wallets",
      JSON.stringify(existingWallets)
    )

    localStorage.setItem("onboarding_done", "true")
    navigate("/home")
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-28 relative">
      {/* GREETING */}
      <h1 className="text-xl font-semibold mb-4">
        Halo {username}, buat dompet pertamamu
      </h1>

      {/* CARD PREVIEW */}
      <WalletCard
        name={name || "Kas"}
        balance={balance}
        color={color}
        icon={icon}
      />

      {/* COLOR PICKER */}
      <ColorPicker selected={color} onSelect={setColor} />

      {/* NAMA DOMPET */}
      <div className="mt-4 bg-zinc-800 rounded-2xl p-4">
        <p className="text-sm text-zinc-400">Nama Dompet</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="misalnya Uang Tunai"
          className="bg-transparent outline-none text-white w-full mt-1"
        />
      </div>

      {/* SALDO + ICON */}
      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={() => setShowCalculator(true)}
          className="flex-1 text-left bg-zinc-800 rounded-2xl p-4"
        >
          <p className="text-sm text-zinc-400">Saldo Awal</p>
          <p className="text-lg font-semibold">
            {formatRupiah(balance)}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setShowIconPicker(true)}
          className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center"
        >
          <SelectedIcon size={22} />
        </button>
      </div>

      {/* ICON PICKER */}
      {showIconPicker && (
        <IconPicker
          selected={icon}
          onSelect={(val) => {
            setIcon(val)
            setShowIconPicker(false)
          }}
          onClose={() => setShowIconPicker(false)}
        />
      )}

      {/* CALCULATOR */}
      {showCalculator && (
        <CalculatorSheet
          value={balance}
          onChange={setBalance}
          onClose={() => setShowCalculator(false)}
        />
      )}

      {/* SAVE BUTTON */}
      {!showCalculator && !showIconPicker && (
        <SaveButton
          disabled={!name || balance <= 0}
          onClick={handleSave}
        />
      )}
    </div>
  )
}