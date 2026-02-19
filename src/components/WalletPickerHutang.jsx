import { X, Check, Wallet } from "lucide-react"
import {
  Landmark,
  CreditCard,
  Banknote,
} from "lucide-react"
import { formatRupiah } from "../utils/formatRupiah"

const walletIconMap = {
  wallet: Wallet,
  bank: Landmark,
  cash: Banknote,
  card: CreditCard,
}

function isLightColor(color) {
  if (!color) return false
  if (color.startsWith("linear-gradient")) return false

  const rgb = parseInt(color.substring(1), 16)
  const r = (rgb >> 16) & 255
  const g = (rgb >> 8) & 255
  const b = rgb & 255

  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 170
}

export default function WalletPickerHutang({
  wallets,
  selected,
  onSelect,
  onClose,
  title = "Pilih Dompet",
}) {
  const activeTanpaDompet = selected === null

  return (
    <div className="fixed inset-0 z-50 flex items-end">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* SHEET */}
      <div className="relative w-full themed-card rounded-t-3xl p-4 animate-slideUp">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold themed-text">
            {title}
          </p>

          <button
            onClick={onClose}
            className="
              w-10 h-10 rounded-full themed-card
              flex items-center justify-center
              active:scale-95 transition
            "
          >
            <X size={18} className="themed-text" />
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto no-scrollbar">

          {/* ✅ TANPA DOMPET */}
          <button
            onClick={() => {
              onSelect(null)
              onClose()
            }}
            className="
              rounded-2xl py-6 px-4 text-left relative
              themed-card themed-border
              col-span-2
              active:scale-[0.98] transition
            "
          >
            <div className="relative z-10">
              <p className="text-lg font-medium themed-text">
                Tanpa Dompet
              </p>
              <p className="text-xs themed-text-muted">
                Pembayaran tanpa mengurangi saldo
              </p>
            </div>

            {activeTanpaDompet && (
              <div className="
                absolute top-3 right-3
                w-6 h-6 rounded-full
                bg-[var(--primary)]
                flex items-center justify-center
                shadow
              ">
                <Check size={14} className="text-white" />
              </div>
            )}
          </button>

          {/* ✅ LIST WALLET */}
          {wallets.map((wallet) => {
            const Icon = walletIconMap[wallet.icon] || Wallet
            const active = selected?.id === wallet.id

            const isGradient = wallet.color?.startsWith("linear-gradient")
            const isLight = isLightColor(wallet.color)

            const textClass = isGradient
              ? "text-white"
              : isLight
              ? "text-slate-800"
              : "text-white"

            return (
              <button
                key={wallet.id}
                onClick={() => {
                  onSelect(wallet)
                  onClose()
                }}
                className="
                  rounded-2xl p-4 text-left relative
                  transition-all duration-150
                  active:scale-[0.98]
                "
                style={{ background: wallet.color }}
              >
                {/* overlay */}
                <div
                  className={`
                    absolute inset-0 rounded-2xl
                    ${isLight ? "bg-white/20" : "bg-black/10"}
                  `}
                />

                <div className="relative z-10">

                  {/* TOP */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="
                      bg-white/20 p-2 rounded-xl backdrop-blur-sm
                    ">
                      <Icon size={18} className={textClass} />
                    </div>

                    <p className={`text-sm font-medium truncate ${textClass}`}>
                      {wallet.name}
                    </p>
                  </div>

                  {/* BALANCE */}
                  <p className={`text-sm font-semibold ${textClass}`}>
                    {formatRupiah(wallet.balance)}
                  </p>
                </div>

                {/* ACTIVE CHECK */}
                {active && (
                  <div className="
                    absolute top-3 right-3
                    w-6 h-6 rounded-full
                    bg-white/90
                    flex items-center justify-center
                    shadow
                  ">
                    <Check size={14} className="text-black" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}