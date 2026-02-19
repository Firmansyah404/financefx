import {
  Wallet as WalletIcon,
  Landmark,
  CreditCard,
  Banknote,
  Minus,
  ArrowLeft,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { formatRupiah } from "../utils/formatRupiah"

export default function AllWallets() {
  const navigate = useNavigate()
  const wallets = JSON.parse(localStorage.getItem("wallets") || "[]")

  const walletIconMap = {
    wallet: WalletIcon,
    bank: Landmark,
    cash: Banknote,
    card: CreditCard,
  }

  return (
    <div className="min-h-[100dvh] themed-page p-4">

      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="
            w-10 h-10
            rounded-full
            themed-card
            flex items-center justify-center
            themed-text
            active:scale-95
            transition
          "
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-xl font-semibold themed-text">
          Semua Dompet
        </h1>
      </div>

      {/* ===== LIST ===== */}
      {wallets.length === 0 ? (
        <p className="text-sm themed-text-muted">
          Belum ada dompet
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {wallets.map((wallet) => {
            const Icon =
              walletIconMap[wallet.icon] || WalletIcon

            return (
              <div
                key={wallet.id}
                onClick={() =>
                  navigate(`/wallet/${wallet.id}`)
                }
                className="
                  relative
                  rounded-3xl
                  p-4
                  aspect-[1.6]
                  flex flex-col justify-between
                  themed-card-shadow
                  text-white
                  active:scale-[0.98]
                  transition
                  cursor-pointer
                "
                style={{ background: wallet.color }}
              >
                {/* ===== EXCLUDE BADGE ===== */}
                {wallet.includeInTotal === false && (
                  <div
                    className="
                      absolute top-3 right-3
                      w-7 h-7
                      rounded-full
                      bg-white text-black
                      flex items-center justify-center
                      themed-card-shadow
                    "
                  >
                    <Minus
                      size={14}
                      className="text-rose-500"
                    />
                  </div>
                )}

                {/* ===== ICON ===== */}
                <div className="bg-white/20 w-fit p-2 rounded-xl">
                  <Icon size={22} className="text-white" />
                </div>

                {/* ===== INFO ===== */}
                <div>
                  <p className="text-sm text-white/90">
                    {wallet.name}
                  </p>

                  <p className="font-semibold text-white">
                    {formatRupiah(wallet.balance)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}