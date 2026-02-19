import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  ArrowLeft,
  Wallet,
  Banknote,
  Landmark,
  CreditCard,
  SlidersHorizontal,
  Pencil,
  Trash2,
  CheckCircle,
} from "lucide-react"
import { formatRupiah } from "../utils/formatRupiah"
import { useState, useEffect, useMemo } from "react"

export default function DetailWallet() {
  const navigate = useNavigate()
  const location = useLocation()

  const { id } = useParams()
  const walletId = Number(id)

  const wallets = JSON.parse(localStorage.getItem("wallets") || "[]")
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]")

  const wallet = wallets.find((w) => w.id === walletId)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastLeaving, setToastLeaving] = useState(false)

  const adjusted = location.state?.adjusted === true
  const edited = location.state?.edited === true
  const walletName = location.state?.walletName || ""

  useEffect(() => {
    if (adjusted || edited) {
      setShowToast(true)

      const timer = setTimeout(() => {
        setToastLeaving(true)

        setTimeout(() => {
          setShowToast(false)
          setToastLeaving(false)

          navigate(location.pathname, { replace: true })
        }, 300)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [adjusted, edited])

  if (!wallet) {
    return (
      <div className="min-h-[100dvh] themed-page p-4 themed-text">
        Dompet tidak ditemukan
      </div>
    )
  }

  const walletTransactions = useMemo(
() =>
   transactions
     .filter((t) => t.walletId === wallet.id)
     .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [transactions, wallet.id]
  )

  const walletIconMap = {
    wallet: Wallet,
    cash: Banknote,
    bank: Landmark,
    card: CreditCard,
  }

  const Icon = walletIconMap[wallet.icon] || Wallet

  const formatDateHeader = (date) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  const groupedTransactions = useMemo(() => {
    return walletTransactions.reduce((acc, trx) => {
       if (!trx.date) return acc
      if (!acc[trx.date]) acc[trx.date] = []
      acc[trx.date].push(trx)
      return acc
    }, {})
  }, [walletTransactions])

  const handleDeleteWallet = () => {
    const updatedWallets = wallets.filter((w) => w.id !== walletId)
    const updatedTransactions = transactions.filter(
      (t) => t.walletId !== walletId
    )

    localStorage.setItem("wallets", JSON.stringify(updatedWallets))
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions))

    navigate("/wallet")
  }

  return (
<div className="h-[100dvh] overflow-x-hidden themed-page p-4 flex flex-col">

      {/* ===== TOAST ===== */}
      {showToast && (
        <div
          className={`
            fixed top-4 left-1/2 -translate-x-1/2
            z-50
            themed-toast
            animate-toast
            ${toastLeaving ? "animate-toast-leave" : ""}
          `}
        >
          <CheckCircle size={18} className="text-emerald-400" />

          <span className="text-sm themed-text">
            Dompet{" "}
            <span className="font-semibold">
              {walletName}
            </span>{" "}
            {adjusted
              ? "berhasil disesuaikan"
              : "berhasil diedit"}
          </span>
        </div>
      )}

      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3 mb-5 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="
            w-10 h-10 rounded-full
            themed-card
            flex items-center justify-center
            themed-text
            active:scale-95 transition
          "
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-lg font-semibold themed-text">
          Detail Dompet
        </h1>
      </div>

      {/* ===== WALLET CARD ===== */}
      <div
        className="
          rounded-3xl p-5 mb-4 shrink-0
          themed-card-shadow
          text-white
        "
        style={{ background: wallet.color }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-xl">
            <Icon size={22} />
          </div>

          <div>
            <p className="font-semibold">
              {wallet.name}
            </p>

            <p className="text-sm text-white/80">
              Saldo: {formatRupiah(wallet.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* ===== ACTION BUTTONS ===== */}
      <div className="flex gap-3 mb-4 shrink-0">
        <button
          onClick={() =>
            navigate(`/adjust-wallet/${wallet.id}`, { replace: true })
          }
          className="
            flex-1 themed-card
            py-3 rounded-xl text-sm
            flex items-center justify-center gap-2
            themed-text
            active:scale-95 transition
          "
        >
          <SlidersHorizontal size={18} />
          Sesuaikan
        </button>

        <button
          onClick={() =>
            navigate(`/edit-wallet/${wallet.id}`, { replace: true })
          }
          className="
            flex-1 themed-card
            py-3 rounded-xl text-sm
            flex items-center justify-center gap-2
            themed-text
            active:scale-95 transition
          "
        >
          <Pencil size={18} />
          Edit
        </button>

<button
  onClick={() => setShowDeleteModal(true)}
  className="
    flex-1 themed-card
    py-3 rounded-xl text-sm
    flex items-center justify-center gap-2
    themed-danger-text
  "
>
  <Trash2 size={18} className="themed-danger-text" />
  <span className="themed-danger-text">Hapus</span>
</button>
      </div>

      {/* ===== TITLE ===== */}
     <h2 className="text-lg font-semibold mb-3 themed-text shrink-0">
        Transaksi
      </h2>

      {/* ===== SCROLL AREA ===== */}
  <div className="flex-1 overflow-y-auto min-h-0 scroll-smooth-native pb-6 overscroll-contain">
        {Object.entries(groupedTransactions)
          .sort((a, b) => new Date(b[0]) - new Date(a[0]))
          .map(([date, items]) => (
            <div key={date} className="mb-2">
<div className="sticky top-0 z-10 bg-[var(--bg)]/30 backdrop-blur-sm">
                 <div className="transition-opacity duration-200">
                <span className="
                  inline-block
                  themed-card
                  px-4 py-2 my-1 rounded-full text-sm
                  themed-text-soft
                ">
                  {formatDateHeader(date)}
                </span>
                </div>
              </div>

              <div className="space-y-3 mt-1 -mb-2">
{items.map((trx) => (
  <button
    key={trx.id}
    onClick={() => navigate(`/transaction/${trx.id}`)}
    className="
      w-full themed-card
      p-3 rounded-2xl
      flex justify-between items-center
      themed-card-shadow
      active:scale-[0.98] transition
    "
  >
                    <div>
                      <p className="font-medium themed-text leading-tight m-0 text-left">
                        {trx.name}
                      </p>

                     <p className="text-xs themed-text-muted leading-tight m-0 text-left">
                        {trx.category} • {trx.time}
                      </p>
                    </div>
                    
<div className="text-right">
  <p
    className={`font-semibold ${
      trx.type === "income"
        ? "text-emerald-400"
        : trx.type === "expense"
        ? "text-rose-400"
        : "text-indigo-400"
    }`}
  >
    {trx.type === "income"
      ? "+"
      : trx.type === "expense"
      ? "-"
      : "⇄"}
    {formatRupiah(trx.amount)}
  </p>

  {/* ✅ KHUSUS TRANSFER */}
{trx.type === "transfer" && (
  <p className="text-xs text-rose-400 leading-tight">
    Biaya admin{" "}
    {Number(trx.adminFee) > 0
      ? `(${formatRupiah(trx.adminFee)})`
      : "(Gratis)"}
  </p>
)}
</div>

                  </button>
                ))}
              </div>
            </div>
          ))}

        {walletTransactions.length === 0 && (
          <p className="text-center themed-text-muted text-sm mt-6">
            Belum ada transaksi
          </p>
        )}
      </div>

      {/* ===== DELETE MODAL ===== */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="
          themed-card
            themed-modal
            w-[90%] max-w-sm
            rounded-2xl
            overflow-hidden
            themed-card-shadow
          ">
            <div className="p-6 text-center">
              <p className="text-lg font-semibold themed-text mb-2">
                Hapus Dompet?
              </p>

              <p className="text-sm themed-text-muted">
                Semua transaksi juga akan terhapus
              </p>
            </div>

            <div className="flex themed-border">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-4 text-sm themed-text-soft border-r"
              >
                Batal
              </button>

              <button
                onClick={handleDeleteWallet}
                className="
                  flex-1 py-4 text-sm font-semibold
                  themed-danger-text
                "
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}