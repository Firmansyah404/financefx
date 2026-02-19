import { useEffect, useState, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { formatRupiah } from "../utils/formatRupiah"

export default function HutangList() {
  const navigate = useNavigate()
  const location = useLocation()

  const [debts, setDebts] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  
  useEffect(() => {
  const savedToast = sessionStorage.getItem("toast")

  if (savedToast) {
    setToastMessage(savedToast)
    setShowToast(true)

    sessionStorage.removeItem("toast")

    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }
}, [])

  // ✅ LOAD DATA
  useEffect(() => {
    const storedDebts =
      JSON.parse(localStorage.getItem("debts") || "[]")

    setDebts(storedDebts)
  }, [])

  // ✅ TOAST CREATED
  

  // ✅ SORT TERBARU
  const sortedDebts = useMemo(() => {
    return [...debts].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
  }, [debts])

  return (
    <div className="min-h-[100dvh] themed-page p-4 pb-28">

      {/* ✅ TOAST */}
      {showToast && (
  <div className="
    fixed top-4 left-1/2 -translate-x-1/2 z-50
    themed-toast animate-toast
    flex items-center gap-2 px-5 h-11
  ">
    <CheckCircle2 size={18} className="text-emerald-400" />
    {toastMessage} {/* ✅ DINAMIS */}
  </div>
)}

      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full themed-card flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-lg font-semibold themed-text">
          Daftar Hutang
        </h1>
      </div>

      {/* ===== LIST ===== */}
      {sortedDebts.length === 0 ? (
        <div className="
          themed-card rounded-3xl p-6 text-center themed-text-muted
        ">
          <p className="mb-3">
            Belum ada hutang tercatat
          </p>

          <button
            onClick={() => navigate("/hutang")}
            className="
              px-5 py-2 rounded-full
              themed-primary-button text-sm
            "
          >
            + Tambah Hutang
          </button>
        </div>
      ) : (
        <div className="space-y-3">

          {sortedDebts.map((debt) => (
            <button
              key={debt.id}
              onClick={() => navigate(`/hutang/${debt.id}`)}
              className="
                w-full text-left
                themed-card rounded-2xl p-4
                flex justify-between items-center
                active:scale-[0.99] transition
              "
            >
              <div>
                <p className="font-medium themed-text">
                  {debt.personName || "Tanpa Nama"}
                </p>

                <p className="text-sm themed-text-muted mt-1">
                  {debt.reason || "Tanpa alasan"}
                </p>

                <p className="text-xs themed-text-soft mt-1">
                  {formatDate(debt.date)}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-rose-400">
                  {formatRupiah(debt.amount)}
                </p>

                <StatusBadge status={debt.status} />
              </div>
            </button>
          ))}

        </div>
      )}
      {/* ===== FLOATING BUTTON ===== */}
<button
  onClick={() => navigate("/hutang")}
  className="
    fixed bottom-8 right-4
    px-5 py-3 rounded-2xl
    themed-primary-button
    shadow-lg
    active:scale-95 transition
  "
>
  + Tambah Hutang
</button>
    </div>
  )
}


/* ===== COMPONENTS ===== */

function StatusBadge({ status }) {
  const isPaid = status === "paid"

  return (
    <span
      className={`
        text-xs px-2.5 py-0.5 rounded-full mt-1 inline-block
        font-medium
        ${
          isPaid
            ? "bg-emerald-400/20 text-emerald-400"
            : "bg-rose-400/20 text-rose-400"
        }
      `}
    >
      {isPaid ? "Lunas" : "Belum lunas"}
    </span>
  )
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}