import { ArrowLeft, CalendarDays, Clock } from "lucide-react"
import { formatRupiah } from "../utils/formatRupiah"
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import CalculatorSheet from "../components/CalculatorSheet"

export default function Hutang() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const dateRef = useRef(null)
const dueDateRef = useRef(null)
const dueTimeRef = useRef(null)
  const [showToast, setShowToast] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)

  useEffect(() => {
    if (location.state?.toast === "created") {
      setShowToast(true)

      const timer = setTimeout(() => {
        setShowToast(false)
      }, 3000)

      window.history.replaceState({}, document.title)
      return () => clearTimeout(timer)
    }
  }, [location.state])

  const [date, setDate] = useState(new Date())

  const [dueDateEnabled, setDueDateEnabled] = useState(false)
  const [dueTimeEnabled, setDueTimeEnabled] = useState(false)

  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState("")

  const [debtType, setDebtType] = useState("self")
  const [personName, setPersonName] = useState("")
  const [reason, setReason] = useState("")
  const [amount, setAmount] = useState(0)
  const [note, setNote] = useState("")

  const handleSave = () => {
    if (amount <= 0) return alert("Jumlah hutang wajib diisi")

    if (!personName.trim()) {
      return alert(
        debtType === "self"
          ? "Nama tujuan hutang wajib diisi"
          : "Nama orang wajib diisi"
      )
    }

    const debts = JSON.parse(localStorage.getItem("debts") || "[]")

    const newDebt = {
      id: Date.now(),
      type: debtType,
      date,
      dueDate: dueDateEnabled ? dueDate : null,
      dueTime: dueTimeEnabled ? dueTime : null,
      personName,
      reason,
      amount,
      note,
      status: "unpaid",
    }

    localStorage.setItem(
      "debts",
      JSON.stringify([...debts, newDebt])
    )

    navigate("/hutang-list", {
       replace: true,
      state: { toast: "created" }
    })
  }

  return (
    <div className="min-h-screen themed-page p-4 pb-28">
<input
  ref={dueDateRef}
  type="date"
  hidden
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
/>

<input
  ref={dueTimeRef}
  type="time"
  hidden
  value={dueTime}
  onChange={(e) => setDueTime(e.target.value)}
/>
      {showToast && (
        <div className="
          fixed top-4 left-1/2 -translate-x-1/2 z-50
          themed-toast animate-toast
        ">
          Hutang berhasil ditambahkan
        </div>
      )}

      {showCalculator && (
        <CalculatorSheet
          mode="input"
          value={amount}
          label="Jumlah Hutang"
          onClose={() => setShowCalculator(false)}
          onChange={(val) => setAmount(val)}
        />
      )}

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full themed-card flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-lg font-semibold themed-text">
          Tambah Hutang
        </h1>
      </div>

      <div className="space-y-4">

        {/* ===== TANGGAL ===== */}
<div className="themed-card rounded-2xl p-4">
  <p className="text-sm themed-text-muted">
    Tanggal
  </p>

  <button
    onClick={() => dateRef.current?.showPicker()}
    className="mt-2 text-left w-full"
  >
    <p className="text-lg font-semibold themed-text">
      {formatFullDateTime(date)}
    </p>
  </button>

  <input
    ref={dateRef}
    type="datetime-local"
    hidden
    value={formatForInput(date)}
    onChange={(e) =>
      setDate(new Date(e.target.value))
    }
  />
</div>

        {/* ===== JATUH TEMPO ===== */}
<div className="themed-card rounded-2xl p-4">
  <p className="text-sm themed-text-muted mb-3">
    Jatuh Tempo (Opsional)
  </p>

  {/* ===== TANGGAL ===== */}
  <div>
    <ToggleRow
      icon={<CalendarDays size={16} />}
      label="Tanggal"
      checked={dueDateEnabled}
      onChange={setDueDateEnabled}
    />

    {dueDateEnabled && (
     <button
  onClick={() => dueDateRef.current?.showPicker()}
  className="mt-2 w-full themed-input text-left themed-text"
>
  {dueDate ? formatDisplayDate(dueDate) : "Pilih tanggal"}
</button>
    )}
  </div>

  {/* ===== JAM ===== */}
  <div className="mt-3">
    <ToggleRow
      icon={<Clock size={16} />}
      label="Jam"
      checked={dueTimeEnabled}
      onChange={setDueTimeEnabled}
    />

    {dueTimeEnabled && (
      <button
        onClick={() => dueTimeRef.current?.showPicker()}
        className="
          mt-2 w-full themed-input text-left
          themed-text
        "
      >
        {dueTime ? dueTime : "Pilih jam"}
      </button>
    )}
  </div>
</div>

        {/* ===== TIPE HUTANG ===== */}
        <div className="themed-card rounded-2xl p-2 flex gap-2">
          <SegmentButton
            active={debtType === "self"}
            onClick={() => setDebtType("self")}
          >
            Saya yang hutang
          </SegmentButton>

          <SegmentButton
            active={debtType === "other"}
            onClick={() => setDebtType("other")}
          >
            Orang lain yang hutang
          </SegmentButton>
        </div>

        {/* ===== NAMA ===== */}
        <div className="themed-card rounded-2xl p-4">
          <p className="text-sm themed-text-muted">
            {debtType === "self"
              ? "Kesiapa kamu berhutang?"
              : "Nama orang yang berhutang"}
          </p>

          <input
            type="text"
            placeholder="Masukkan nama"
            value={personName}
            onChange={(e) =>
              setPersonName(e.target.value)
            }
            className="
              mt-1 w-full bg-transparent outline-none
              text-lg font-semibold themed-text
              placeholder:themed-text-muted
            "
          />
        </div>

        {/* ===== ALASAN ===== */}
        <div className="themed-card rounded-2xl p-4">
          <p className="text-sm themed-text-muted">
            Alasan berhutang (Opsional)
          </p>

          <input
            type="text"
            placeholder="Misal: Untuk belanja"
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
            className="
              mt-1 w-full bg-transparent outline-none
              text-lg font-semibold themed-text
              placeholder:themed-text-muted
            "
          />
        </div>

        {/* ===== JUMLAH ===== */}
        <div
          onClick={() => setShowCalculator(true)}
          className="
            themed-card rounded-2xl p-4
            cursor-pointer
            active:scale-[0.99] transition
          "
        >
          <p className="text-sm themed-text-muted">
            Jumlah Hutang
          </p>

          <p className="text-lg font-semibold themed-text mt-1">
            {amount > 0
              ? formatRupiah(amount)
              : "Rp0"}
          </p>
        </div>

        {/* ===== CATATAN ===== */}
        <div className="themed-card rounded-2xl p-4">
          <p className="text-sm themed-text-muted">
            Catatan (Opsional)
          </p>

          <textarea
            placeholder="Tambahkan catatan"
            value={note}
            onChange={(e) =>
              setNote(e.target.value)
            }
            className="
              mt-1 w-full bg-transparent outline-none resize-none
              text-lg font-semibold themed-text
              placeholder:themed-text-muted
            "
            rows={2}
          />
        </div>

      </div>

      {/* ===== SAVE BUTTON ===== */}
      <button
        onClick={handleSave}
        className="
          fixed bottom-6 left-4 right-4
          themed-primary-button
        "
      >
        Simpan Hutang
      </button>
    </div>
  )
}

/* ===== COMPONENTS ===== */

function ToggleRow({
  icon,
  label,
  checked,
  onChange,
  className = "",
}) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2 themed-text">
        {icon}
        <span className="text-sm">{label}</span>
      </div>

     <button
  onClick={() => onChange(!checked)}
  className={`
    w-11 h-6 rounded-full transition-all duration-300
    flex items-center
    ${checked 
      ? "bg-[var(--primary)]"   // ✅ warna ON
      : "bg-zinc-300 dark:bg-zinc-600"}  // ✅ warna OFF
  `}
>
  <div
    className={`
      w-5 h-5 bg-white rounded-full shadow
      transform transition-all duration-300
      ${checked ? "translate-x-5" : "translate-x-0"}
    `}
  />
</button>
    </div>
  )
}

function SegmentButton({ active, children, ...props }) {
  return (
    <button
      {...props}
      className={`
        flex-1 py-2 rounded-xl text-sm transition
        ${
          active
            ? "themed-card shadow font-medium"
            : "themed-text-muted"
        }
      `}
    >
      {children}
    </button>
  )
}

function formatForInput(date) {
  const pad = (n) => n.toString().padStart(2, "0")

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`
}

function formatDisplayDate(value) {
  if (!value) return ""

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatFullDateTime(date) {
  return new Date(date).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}