import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { formatRupiah } from "../utils/formatRupiah"

const dayLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

export default function Statistik() {
  const navigate = useNavigate()

  const [filter, setFilter] = useState("week")
  const [offset, setOffset] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)

  const transactions = JSON.parse(
    localStorage.getItem("transactions") || "[]"
  )

  // ================= DATE RANGE =================
  const dateRange = useMemo(() => {
    const now = new Date()

    if (filter === "week") {
      const start = new Date(now)
      start.setDate(now.getDate() - now.getDay() + 1 + offset * 7)
      start.setHours(0, 0, 0, 0)

      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)

      return { start, end }
    }

    if (filter === "month") {
      const start = new Date(now.getFullYear(), now.getMonth() + offset, 1)
      start.setHours(0, 0, 0, 0)

      const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0)
      end.setHours(23, 59, 59, 999)

      return { start, end }
    }

    if (filter === "year") {
      const start = new Date(now.getFullYear() + offset, 0, 1)
      start.setHours(0, 0, 0, 0)

      const end = new Date(now.getFullYear() + offset, 11, 31)
      end.setHours(23, 59, 59, 999)

      return { start, end }
    }

    return { start: now, end: now }
  }, [filter, offset])

  // ================= FILTERED =================
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (!t.date) return false

      // ✅ FIX TIMEZONE
      const d = new Date(t.date + "T00:00:00")
      if (isNaN(d)) return false

      return d >= dateRange.start && d <= dateRange.end
    })
  }, [transactions, dateRange])

  // ================= SUMMARY =================
  const { income, expense } = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        const amount = Number(t.amount) || 0
        if (t.type === "income") acc.income += amount
        else acc.expense += amount
        return acc
      },
      { income: 0, expense: 0 }
    )
  }, [filteredTransactions])

  // ================= GROUPING =================
  const chartData = useMemo(() => {
    // ===== WEEK =====
    if (filter === "week") {
      const data = Array.from({ length: 7 }, () => ({
        income: 0,
        expense: 0,
      }))

      filteredTransactions.forEach((t) => {
        const d = new Date(t.date + "T00:00:00") // ✅ FIX
        if (isNaN(d)) return

        let day = d.getDay()
        day = day === 0 ? 6 : day - 1

        const amount = Number(t.amount) || 0

        if (t.type === "income") data[day].income += amount
        else data[day].expense += amount
      })

      return data
    }

    // ===== MONTH =====
    if (filter === "month") {
      const weeksInMonth = Math.ceil(   (dateRange.end.getDate() + dateRange.start.getDay()) / 7 )

      const data = Array.from({ length: weeksInMonth }, () => ({
        income: 0,
        expense: 0,
      }))

      filteredTransactions.forEach((t) => {
        const d = new Date(t.date + "T00:00:00") // ✅ FIX
        if (isNaN(d)) return

        const weekIndex = Math.min(
          Math.floor((d.getDate() - 1) / 7),
          4
        )

        const amount = Number(t.amount) || 0

        if (t.type === "income") data[weekIndex].income += amount
        else data[weekIndex].expense += amount
      })

      return data
    }

    // ===== YEAR =====
    if (filter === "year") {
      const data = Array.from({ length: 12 }, () => ({
        income: 0,
        expense: 0,
      }))

      filteredTransactions.forEach((t) => {
        const d = new Date(t.date + "T00:00:00") // ✅ FIX
        if (isNaN(d)) return

        const month = d.getMonth()
        const amount = Number(t.amount) || 0

        if (t.type === "income") data[month].income += amount
        else data[month].expense += amount
      })

      return data
    }

    return []
  }, [filteredTransactions, filter])

  // ================= LABELS =================
  const labels = useMemo(() => {
    if (filter === "week") return dayLabels
    if (filter === "month")
      return chartData.map((_, i) => `Min ${i + 1}`)
    if (filter === "year")
      return chartData.map((_, i) => `${i + 1}`)
    return []
  }, [filter, chartData])

  // ================= MAX VALUE =================
  const maxValue = useMemo(() => {
    if (!chartData.length) return 1

    return Math.max(
      ...chartData.map((d) => Math.max(d.income, d.expense)),
      1
    )
  }, [chartData])

console.log("Filtered:", filteredTransactions)
console.log("ChartData:", chartData)

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-28">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Statistik</h1>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <SummaryCard
          title="Total Pendapatan"
          value={income}
          color="text-emerald-400"
        />
        <SummaryCard
          title="Total Pengeluaran"
          value={expense}
          color="text-rose-400"
        />
      </div>

      {/* FILTER */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-semibold">Statistik</h2>
          <p className="text-zinc-400 text-sm">
            {formatRange(dateRange)}
          </p>
        </div>

        <div className="relative z-50">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-4 py-2 bg-zinc-800 rounded-xl flex items-center gap-2"
          >
            {filterLabel(filter)}
            <ChevronDown size={16} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl">
              {["week", "month", "year"].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFilter(f)
                    setOffset(0)
                    setShowDropdown(false)
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-white/10"
                >
                  {filterLabel(f)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* NAV */}
      <div className="flex justify-end gap-3 mb-4">
        <ArrowButton onClick={() => setOffset(offset - 1)}>
          <ChevronLeft size={18} />
        </ArrowButton>
        <ArrowButton onClick={() => setOffset(offset + 1)}>
          <ChevronRight size={18} />
        </ArrowButton>
      </div>

      {/* CHART */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          {chartData.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="flex items-end gap-1 h-32">
                <Bar value={d.expense} max={maxValue} color="bg-rose-500" />
                <Bar value={d.income} max={maxValue} color="bg-emerald-500" />
              </div>
              <span className="text-xs text-zinc-400">
                {labels[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

/* ================= COMPONENTS ================= */

function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <p className="text-zinc-400 text-sm">{title}</p>
      <p className={`text-lg font-bold ${color}`}>
        {formatRupiah(value)}
      </p>
    </div>
  )
}

function ArrowButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center"
    >
      {children}
    </button>
  )
}

function Bar({ value, max, color }) {
  const safeMax = max || 1
  const rawHeight = (value / safeMax) * 100
  const height = `${Math.max(rawHeight, value > 0 ? 3 : 0)}%`

    return (
    <div className="w-5 h-full bg-zinc-800 rounded-full overflow-hidden">
      <div
        className={`${color} transition-all duration-500`}
        style={{ height }}
      />
    </div>
  )
}

/* ================= HELPERS ================= */

function filterLabel(filter) {
  if (filter === "week") return "Mingguan"
  if (filter === "month") return "Bulanan"
  return "Tahunan"
}

function formatRange(range) {
  return `${range.start.toLocaleDateString("id-ID")} - ${range.end.toLocaleDateString("id-ID")}`
}