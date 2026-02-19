import {
  Wallet as WalletIcon,
  Landmark,
  CreditCard,
  Banknote,
  Plus,
  ArrowUpDown,
  SlidersHorizontal,
  CheckCircle,
  Eye,
  MinusCircle,
  Minus,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { formatRupiah } from "../utils/formatRupiah"
import { useEffect, useState } from "react"

export default function Wallet() {
  const navigate = useNavigate()
  const location = useLocation()

  const wallets = JSON.parse(localStorage.getItem("wallets") || "[]")
  
  const debts = JSON.parse(localStorage.getItem("debts") || "[]")
const latestDebt = debts[debts.length - 1] // ambil terakhir
const remainingDebts = debts.length > 1 ? debts.length - 1 : 0

  const walletIconMap = {
    wallet: WalletIcon,
    bank: Landmark,
    cash: Banknote,
    card: CreditCard,
  }
  
  function isLightColor(color) {
  if (!color) return false
  if (color.startsWith("linear-gradient")) return false

  const c = color.substring(1)
  const rgb = parseInt(c, 16)

  const r = (rgb >> 16) & 255
  const g = (rgb >> 8) & 255
  const b = rgb & 255

  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 155
}

  const [showToast, setShowToast] = useState(false)
  const [hideBalance, setHideBalance] = useState(false)

  useEffect(() => {
    if (location.state?.walletCreated) {
      setShowToast(true)

      const timer = setTimeout(() => {
        setShowToast(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [location.state])

  // ✅ TOTAL SALDO (exclude wallet OFF)
  const totalSaldo = wallets
    .filter((w) => w.includeInTotal !== false)
    .reduce((sum, w) => sum + (w.balance || 0), 0)

  return (
    <div className="min-h-[100dvh] themed-page p-4 pb-28 topographic-bg">

      {/* TOAST */}
      {showToast && (
        <div className="
          fixed top-4 left-1/2 -translate-x-1/2 z-50
          themed-toast
          animate-toast
      px-6
      h-12
      flex items-center gap-3
      whitespace-nowrap
      min-w-max
        ">
          <CheckCircle className="text-emerald-400" size={22} />
          <span className="font-medium">
            Dompet berhasil dibuat
          </span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dompet Saya</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/wallets")}
            className="w-10 h-10 rounded-full themed-card flex items-center justify-center themed-text-muted active:scale-95 transition"
          >
            <ArrowUpDown size={18} />
          </button>

          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 rounded-full themed-card flex items-center justify-center themed-text-muted active:scale-95 transition"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* TOTAL SALDO */}
      <div className="themed-card rounded-3xl p-5 mb-6">
        <p className="text-sm themed-text-soft mb-2">
          Saldo akun
        </p>

        <div className="flex items-center gap-3">
          <p className="text-3xl font-bold tracking-tight">
            {hideBalance ? "Rp ••••" : formatRupiah(totalSaldo)}
          </p>

          <button
            onClick={() => setHideBalance(!hideBalance)}
            className="w-9 h-9 rounded-full themed-card flex items-center justify-center themed-text-muted"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* SUBTITLE */}
      <h2 className="font-semibold mb-4 themed-text">Kartu & Dompet</h2>

      {/* WALLET LIST */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide mb-8">

        {wallets.map((wallet) => {
          const Icon = walletIconMap[wallet.icon] || WalletIcon
          
          const isLight = isLightColor(wallet.color)
          const isGradient = wallet.color?.startsWith("linear-gradient")

const textClass =
  isGradient
    ? "text-white"
    : isLight
    ? "text-slate-800"
    : "text-white"

          return (
            <div
              key={wallet.id}
              onClick={() => navigate(`/wallet/${wallet.id}`)}
              className="
              themed-card-shadow
                relative
                min-w-[160px] aspect-square
                rounded-3xl p-4
                flex flex-col justify-between
                active:scale-95 transition
              "
              style={{ background: wallet.color }}
            >

              {/* EXCLUDE BADGE */}
              {wallet.includeInTotal === false && (
  <div
    className="
      absolute top-4 right-3
      w-7 h-7
      rounded-full
      themed-card
      themed-border
      backdrop-blur-md
      flex items-center justify-center
      shadow shadow-black/20
    "
  >
    <Minus size={16} className="text-red-500" />
  </div>
)}
              {/* ICON */}
<div className={`w-fit p-2 rounded-xl backdrop-blur-sm
    ${isLight ? "bg-black/10" : "bg-white/20"}
  `}
>
                <Icon size={22} className={textClass} />
              </div>

              {/* INFO */}
              <div>
<p className={`text-sm font-medium ${textClass}`}>
    {wallet.name}
  </p>
                
                <p className={`font-semibold ${textClass}`}>
                  {formatRupiah(wallet.balance)}
                </p>
              </div>

            </div>
          )
        })}

        {/* ADD WALLET */}
        <button
          onClick={() => navigate("/add-wallet")}
          className="
            min-w-[160px] aspect-square
  rounded-3xl
  border border-dashed themed-border
  themed-text-muted
  flex items-center justify-center
  active:scale-95 transition
          "
        >
          <Plus size={28} />
        </button>
      </div>

      {/* TUJUAN */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Tujuan</h2>

        <div className="
          border border-dashed themed-border
          rounded-3xl p-6 text-center
          themed-text-muted
        ">
          <p className="mb-3">
            Anda belum menambahkan tujuan.
          </p>

          <button className="
            px-5 py-2 rounded-full themed-card themed-text-soft text-sm active:scale-95 transition
          ">
            + Tambah Tujuan
          </button>
        </div>
      </div>

      {/* UTANG */}
{/* UTANG */}
<div>
  <h2 className="text-lg font-semibold mb-3">Utang</h2>

  {debts.length === 0 ? (
    <div className="
      border border-dashed themed-border
      rounded-3xl p-6 text-center themed-text-muted
    ">
      <p className="mb-3">
        Anda belum menambahkan utang.
      </p>

      <button
        onClick={() => navigate("/hutang", { replace: true })}
        className="
          px-5 py-2 rounded-full
          themed-card themed-text-soft
          text-sm active:scale-95 transition
        "
      >
        + Tambah Utang
      </button>
    </div>
  ) : (
    <div
      onClick={() => navigate("/hutang-list", { replace: true })}
      className="flex gap-3 overflow-x-auto scrollbar-hide"
    >
      {/* CARD UTAMA */}
      <div className="
        flex-1
        themed-card rounded-3xl p-4
        active:scale-95 transition
      ">
        <p className="text-sm themed-text-muted">
          {latestDebt.type === "self"
            ? "Saya berhutang ke"
            : "Orang berhutang ke saya"}
        </p>

        <p className="font-semibold themed-text">
          {latestDebt.personName}
        </p>

        <p className="text-sm themed-text-amount">
          {formatRupiah(latestDebt.amount)}
        </p>
      </div>

      {/* CARD "+ ITEM LAINNYA" */}
      {remainingDebts > 0 && (
        <div className="
          min-w-[80px]
          themed-card rounded-3xl
          flex items-center justify-center
          text-center
          themed-text-muted
          active:scale-95 transition
        ">
          <div>
            <p className="text-sm font-medium">
              + {remainingDebts} Item
            </p>
            <p className="text-xs">
              lainnya
            </p>
          </div>
        </div>
      )}
    </div>
  )}
</div>

    </div>
  )
}