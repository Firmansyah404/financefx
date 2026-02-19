import { X, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

const defaultCategories = {
  expense: [
    { name: "Makanan", type: "expense" },
    { name: "Belanja", type: "expense" },
    { name: "Pakaian", type: "expense" },
    { name: "Kesehatan", type: "expense" },
    { name: "Hiburan", type: "expense" },
    { name: "Lainnya", type: "expense" },
  ],
  income: [
    { name: "Hadiah", type: "income" },
    { name: "Bunga", type: "income" },
    { name: "Gaji", type: "income" },
    { name: "Penjualan", type: "income" },
    { name: "Lainnya", type: "income" },
  ],
  transfer: [
    { name: "Transfer", type: "transfer" },
  ],
}

export default function CategorySheet({
  type,
  onChangeType,
  onSelect,
  onClose,
}) {
  const navigate = useNavigate()

  // ✅ Defensive read custom categories
  const raw =
    JSON.parse(localStorage.getItem("customCategories")) || []

  const customCategories = raw.filter(
    (c) => c?.name && c?.type
  )

  // ✅ Merge default + custom sesuai type aktif
  const mergedCategories = [
    ...(defaultCategories[type] || []),
    ...customCategories.filter((c) => c.type === type),
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* SHEET */}
      <div className="relative w-full themed-card rounded-t-3xl p-4 animate-slideUp">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">

          <p className="text-lg font-semibold themed-text">
            Pilih Kategori
          </p>

          <div className="flex gap-2">

            {/* ADD CATEGORY */}
            <button
              onClick={() =>
                navigate("/add-category", { state: { type } })
              }
              className="w-10 h-10 rounded-full themed-card flex items-center justify-center active:scale-95 transition"
            >
              <Plus size={18} className="themed-text" />
            </button>

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full themed-card flex items-center justify-center active:scale-95 transition"
            >
              <X size={18} className="themed-text" />
            </button>
          </div>
        </div>

        {/* TYPE SWITCH */}
        <div className="flex gap-2 mb-4">
          {[
            { key: "expense", label: "Pengeluaran" },
            { key: "income", label: "Pemasukan" },
            { key: "transfer", label: "Transfer" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => {
                onChangeType(t.key)

                // ✅ AUTO SELECT kalau transfer
                if (t.key === "transfer") {
                  onSelect({
                    name: "Transfer",
                    type: "transfer",
                  })
                }
              }}
              className={`
                flex-1 py-2 rounded-full text-sm font-medium transition
                ${
                  type === t.key
                    ? "themed-card themed-text shadow-inner"
                    : "themed-text-muted"
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* CATEGORY LIST */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">

          {mergedCategories.map((cat, i) => (
            <button
              key={i}
              onClick={() => onSelect(cat)}
              className="
                w-full themed-card rounded-2xl p-4 text-left
                font-medium transition
                active:scale-[0.99]
              "
            >
              <span className="themed-text">
                {cat.name}
              </span>
            </button>
          ))}

          {/* ✅ Safety fallback */}
          {mergedCategories.length === 0 && (
            <p className="text-center themed-text-muted py-6">
              Tidak ada kategori
            </p>
          )}
        </div>
      </div>
    </div>
  )
}