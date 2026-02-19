import { ArrowLeft, CalendarDays, Clock, CheckCircle, Trash2 } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { formatRupiah } from "../utils/formatRupiah"
import { useState, useEffect } from "react"
import WalletPickerHutang from "../components/WalletPickerHutang"

export default function HutangDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [toastMessage, setToastMessage] = useState("")
const [showToast, setShowToast] = useState(false)

const triggerToast = (message) => {
  setToastMessage(message)
  setShowToast(true)

  setTimeout(() => {
    setShowToast(false)
  }, 3000)
}


  const handleBorrowAgainSubmit = (amount) => {
  if (!amount || amount <= 0) return

  const updatedDebts = debts.map((d) => {
    if (d.id !== debt.id) return d

    const newAmount = d.amount + amount
    const paid = d.paidAmount || 0

    return {
      ...d,
      amount: newAmount,
      status: paid >= newAmount ? "paid" : "partial",

      transactions: [
        ...(d.transactions || []),
        {
          id: Date.now(),
          type: "borrow",
          amount,
          date: new Date().toISOString(),
        },
      ],
    }
  })

  localStorage.setItem("debts", JSON.stringify(updatedDebts))
  const newDebt = updatedDebts.find(d => d.id === debt.id)
  setDebt(newDebt)

  setShowBorrowCalculator(false)
setPayValue("")

triggerToast("Berhasil menambahkan pinjaman")

}

  const debts = JSON.parse(localStorage.getItem("debts") || "[]")
  const [debt, setDebt] = useState(() =>
   debts.find((d) => d.id === Number(id))
 )
  const wallets = JSON.parse(localStorage.getItem("wallets") || "[]")

const getWalletById = (id) =>
  wallets.find(w => w.id === id)


  if (!debt) {
    return (
      <div className="min-h-screen themed-page p-4">
        <button
          onClick={() => navigate(-1)}
          className="themed-card px-4 py-2 rounded-xl"
        >
          <ArrowLeft size={18} />
        </button>

        <p className="mt-6 themed-text-muted">
          Data hutang tidak ditemukan
        </p>
      </div>
    )
  }

  const paidAmount = debt.paidAmount || 0
const remaining = Math.max(0, debt.amount - paidAmount)
const isPaid = remaining <= 0
const paidMessage =
  debt.type === "self"
    ? "Hutang kamu sudah lunas"
    : `Hutang ${debt.personName} sudah lunas`
    
const transactions = debt.transactions || []


  const handlePay = (amount) => {
  if (!amount || amount <= 0) return

  // ✅ cegah overpay
  if (amount > remaining) {
  setShowOverpayModal(true)
  return
}

  // ✅ cek saldo wallet
  if (selectedWallet && selectedWallet.balance < amount) {
  setShowInsufficientModal(true)
  return
}

  const updatedDebts = debts.map((d) => {
    if (d.id !== debt.id) return d

    const newPaid = (d.paidAmount || 0) + amount

    return {
      ...d,
      paidAmount: Math.min(d.amount, newPaid),
      status: newPaid >= d.amount ? "paid" : "partial",

      transactions: [
        ...(d.transactions || []),
        {
          id: Date.now(),
          type: "pay",
          amount,
          walletId: selectedWallet?.id || null,
          date: new Date().toISOString(),
        },
      ],
    }
  })

  localStorage.setItem("debts", JSON.stringify(updatedDebts))
  const newDebt = updatedDebts.find(d => d.id === debt.id)
 setDebt(newDebt)

  if (selectedWallet) {
    const updatedWallets = wallets.map((w) =>
      w.id === selectedWallet.id
        ? { ...w, balance: Math.max(0, w.balance - amount) }
        : w
    )

    localStorage.setItem("wallets", JSON.stringify(updatedWallets))
    window.dispatchEvent(new Event("walletUpdated"))
  }

  triggerToast("Pembayaran hutang berhasil")

}

  const handleBorrowAgain = () => {
     setPayValue("")              
  setShowBorrowCalculator(true)
}
  
  const [showWalletPicker, setShowWalletPicker] = useState(false)
const [showCalculator, setShowCalculator] = useState(false)
const [selectedWallet, setSelectedWallet] = useState(null)
const [showBorrowCalculator, setShowBorrowCalculator] = useState(false)

const [payValue, setPayValue] = useState("")
const [showInsufficientModal, setShowInsufficientModal] = useState(false)
const [showOverpayModal, setShowOverpayModal] = useState(false)
const [showDeleteModal, setShowDeleteModal] = useState(false)
const handleDeleteDebt = () => {
  const updatedDebts = debts.filter(d => d.id !== debt.id)

  localStorage.setItem("debts", JSON.stringify(updatedDebts))

  sessionStorage.setItem("toast", "Hutang berhasil dihapus")
  navigate("/hutang-list", { replace: true })
}

const grouped = transactions.reduce((acc, t) => {
   const dateKey = new Date(t.date).toDateString()
   if (!acc[dateKey]) acc[dateKey] = []
   acc[dateKey].push(t)
   return acc
 }, {})

 Object.keys(grouped).forEach(date => {
   grouped[date].sort(
     (a, b) => new Date(b.date) - new Date(a.date)
   )
 })

const sortedDates = Object.keys(grouped).sort(
  (a, b) => new Date(b) - new Date(a)
)


function isLightColor(color = "") {
  if (!color) return false
  if (color.startsWith("linear-gradient")) return false
  if (!color.startsWith("#")) return false

  const rgb = parseInt(color.substring(1), 16)
  if (Number.isNaN(rgb)) return false

  const r = (rgb >> 16) & 255
  const g = (rgb >> 8) & 255
  const b = rgb & 255

  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 155
}

  return (
    <div className="min-h-screen themed-page p-4 pb-32">
       
       {/* TOAST */}
{showToast && (
  <div className="
    fixed top-4 left-1/2 -translate-x-1/2 z-[999]
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
      {toastMessage}
    </span>
  </div>
)}

{showDeleteModal && (
  <div className="
    fixed inset-0 z-50
    bg-black/30 backdrop-blur-sm
    flex items-center justify-center
  ">
    <div className="
      w-[92%] max-w-sm
      bg-white dark:bg-zinc-900
      rounded-2xl
      overflow-hidden
      shadow-xl
      animate-fade-in
    ">
      
      {/* CONTENT */}
      <div className="p-6 text-center">
        <p className="text-base font-semibold themed-text">
          Hapus Hutang?
        </p>

        <p className="text-sm themed-text-muted mt-1">
          Apakah kamu yakin ingin menghapusnya?
        </p>
      </div>

      {/* DIVIDER */}
      <div className="border-t themed-border" />

      {/* BUTTONS */}
      <div className="flex h-12 text-sm font-medium">
        
        {/* BATAL */}
        <button
          onClick={() => setShowDeleteModal(false)}
          className="
            flex-1
            themed-text-muted
            active:bg-zinc-100 dark:active:bg-zinc-800
            transition
          "
        >
          Batal
        </button>

        {/* VERTICAL DIVIDER */}
        <div className="w-px bg-zinc-200 dark:bg-zinc-800" />

        {/* YA */}
        <button
          onClick={handleDeleteDebt}
          className="
            flex-1
            text-rose-500
            active:bg-zinc-100 dark:active:bg-zinc-800
            transition
          "
        >
          Ya
        </button>
      </div>
    </div>
  </div>
)}

      {/* HEADER */}
<div className="flex items-center justify-between mb-5">

  {/* LEFT */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => navigate(-1)}
      className="w-11 h-11 rounded-full themed-card flex items-center justify-center"
    >
      <ArrowLeft size={20} />
    </button>

    <h1 className="text-lg font-semibold themed-text">
      Detail Hutang
    </h1>
  </div>

  {/* RIGHT → DELETE */}
  <button
    onClick={() => setShowDeleteModal(true)}
    className="
      w-10 h-10 rounded-full
      themed-card themed-border
      flex items-center justify-center
      text-rose-500
      active:scale-95 transition
    "
  >
    <Trash2 className="themed-danger-text" size={18} />
  </button>
</div>

      {/* ===== CARD UTAMA ===== */}
      <div className="themed-card rounded-3xl p-4">

{/* TOP SECTION */}
<div>

  {/* BARIS ATAS */}
  <div className="flex justify-between items-start">
    
    {/* LEFT: Avatar + Nama */}
    <div className="flex gap-3">
      <div
        className="
          w-12 h-12 rounded-2xl
          bg-[var(--primary)]
          text-white
          flex items-center justify-center
          font-semibold text-lg
          shrink-0
        "
      >
        {debt.personName?.charAt(0).toUpperCase()}
      </div>

      <div>
        <p className="text-sm themed-text-muted">
          {debt.type === "self"
            ? "Kamu yang berhutang"
            : "Dia yang berhutang"}
        </p>

        <p className="font-semibold themed-text leading-tight">
          {debt.personName}
        </p>
      </div>
    </div>

    {/* RIGHT: Tanggal */}
    <div className="text-right">
      <p className="text-sm themed-text-muted">
        {formatDate(debt.date)}
      </p>

      {(debt.dueDate || debt.dueTime) && (
        <p className="text-xs themed-danger-text mt-1">
          {formatDue(debt.dueDate, debt.dueTime)}
        </p>
      )}
    </div>
  </div>

  {/* ✅ BARIS BAWAH → FULL WIDTH */}
  {(debt.reason || debt.note) && (
    <div className="mt-2 pl-0">
      
      {debt.reason && (
        <p className="text-sm themed-text-muted">
          {debt.reason}
        </p>
      )}

      {debt.note && (
        <p className="text-sm themed-text-soft mt-1">
          {debt.note}
        </p>
      )}

    </div>
  )}

</div>

        {/* DIVIDER */}
        <div className="my-3 border-t themed-border" />

        {/* JUMLAH TOTAL */}

{/* JUMLAH TOTAL */}
<div className="mt-4">
  <p className="text-sm themed-text-muted">
    Jumlah Total
  </p>
  <p className="text-lg font-semibold themed-text">
    {formatRupiah(debt.amount)}
  </p>
</div>

{/* HARUS DIBAYAR + LUNAS */}
<div className="mt-4 flex justify-between items-start">

  {/* LEFT */}
  <div>
    <p className="text-sm themed-text-muted">
      Harus dibayar
    </p>
    <p className="text-lg font-semibold themed-danger-text">
      {formatRupiah(remaining)}
    </p>
  </div>

  {/* RIGHT */}
  <div className="text-left">
    <p className="text-sm themed-text-muted">
      Lunas
    </p>
    <p className="text-lg font-semibold text-emerald-400">
      {formatRupiah(paidAmount)}
    </p>
  </div>

</div>

{/* BUTTONS / STATUS */}
{isPaid ? (
  <div className="mt-4">
    <div className="
      themed-card
      rounded-2xl
      py-3
      text-center
    ">
<div className="flex items-center justify-center gap-2">
  <CheckCircle size={16} className="text-emerald-500" />
  <p className="text-sm font-semibold text-emerald-500">
    {paidMessage}
  </p>
</div>
    </div>
  </div>
) : (
  <div className="flex gap-2 mt-4">
    <button
      onClick={handleBorrowAgain}
      className="
        flex-1 themed-card
        rounded-2xl py-2 text-sm font-medium
        active:scale-95 transition
      "
    >
      Pinjam Lagi
    </button>

    <button
      onClick={() => {
        setPayValue("")
        setShowWalletPicker(true)
      }}
      className="flex-1 themed-primary-button"
    >
      Bayar
    </button>
  </div>
)}
        
      </div>

      {/* ===== TRANSAKSI ===== */}
      <div className="mt-6">
        <h2 className="font-semibold themed-text mb-3">
          Transaksi
        </h2>

{sortedDates.length === 0 ? (
  <div className="
    themed-card rounded-2xl p-4
    themed-text-muted text-sm
  ">
    Belum ada transaksi
  </div>
) : (
  sortedDates.map((date) => (
    <div key={date} className="mb-5">

      {/* DATE */}
      <div className="mb-2">
        <span className="themed-card px-3 py-1 rounded-full text-sm">
          {new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-3">
        {grouped[date].map((t) => {
          const wallet = getWalletById(t.walletId)

          const isGradient =
            wallet?.color?.startsWith("linear-gradient")

          const isLight =
            isLightColor(wallet?.color)

          const textClass =
            isGradient
              ? "text-white"
              : isLight
              ? "text-slate-800"
              : "text-white"

          return (
            <div
              key={t.id}
              className="
                themed-card rounded-2xl p-4
                flex justify-between items-center
              "
            >
              {/* LEFT */}
              <div>
                <p className="font-medium themed-text">
                  {t.type === "pay"
                    ? "Pembayaran Hutang"
                    : "Pinjam Lagi"}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm themed-text-muted">
                    Hutang
                  </p>

                  {wallet ? (
                    <span
                      className={`
                        text-xs px-2.5 py-0.5 rounded-full
                        font-medium backdrop-blur-sm
                        ${textClass}
                      `}
                      style={{
                        backgroundColor: !isGradient
                          ? wallet.color
                          : undefined,

                        backgroundImage: isGradient
                          ? wallet.color
                          : undefined,
                      }}
                    >
                      {wallet.name}
                    </span>
                  ) : (
                    <span className="
                      text-xs px-2.5 py-0.5 rounded-full
                      themed-card themed-border
                      themed-text-muted
                    ">
                      Tanpa Dompet
                    </span>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    t.type === "pay"
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }`}
                >
                  {t.type === "pay" ? "-" : "+"}
                  {formatRupiah(t.amount)}
                </p>

                <p className="text-xs themed-text-soft">
                  {new Date(t.date).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  ))
)}
      </div>
      
      
{showCalculator && (
<CalculatorModal
  value={payValue}
  setValue={setPayValue}
  selectedWallet={selectedWallet}
  label="Jumlah bayar :"
  onClose={() => setShowCalculator(false)}
  onSubmit={() => {
    const amount = Number(payValue)
 if (!amount) return
 handlePay(amount)
 setShowCalculator(false)   
  setPayValue("")            
  }}
/>
)}

{showWalletPicker && (
  <WalletPickerHutang
    wallets={wallets}
    selected={selectedWallet}
    onSelect={(wallet) => {
      setSelectedWallet(wallet)
      setShowWalletPicker(false)
      setShowCalculator(true)
    }}
    onClose={() => setShowWalletPicker(false)}
  />
)}

{showBorrowCalculator && (
  <CalculatorModal
    value={payValue}
    setValue={setPayValue}
    showWalletInfo={false}
    label="Jumlah pinjam :"
    onClose={() => {
      setShowBorrowCalculator(false)
      setPayValue("")
    }}
    onSubmit={() => {
  const amount = Number(payValue)
 if (!amount) return
 handleBorrowAgainSubmit(amount)
}}
    submitLabel="Lanjutkan"
  />
)}

{showInsufficientModal && (
  <div className="
    fixed inset-0 z-50
    bg-black/30 backdrop-blur-sm
    flex items-center justify-center
  ">
    <div className="
      w-[92%] max-w-sm
      bg-white dark:bg-zinc-900
      rounded-2xl
      overflow-hidden
      shadow-xl
      animate-fade-in
    ">
      
      {/* CONTENT */}
      <div className="p-10 text-center">
        <p className="text-base font-semibold themed-text">
          Saldo dompet tidak cukup
        </p>
      </div>

      {/* DIVIDER */}
      <div className="border-t themed-border" />

      {/* BUTTONS */}
      <div className="flex h-12 text-sm font-medium">
        
        {/* PILIH DOMPET */}
        <button
          onClick={() => {
            setShowInsufficientModal(false)
            setShowWalletPicker(true)
          }}
          className="
            flex-1
            text-[var(--primary)]
            active:bg-zinc-100 dark:active:bg-zinc-800
            transition
          "
        >
          Pilih Dompet
        </button>

        {/* VERTICAL DIVIDER */}
        <div className="w-px themed-border bg-zinc-200 dark:bg-zinc-800" />

        {/* OK */}
        <button
          onClick={() => {
            setShowInsufficientModal(false)
            setShowCalculator(true)
          }}
          className="
            flex-1
            themed-text
            active:bg-zinc-100 dark:active:bg-zinc-800
            transition
          "
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}

{showOverpayModal && (
  <div className="
    fixed inset-0 z-50
    bg-black/30 backdrop-blur-sm
    flex items-center justify-center
  ">
    <div className="
      w-[92%] max-w-sm
      bg-white dark:bg-zinc-900
      rounded-2xl
      overflow-hidden
      shadow-xl
      animate-fade-in
    ">
      
      {/* CONTENT */}
      <div className="p-10 text-center">
        <p className="text-base font-semibold themed-text">
          Pembayaran melebihi sisa hutang
        </p>
      </div>

      {/* DIVIDER */}
      <div className="border-t themed-border" />

      {/* BUTTON */}
      <button
        onClick={() => setShowOverpayModal(false)}
        className="
          w-full h-12
          text-[var(--primary)]
          text-sm font-medium
          active:bg-zinc-100 dark:active:bg-zinc-800
          transition
        "
      >
        OK
      </button>
    </div>
  </div>
)}
    </div>
  )
}

/* ===== FORMATTERS ===== */
function formatDue(date, time) {
  if (date && time) {
    return `${formatDisplayDate(date)}, ${time}`
  }
  if (date) return formatDisplayDate(date)
  if (time) return time
  return ""
}

function formatDisplayDate(value) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function CalculatorModal({ 
  value, 
  setValue, 
  selectedWallet = null,
  showWalletInfo = true,
  label = "Jumlah bayar :",
  onClose, 
  onSubmit, 
  submitLabel 
}) {
  const buttons = [
    "1","2","3",
    "4","5","6",
    "7","8","9",
    "0","←","C"
  ]

  const handleClick = (btn) => {
    if (btn === "C") {
      setValue("")
      return
    }

    if (btn === "←") {
      setValue(value.slice(0, -1))
      return
    }

    setValue(value + btn)
  }

  return (
    <div className="
      fixed inset-0 z-50
      bg-black/40 backdrop-blur-sm
      flex items-end justify-center
    ">
      <div className="
        w-full max-w-md
        themed-card rounded-t-3xl p-5
        animate-slide-up
      ">


{/* ✅ INFO DOMPET */}
{showWalletInfo && (
  <div className="mb-3">
    {selectedWallet?.id ? (
      <div
        className="
          rounded-2xl px-3 py-2
          text-white
          flex justify-between items-center
        "
        style={{ background: selectedWallet?.color }}
      >
        <p className="text-sm font-medium">
          {selectedWallet.name}
        </p>

        <div className="flex items-center gap-1 text-sm">
          <span className="font-semibold opacity-80">
            Saldo kamu :
          </span>
          <span className="font-semibold">
           {formatRupiah(selectedWallet?.balance || 0)}
          </span>
        </div>
      </div>
    ) : (
      <div
        className="
          rounded-2xl px-3 py-2
          themed-card themed-border themed-text
        "
      >
        Tanpa Dompet
      </div>
    )}
  </div>
)}

{/* DISPLAY + CLOSE */}
<div className="flex gap-3 mb-4">

  {/* NOMINAL CARD */}
  <div className="flex-1 themed-card rounded-2xl p-4">
    <p className="text-xs themed-text-muted">
  {label}
</p>

    <p className="text-2xl font-bold themed-text mt-1">
      {value ? formatRupiah(Number(value)) : "Rp0"}
    </p>
  </div>

  {/* CLOSE BUTTON */}
  <button
    onClick={onClose}
    className="
      px-4 min-w-[72px]
      rounded-2xl
      themed-card themed-border
      text-sm font-medium themed-text
      active:scale-95 transition
    "
  >
    Tutup
  </button>

</div>

        {/* KEYPAD */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className="
                themed-card rounded-xl h-12
                font-medium themed-text
                active:scale-95 transition
              "
            >
              {btn}
            </button>
          ))}
        </div>

        {/* SUBMIT */}
<button
  onClick={onSubmit}
  disabled={!value}
  className="w-full themed-primary-button h-12 rounded-2xl font-semibold disabled:opacity-50"
>
  {submitLabel || "OK"}
</button>
      </div>
    </div>
  )
}