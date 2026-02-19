import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import CalculatorSheet from "../components/CalculatorSheet"

export default function AdjustWallet() {
  const navigate = useNavigate()
  const { id } = useParams()
  const walletId = Number(id)

  const wallets = JSON.parse(localStorage.getItem("wallets") || "[]")
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]")

  const wallet = wallets.find((w) => w.id === walletId)

  if (!wallet) {
    return (
      <div className="min-h-[100dvh] themed-page p-4">
        <p className="themed-text">Dompet tidak ditemukan</p>
      </div>
    )
  }

  const [amount, setAmount] = useState(String(wallet.balance))
  const [recordAsTransaction, setRecordAsTransaction] = useState(true)
  const [showCalculator, setShowCalculator] = useState(false)

  const formatNumber = (value) => {
    if (!value) return "0"
    return new Intl.NumberFormat("id-ID").format(value)
  }

  const handleSave = () => {
    const numericAmount = Number(amount || 0)
    const oldBalance = Number(wallet.balance)

    // ===== UPDATE SALDO =====
    const updatedWallets = wallets.map((w) =>
      w.id === walletId ? { ...w, balance: numericAmount } : w
    )

    localStorage.setItem("wallets", JSON.stringify(updatedWallets))

    // ===== CATAT PENYESUAIAN =====
    if (recordAsTransaction) {
      const difference = numericAmount - oldBalance

      if (difference !== 0) {
        const now = new Date()

        const adjustmentTransaction = {
          id: Date.now(),
          walletId: walletId,
          name: "Penyesuaian Saldo",
          category: "Penyesuaian",
          amount: Math.abs(difference),
          type: difference > 0 ? "income" : "expense",
          date: now.toISOString().split("T")[0],
          time: now.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }

        localStorage.setItem(
          "transactions",
          JSON.stringify([adjustmentTransaction, ...transactions])
        )
      }
    }

    navigate(`/wallet/${walletId}`, {
      replace: true,
      state: {
        adjusted: true,
        walletName: wallet.name,
      },
    })
  }

  return (
    <div className="min-h-[100dvh] themed-page p-4 flex flex-col">

      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() =>
            navigate(`/wallet/${walletId}`, { replace: true })
          }
          className="
            w-10 h-10 rounded-full
            themed-card
            flex items-center justify-center
            active:scale-95 transition
          "
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-lg font-semibold themed-text">
          Sesuaikan Saldo
        </h1>
      </div>

      {/* ===== INFO ===== */}
      <div className="text-center mb-6">
        <p className="themed-text-soft">
          Anda sedang mengubah{" "}
          <span className="font-semibold themed-text">
            {wallet.name}
          </span>
        </p>
      </div>

      {/* ===== SALDO DISPLAY ===== */}
      <div className="themed-card rounded-2xl p-5 mb-4">
        <p className="text-sm themed-text-muted mb-2">
          Saldo Saat Ini
        </p>

        <div
          onClick={() => setShowCalculator(true)}
          className="
            text-2xl font-semibold
            themed-text
            cursor-pointer
            active:scale-[0.99]
            transition
          "
        >
          Rp {formatNumber(amount)}
        </div>
      </div>

      {/* ===== TOGGLE ===== */}
      <div className="themed-card rounded-2xl p-5 flex justify-between items-center">
        <div>
          <p className="font-medium themed-text">
            Catat sebagai Transaksi
          </p>

          <p className="text-sm themed-text-muted">
            Transaksi baru akan ditambahkan
          </p>
        </div>

       <button
  onClick={() =>
    setRecordAsTransaction(!recordAsTransaction)
  }
  className={`
    w-14 h-8 rounded-full transition
    flex items-center
    ${recordAsTransaction
      ? "bg-indigo-600"
      : "bg-zinc-600"}
  `}
>
  <div
    className={`
      w-6 h-6 rounded-full bg-white transition-all
      ${recordAsTransaction ? "ml-7" : "ml-1"}
    `}
  />
</button>
      </div>

      {/* ===== SAVE BUTTON ===== */}
      <div className="mt-auto pt-6">
        <button
          onClick={handleSave}
          className="
            w-full
            themed-card
            py-4 rounded-2xl
            font-semibold themed-text
            active:scale-95 transition
          "
        >
          Simpan
        </button>
      </div>

      {/* ===== CALCULATOR ===== */}
      {showCalculator && (
        <CalculatorSheet
          value={Number(amount)}
          onChange={(val) => setAmount(String(val))}
          onClose={() => setShowCalculator(false)}
          label="Saldo saat ini"
        />
      )}
    </div>
  )
}