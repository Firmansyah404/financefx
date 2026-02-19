import {
  Wallet,
  Landmark,
  Banknote,
  CreditCard,
  TrendingUp,
  Coins,
} from "lucide-react"
import { formatRupiah } from "../utils/formatRupiah"

export default function WalletCard({ name, balance, color, icon }) {
  const iconMap = {
    wallet: Wallet,
    bank: Landmark,
    cash: Banknote,
    card: CreditCard,
    invest: TrendingUp,
    coins: Coins,
  }

  const Icon = iconMap[icon] || Wallet

  return (
    <div
      className="rounded-2xl p-5 text-white"
      style={{ background: color }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-xl">
          <Icon size={24} />
        </div>

        <div>
          <p className="text-sm opacity-80">{name}</p>
          <p className="text-xl font-bold">
            {formatRupiah(balance)}
          </p>
        </div>
      </div>
    </div>
  )
}