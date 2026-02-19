import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  ArrowLeft,
  X,
  Wallet,
  Landmark,
  CreditCard,
  Banknote,
  Trash2,
  ArrowDown,
} from "lucide-react"
import { formatRupiah } from "../utils/formatRupiah"
import { useEffect, useState } from "react"
import Toast from "../components/Toast"
import { getPhotos } from "../utils/photoDB"
import ConfirmDialog from "../components/ConfirmDialog"

export default function TransactionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const edited = location.state?.edited === true

  const transactions = JSON.parse(localStorage.getItem("transactions")) || []
  const wallets = JSON.parse(localStorage.getItem("wallets")) || []

  const transaction = transactions.find(t => String(t.id) === id)

  const [previewPhoto, setPreviewPhoto] = useState(null)
  const [photos, setPhotos] = useState([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!transaction) {
    return (
      <div className="min-h-screen themed-page p-4">
        <p className="themed-text">Transaksi tidak ditemukan</p>
      </div>
    )
  }

  const wallet = wallets.find(w => w.id === transaction.walletId)
  const targetWallet = wallets.find(
  w => w.id === transaction.targetWalletId
)

  const walletIconMap = {
    wallet: Wallet,
    bank: Landmark,
    cash: Banknote,
    card: CreditCard,
  }

  const Icon = walletIconMap[wallet?.icon] || Wallet
  
  const type = transaction.type?.toLowerCase()
  const amountColor =
  type === "income"
    ? "text-emerald-500"
    : type === "expense"
    ? "text-rose-500"
    : "text-indigo-500"

const amountSign =
  type === "income"
    ? "+"
    : type === "expense"
    ? "-"
    : "⇄"

  // ✅ LOAD PHOTOS
  useEffect(() => {
    const loadPhotos = async () => {
      if (!transaction.photoIds?.length) return
      const results = await getPhotos(transaction.photoIds)
      setPhotos(results.filter(Boolean))
    }

    loadPhotos()
  }, [transaction])

  // ✅ CLEAR EDITED STATE
  useEffect(() => {
    if (edited) {
      const timer = setTimeout(() => {
        navigate(location.pathname, { replace: true })
      }, 10)

      return () => clearTimeout(timer)
    }
  }, [edited])

  // ✅ DELETE HANDLER
  const handleDeleteTransaction = () => {
    const transactions =
      JSON.parse(localStorage.getItem("transactions")) || []

    const wallets =
      JSON.parse(localStorage.getItem("wallets")) || []

    const {
      id,
      type,
      amount,
      walletId,
      targetWalletId,
      adminFee = 0,
    } = transaction

    const updatedWallets = wallets.map(wallet => {
      let balance = wallet.balance

      if (type === "income" && wallet.id === walletId) {
        balance -= amount
      }

      if (type === "expense" && wallet.id === walletId) {
        balance += amount
      }

      if (type === "transfer") {
        if (wallet.id === walletId) {
          balance += amount + adminFee
        }

        if (wallet.id === targetWalletId) {
          balance -= amount
        }
      }

      return { ...wallet, balance }
    })

    const updatedTransactions = transactions.filter(
      t => t.id !== id
    )

    localStorage.setItem("wallets", JSON.stringify(updatedWallets))
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions))

    window.dispatchEvent(new Event("transactionsUpdated"))

    navigate("/home", {
      state: { toast: "deleted" },
    })
  }

  return (
    <div className="min-h-screen themed-page p-4 pb-24">

      {edited && (
        <Toast message="Transaksi berhasil diedit" />
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full themed-card flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="text-lg font-semibold themed-text">
            Detail Transaksi
          </h1>
        </div>

        <div className="flex items-center gap-2">

          {/* DELETE */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="
              w-9 h-9
              rounded-full
              themed-card
              flex items-center justify-center
              active:scale-90
              transition
            "
          >
            <Trash2 size={16} className="text-rose-500" />
          </button>

          {/* EDIT */}
          <button
            onClick={() =>
              navigate(`/edit-transaction/${transaction.id}`)
            }
            className="
              px-4 py-1
              rounded-full
              themed-card
              text-sm themed-text
              active:scale-95
              transition
            "
          >
            Edit
          </button>
        </div>
      </div>

      {/* TRANSACTION CARD */}
      <div className="themed-card rounded-3xl p-4 mb-4">

        <p className="text-lg font-semibold themed-text mb-1">
          {transaction.name}
        </p>

        <p className="text-sm themed-text-muted mb-2">
          {transaction.category}
        </p>

        <p className="text-sm themed-text-muted">
          {new Date(transaction.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}{" "}
          • {transaction.time}
        </p>
      </div>

{/* ===== WALLET TRANSFER CARD (GABUNGAN) ===== */}
{wallet && (
  <div className="themed-card rounded-3xl p-4 mb-4 relative">

    <p className="text-sm themed-text-muted mb-3">
      Sumber Dana
    </p>

    {/* ===== DOMPET ASAL ===== */}
    <div className="flex items-center gap-3 mb-3">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: wallet.color }}
      >
        <Icon size={20} className="text-white" />
      </div>

      <div>
        <p className="font-semibold themed-text">
          {wallet.name}
        </p>
        <p className="text-sm themed-text-muted">
          Saldo: {formatRupiah(wallet.balance)}
        </p>
      </div>
    </div>

    {/* ===== JUMLAH TRANSFER ===== */}
    <p
  className={`text-xl font-bold ${
    type === "income"
      ? "text-emerald-500"
      : type === "expense"
      ? "text-rose-500"
      : "text-indigo-500"
  }`}
>
  {type === "income"
    ? "+"
    : type === "expense"
    ? "-"
    : "⇄"}{" "}
  {formatRupiah(transaction.amount)}
</p>

    {/* ===== BIAYA ADMIN (POSISI BARU) ===== */}
{transaction.type === "transfer" && (
  <p className="text-xs text-rose-500 mt-1">
    Biaya admin{" "}
    {Number(transaction.adminFee) > 0
      ? `(${formatRupiah(transaction.adminFee)})`
      : "(Gratis)"}
  </p>
)}

    {/* ===== TRANSFER FLOW DALAM CARD ===== */}
    {transaction.type === "transfer" && targetWallet && (
      <>
        {/* ===== PANAH FLOATING ===== */}
        <div className="flex justify-center my-3">
          <div
            className="
              w-10 h-10 rounded-full
              themed-card
              flex items-center justify-center
              shadow-md
              z-10
            "
          >
            <ArrowDown size={18} className="themed-text-muted" />
          </div>
        </div>

        {/* ===== DOMPET TUJUAN ===== */}
            <p className="text-sm themed-text-muted mb-3">
      Transfer ke
    </p>
        <div className="flex items-center gap-3 mt-1">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: targetWallet.color }}
          >
            {(() => {
              const TargetIcon =
                walletIconMap[targetWallet.icon] || Wallet
              return (
                <TargetIcon size={20} className="text-white" />
              )
            })()}
          </div>

          <div>
            <p className="font-semibold themed-text">
              {targetWallet.name}
            </p>
            <p className="text-sm themed-text-muted">
              Saldo: {formatRupiah(targetWallet.balance)}
            </p>
          </div>
        </div>

        <p className="text-xl font-bold text-indigo-500 mt-1">
          +{formatRupiah(transaction.amount)}
        </p>
      </>
    )}
  </div>
)}

      {/* NOTE */}
      {transaction.note && (
        <div className="themed-card rounded-3xl p-4 mb-4">
          <p className="text-sm themed-text-muted mb-1">
            Catatan
          </p>
          <p className="themed-text">{transaction.note}</p>
        </div>
      )}

      {/* PHOTOS */}
      {photos.length > 0 && (
        <div className="themed-card rounded-2xl p-4 mt-4">
          <p className="text-sm themed-text-muted mb-2">
            Foto
          </p>

          <div className="flex gap-3 flex-wrap">
            {photos.map(photo => (
              <img
                key={photo.id}
                src={photo.data}
                onClick={() => setPreviewPhoto(photo.data)}
                className="w-24 h-24 rounded-xl object-cover cursor-pointer"
              />
            ))}
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {previewPhoto && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">

          <div className="flex items-center justify-between p-4">
            <p className="font-semibold text-white">Preview</p>

            <button
              onClick={() => setPreviewPhoto(null)}
              className="bg-zinc-800 p-2 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <img
              src={previewPhoto}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="p-4">
            <button
              onClick={() => setPreviewPhoto(null)}
              className="w-full bg-zinc-800 rounded-2xl py-4 font-semibold text-white"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Hapus Transaksi?"
        message={`Data transaksi akan dihapus permanen!
Saldo akan dikembalikan ke dompet asal`}
        confirmText="Hapus"
        cancelText="Batal"
        danger
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteTransaction}
      />
    </div>
  )
}