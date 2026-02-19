import { ArrowLeft } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

export default function AddCategory() {
  const navigate = useNavigate()
  const location = useLocation()

  const initialType = location.state?.type || "expense"

  const [type, setType] = useState(initialType)
  const [name, setName] = useState("")

  const handleSave = () => {
    if (!name.trim()) return

    const existing =
      JSON.parse(localStorage.getItem("customCategories")) || []

    const newCategory = {
      name: name.trim(),
      type,
    }

    localStorage.setItem(
      "customCategories",
      JSON.stringify([...existing, newCategory])
    )

    window.dispatchEvent(new Event("categoryUpdated"))
    navigate(-1)
  }

  return (
    <div className="min-h-screen themed-page p-4 pb-32">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="
            w-10 h-10
            rounded-full
            themed-card
            flex items-center justify-center
            active:scale-95
            transition
          "
        >
          <ArrowLeft size={20} className="themed-text" />
        </button>

        <h1 className="text-xl font-semibold themed-text">
          Tambah Kategori
        </h1>
      </div>

{/* TYPE SELECTOR */}
<div className="grid grid-cols-2 gap-3 mb-6">

{/* EXPENSE */}
<button
  onClick={() => setType("expense")}
  className={`
    rounded-2xl p-4 text-left
    themed-card
    category-type-card
    ${type === "expense" ? "active-expense" : ""}
  `}
>
  <p className="text-sm themed-text-muted">
    Pengeluaran
  </p>

  <p className="text-lg font-semibold text-rose-500">
    Kategori Biaya
  </p>
</button>

{/* INCOME */}
<button
  onClick={() => setType("income")}
  className={`
    rounded-2xl p-4 text-left
    themed-card
    category-type-card
    ${type === "income" ? "active-income" : ""}
  `}
>
  <p className="text-sm themed-text-muted">
    Pemasukan
  </p>

  <p className="text-lg font-semibold text-emerald-500">
    Kategori Pendapatan
  </p>
</button>

</div>

      {/* INPUT */}
      <div className="themed-card rounded-2xl p-4 mb-8">
        <p className="text-sm themed-text-muted">
          Nama Kategori
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Transport"
          className="
            bg-transparent
            outline-none
            w-full
            mt-1
            text-lg
            themed-text
            placeholder:themed-text-muted
          "
        />
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        className="
          w-full
          rounded-2xl
          py-4
          font-semibold
          themed-card
          themed-shadow
          active:scale-95
          transition
        "
      >
        Simpan Kategori
      </button>

    </div>
  )
}