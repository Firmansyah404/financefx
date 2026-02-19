import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { formatRupiah } from "../utils/formatRupiah"

export default function Transactions() {
  const navigate = useNavigate()

  const transactions =
    JSON.parse(localStorage.getItem("transactions")) || []

  const wallets =
    JSON.parse(localStorage.getItem("wallets")) || []

  const getWalletById = (id) =>
    wallets.find(w => w.id === id)

  // ✅ DETECT LIGHT COLOR
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

  // ✅ GROUP BY DATE
  const grouped = transactions.reduce((acc, t) => {
    if (!acc[t.date]) acc[t.date] = []
    acc[t.date].push(t)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  )

  const formatDate = (value) =>
    new Date(value).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  return (
    <div className="min-h-[100dvh] themed-page p-4 pb-24">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full themed-card flex items-center justify-center active:scale-95 transition"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-xl font-semibold themed-text">
          Semua Transaksi
        </h1>
      </div>

      {/* LIST */}
      {sortedDates.length === 0 ? (
        <p className="text-zinc-500 text-sm">
          Belum ada transaksi
        </p>
      ) : (
        sortedDates.map((date) => (
          <div key={date} className="mb-6">

            {/* DATE */}
            <div className="mb-3">
              <span className="themed-card px-3 py-1 rounded-full text-sm">
                {formatDate(date)}
              </span>
            </div>

            {/* TRANSACTIONS */}
            <div className="flex flex-col gap-3">
              {grouped[date].map((t) => (
                <div
                  key={t.id}
                  onClick={() =>
                    navigate(`/transaction/${t.id}`)
                  }
                  className="
                    themed-card rounded-2xl p-4
                    flex justify-between items-center
                    active:scale-[0.98]
                    transition
                    cursor-pointer
                  "
                >
                  <div>
                    <p className="font-medium themed-text">
                      {t.name}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm themed-text-muted">
                        {t.category}
                      </p>

                      {(() => {
                        const wallet = getWalletById(t.walletId)
                        if (!wallet) return null

                        const isGradient =
                          wallet.color?.startsWith("linear-gradient")

                        const isLight =
                          isLightColor(wallet.color)

                        const textClass =
                          isGradient
                            ? "text-white"
                            : isLight
                            ? "text-slate-800"
                            : "text-white"

                        return (
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
                        )
                      })()}
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        t.type === "income"
                          ? "text-emerald-400"
                          : t.type === "expense"
                          ? "text-rose-400"
                          : "text-indigo-400"
                      }`}
                    >
                      {t.type === "income"
                        ? "+"
                        : t.type === "expense"
                        ? "-"
                        : "⇄"}
                      {formatRupiah(t.amount)}
                    </p>

                    {/* ✅ ADMIN FEE */}
                    {t.type === "transfer" && (
  <p className="text-xs text-rose-400">
    Biaya admin{" "}
    {Number(t.adminFee) > 0 ? (
      <span className="text-rose-400">
        ({formatRupiah(t.adminFee)})
      </span>
    ) : (
      <span className="text-rose-400">
        (Gratis)
      </span>
    )}
  </p>
)}

                    <p className="text-xs themed-text-soft">
                      {t.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}