import { useParams, useNavigate } from "react-router-dom"
import {
  Camera,
  ArrowLeft,
  ArrowRight,
  X,
  Wallet,
  Landmark,
  CreditCard,
  Banknote,
  Calculator,
} from "lucide-react"
import { useRef, useState, useMemo, useEffect } from "react"
import CategorySheet from "../components/CategorySheet"
import CalculatorSheet from "../components/CalculatorSheet"
import { formatRupiah } from "../utils/formatRupiah"
import { savePhoto, getPhotos } from "../utils/photoDB"
import WalletPicker from "../components/WalletPicker"

export default function EditTransaction() {
  const { id } = useParams()
  const navigate = useNavigate()

  const transactions =
    JSON.parse(localStorage.getItem("transactions")) || []

  const wallets =
    JSON.parse(localStorage.getItem("wallets")) || []

  const transaction = transactions.find(
    (t) => String(t.id) === id
  )

  if (!transaction) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        Transaksi tidak ditemukan
      </div>
    )
  }

  // ===== STATE =====
  const [date, setDate] = useState(transaction.date)
  const [time, setTime] = useState(transaction.time)
  const [name, setName] = useState(transaction.name)

  const [categoryType, setCategoryType] = useState(transaction.type)

  const [category, setCategory] = useState({
    name: transaction.category,
    type: transaction.type,
  })

  const [amount, setAmount] = useState(transaction.amount)
  const [adminFee, setAdminFee] = useState(transaction.adminFee || 0)

  const [note, setNote] = useState(transaction.note || "")

  const [photos, setPhotos] = useState([]) // baru
  const [existingPhotos, setExistingPhotos] = useState([]) // lama

  const [previewPhoto, setPreviewPhoto] = useState(null)

  const [showCategory, setShowCategory] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  
  const [activeCalc, setActiveCalc] = useState("amount")
const [calcMode, setCalcMode] = useState("input") 

  const [isSaving, setIsSaving] = useState(false)
  const [targetWallet, setTargetWallet] = useState(null)

const oldTargetWalletId = transaction.targetWalletId

  const [selectedWallet, setSelectedWallet] = useState(
    wallets.find((w) => w.id === transaction.walletId)
  )

  const walletIconMap = {
    wallet: Wallet,
    bank: Landmark,
    cash: Banknote,
    card: CreditCard,
  }
  
  const isTransfer = transaction.type === "transfer"

  // ===== REFS =====
  const dateRef = useRef(null)
  const timeRef = useRef(null)
  const fileRef = useRef(null)

  // ===== LOAD FOTO LAMA =====
  useEffect(() => {
  const loadPhotos = async () => {
    if (!transaction.photoIds?.length) return

    const result = await getPhotos(transaction.photoIds)

    const validPhotos = result
      .filter(Boolean)
      .map(photo => ({
        id: photo.id,     // ✅ penting
        data: photo.data,
      }))

    setExistingPhotos(validPhotos)
  }

  loadPhotos()
}, [])

// ===== LOAD TARGET WALLET (TRANSFER) =====
useEffect(() => {
  if (!transaction?.targetWalletId) return

  const wallet = wallets.find(
    w => String(w.id) === String(transaction.targetWalletId)
  )

  setTargetWallet(wallet || null)
}, [])

  // ===== SAVE =====
  const handleSave = async () => {
    if (isSaving) return
    if (!category || amount <= 0 || !selectedWallet) return
    if (categoryType === "transfer" && selectedWallet?.id === targetWallet?.id) {
  alert("Dompet asal & tujuan tidak boleh sama!")
  return
}

    try {
      setIsSaving(true)

      const oldAmount = transaction.amount
      const oldType = transaction.type
      const oldWalletId = transaction.walletId
      const oldAdminFee = transaction.adminFee || 0

      const remainingExistingIds = existingPhotos.map(p => p.id)
const photoIds = [...remainingExistingIds]

      for (const img of photos) {
  const saved = await savePhoto(img)
  photoIds.push(saved.id)
}

      // ===== UPDATE TRANSAKSI =====
      const updatedTransactions = transactions.map((t) =>
        t.id === transaction.id
          ? {
              ...t,
              name,
              type: categoryType,
              category: category.name,
              amount: Number(amount),
              adminFee: Number(adminFee), 
              walletId: selectedWallet.id,
              targetWalletId: targetWallet?.id,
              date,
              time,
              note,
              photoIds,
            }
          : t
      )

      localStorage.setItem(
        "transactions",
        JSON.stringify(updatedTransactions)
      )

      // ===== UPDATE SALDO =====
      const updatedWallets = wallets.map((w) => {
        let balance = w.balance

// ===== ROLLBACK LAMA =====
if (oldType === "income" && w.id === oldWalletId)
  balance -= oldAmount

if (oldType === "expense" && w.id === oldWalletId)
  balance += oldAmount

if (oldType === "transfer") {
  if (w.id === oldWalletId)
    balance += oldAmount + oldAdminFee

  if (w.id === oldTargetWalletId)
    balance -= oldAmount
}

// ===== APPLY BARU =====
if (categoryType === "income" && w.id === selectedWallet.id)
  balance += amount

if (categoryType === "expense" && w.id === selectedWallet.id)
  balance -= amount

if (categoryType === "transfer") {
  if (w.id === selectedWallet?.id)
    balance -= amount + adminFee

  if (w.id === targetWallet?.id)
    balance += amount
}

        return { ...w, balance }
      })

      localStorage.setItem("wallets", JSON.stringify(updatedWallets))

      navigate(-1, { state: { edited: true } })

    } catch (e) {
      console.error(e)
      alert("Gagal update transaksi")
    } finally {
      setIsSaving(false)
    }
  }

  // ===== FOTO =====
  const addPhotos = (files) => {
    if (!files) return
    const remaining = 2 - photos.length
    if (remaining <= 0) return

    Array.from(files)
      .slice(0, remaining)
      .forEach((file) => {
        const reader = new FileReader()
        reader.onload = () =>
          setPhotos((prev) => [...prev, reader.result])
        reader.readAsDataURL(file)
      })
  }

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }
  
  const [showWalletPicker, setShowWalletPicker] = useState(null)
  
  function isLightColor(color) {
  if (!color) return false
  if (color.startsWith("linear-gradient")) return false

  const rgb = parseInt(color.substring(1), 16)

  const r = (rgb >> 16) & 255
  const g = (rgb >> 8) & 255
  const b = rgb & 255

  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness > 170
}

const isGradient = useMemo(
  () => selectedWallet?.color?.startsWith("linear-gradient"),
  [selectedWallet]
)

const isLight = useMemo(
  () => isLightColor(selectedWallet?.color),
  [selectedWallet]
)

const isTargetLight = isLightColor(targetWallet?.color)

const textClass =
  isGradient
    ? "text-white"
    : isLight
    ? "text-slate-800"
    : "text-white"

return (
  <div className="min-h-screen themed-page p-4 pb-32">

    {/* HEADER */}
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full themed-card flex items-center justify-center"
      >
        <ArrowLeft size={20} className="themed-text" />
      </button>

      <h1 className="text-lg font-semibold themed-text">
        Edit Transaksi
      </h1>
    </div>

    {/* DATE & TIME */}
    <div className="flex gap-3 mb-4">
      <button
        onClick={() => dateRef.current?.showPicker()}
        className="flex-1 themed-card rounded-2xl p-4 text-left"
      >
        <p className="text-sm themed-text-muted">Tanggal</p>
        <p className="font-semibold themed-text">
          {new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </button>

      <button
        onClick={() => timeRef.current?.showPicker()}
        className="flex-1 themed-card rounded-2xl p-4 text-left"
      >
        <p className="text-sm themed-text-muted">Waktu</p>
        <p className="font-semibold themed-text">{time}</p>
      </button>
    </div>

    <input
      ref={dateRef}
      type="date"
      hidden
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />

    <input
      ref={timeRef}
      type="time"
      hidden
      value={time}
      onChange={(e) => setTime(e.target.value)}
    />

    {/* NAME */}
    <div className="themed-card rounded-2xl p-4 mb-4">
      <p className="text-sm themed-text-muted">Nama</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-transparent outline-none w-full mt-1 themed-text"
      />
    </div>

    {/* CATEGORY */}
<button
  onClick={() => {
    if (isTransfer) return
    setShowCategory(true)
  }}
  className={`
    w-full themed-card rounded-2xl p-4 mb-4
    flex justify-between items-center
    ${isTransfer ? "opacity-50" : "active:scale-[0.99]"}
  `}
>
      <div className="text-left">
        <p className="text-sm themed-text-muted">Kategori</p>
        <p className="font-semibold themed-text">
          {category.name}
        </p>
      </div>

      <span
        className={`text-xs px-3 py-1 rounded-full ${
          categoryType === "income"
            ? "bg-emerald-500/20 text-emerald-400"
            : "bg-rose-500/20 text-rose-400"
        }`}
      >
        {categoryType === "income"
          ? "Pemasukan"
          : "Pengeluaran"}
      </span>
    </button>

    {/* WALLET */}
    <div className="mb-4">
      <p className="text-sm themed-text-muted mb-2">
        {categoryType === "transfer" ? "Transfer" : "Dompet"}
      </p>

      {categoryType === "transfer" ? (
        <div className="flex items-center gap-3">

          {/* DARI */}
          <div className="flex-1">
            <p className="text-xs themed-text-muted mb-2">
              Dari
            </p>

            <button
              onClick={() => setShowWalletPicker("from")}
              className="w-full rounded-3xl p-4 text-left relative overflow-hidden themed-card active:scale-95 transition"
            >
              {selectedWallet ? (
                <>
                  <div
                    className="absolute inset-0 opacity-90"
                    style={{ background: selectedWallet?.color }}
                  />

                  <div className="relative z-10">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2
  ${isLight ? "bg-black/10" : "bg-white/20"}
`}>
                      {(() => {
                        const Icon =
                          walletIconMap[selectedWallet.icon] || Wallet
                        return <Icon size={18} className={textClass} />
                      })()}
                    </div>

                    <p className={`font-semibold ${textClass}`}>
                      {selectedWallet.name}
                    </p>

                    <p className={`text-sm ${textClass} opacity-70`}>
                      {formatRupiah(selectedWallet.balance)}
                    </p>
                  </div>
                </>
              ) : (
                <p className="themed-text-muted">
                  Pilih Dompet
                </p>
              )}
            </button>
          </div>

          {/* PANAH */}
          <div className="pt-6">
            <div className="w-11 h-11 rounded-full themed-card flex items-center justify-center">
              <ArrowRight size={18} className="themed-text-muted" />
            </div>
          </div>

          {/* KE */}
          <div className="flex-1">
            <p className="text-xs themed-text-muted mb-2">
              Ke
            </p>

            <button
              onClick={() => setShowWalletPicker("to")}
              className="w-full rounded-3xl p-4 text-left relative overflow-hidden themed-card active:scale-95 transition"
            >
              {targetWallet ? (
                <>
                  <div
                    className="absolute inset-0 opacity-90"
                    style={{ background: targetWallet.color }}
                  />

                  <div className="relative z-10">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2
  ${isTargetLight ? "bg-black/10" : "bg-white/20"}
`}>
                      {(() => {
                        const Icon =
                          walletIconMap[targetWallet.icon] || Wallet
                        return <Icon size={18} className={textClass} />
                      })()}
                    </div>

                    <p className={`font-semibold ${textClass}`}>
                      {targetWallet.name}
                    </p>

                    <p className={`text-sm ${textClass} opacity-70`}>
                      {formatRupiah(targetWallet.balance)}
                    </p>
                  </div>
                </>
              ) : (
                <p className="themed-text-muted">
                  Pilih Dompet
                </p>
              )}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowWalletPicker("single")}
          className="w-40 h-32 rounded-3xl p-4 text-left relative overflow-hidden active:scale-95 transition"
          style={{ background: selectedWallet?.color }}
        >
          <div
  className={`
    absolute inset-0
    ${isLight ? "bg-white/25" : "bg-black/10"}
  `}
/>

          <div className="relative z-10 flex flex-col h-full">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2
  ${isLight ? "bg-black/10" : "bg-white/20"}
`}>
              {(() => {
                const Icon =
                  walletIconMap[selectedWallet.icon] || Wallet
                  
                return <Icon size={22} className={textClass} />
              })()}
            </div>

            <div className="mt-1">
              <p className={`text-sm ${textClass} opacity-80`}>
  {selectedWallet.name}
</p>

<p className={`text-base font-semibold ${textClass}`}>
  {formatRupiah(selectedWallet.balance)}
</p>
            </div>
          </div>
        </button>
      )}
    </div>

{/* AMOUNT */}
<div
  onClick={() => {
    setActiveCalc("amount")
    setCalcMode("input")        // ✅ mode simpan
    setShowCalculator(true)
  }}
  className="
    w-full themed-card rounded-2xl p-4 mb-4
    text-left relative cursor-pointer
    active:scale-[0.99] transition
  "
>
  <p className="text-sm themed-text-muted">
    Jumlah
  </p>

  <p className="text-lg font-semibold themed-text">
    {formatRupiah(amount)}
  </p>

  {/* ✅ Tombol Kalkulator */}
  <button
    onClick={(e) => {
      e.stopPropagation()
      setCalcMode("calculate")  // ✅ hanya hitung
      setShowCalculator(true)
    }}
    className="
      absolute bottom-3 right-4
      h-11 w-11
      rounded-xl themed-card
      shadow-lg
      flex items-center justify-center
      active:scale-95 transition
    "
  >
    <Calculator size={20} className="themed-text-muted" />
  </button>
</div>

{/* ADMIN FEE (HANYA TRANSFER) */}
{categoryType === "transfer" && (
  <div
    onClick={() => {
      setActiveCalc("admin")
      setCalcMode("input")
      setShowCalculator(true)
    }}
    className="
      w-full themed-card rounded-2xl p-4 mb-4
      text-left relative cursor-pointer
      active:scale-[0.99] transition
    "
  >
    <p className="text-sm themed-text-muted">
      Biaya Admin
    </p>

    <p className="text-lg font-semibold themed-text">
      {adminFee > 0 ? formatRupiah(adminFee) : "Tidak ada"}
    </p>

    <button
      onClick={(e) => {
        e.stopPropagation()
        setActiveCalc("admin")
        setCalcMode("calculate")
        setShowCalculator(true)
      }}
      className="
        absolute bottom-3 right-4
        h-11 w-11
        rounded-xl themed-card
        shadow-lg
        flex items-center justify-center
        active:scale-95 transition
      "
    >
      <Calculator size={20} className="themed-text-muted" />
    </button>
  </div>
)}


    {/* NOTE + FOTO */}
    <div className="themed-card rounded-2xl p-4 mb-6 relative">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        className="bg-transparent outline-none w-full resize-none themed-text"
      />

      <div className="flex gap-3 mt-3 flex-wrap">
        {existingPhotos.map((photo) => (
          <div key={photo.id} className="relative">
            <img
              src={photo.data}
              onClick={() => setPreviewPhoto(photo.data)}
              className="w-24 h-24 rounded-xl object-cover"
            />

            <button
              onClick={() =>
                setExistingPhotos(prev =>
                  prev.filter(p => p.id !== photo.id)
                )
              }
              className="absolute -top-2 -right-2 bg-black/70 p-1 rounded-full"
            >
              <X size={14} className={textClass} />
            </button>
          </div>
        ))}
      </div>

      {photos.length < 2 && (
        <button
          onClick={() => fileRef.current.click()}
          className="absolute right-4 bottom-4 h-11 w-11 rounded-xl themed-card shadow-lg flex items-center justify-center active:scale-95 transition"
        >
          <Camera size={20} className="themed-text-muted" />
        </button>
      )}
    </div>

    <input
      ref={fileRef}
      type="file"
      hidden
      accept="image/*"
      multiple
      onChange={(e) => {
        addPhotos(e.target.files)
        e.target.value = ""
      }}
    />

    {/* SAVE */}
    <button
      disabled={isSaving}
      onClick={handleSave}
      className="w-full rounded-2xl py-4 font-semibold themed-card themed-text shadow-xl active:scale-95 transition"
    >
      {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
    </button>

    {/* SHEETS */}
{showCalculator && (
  <CalculatorSheet
    mode={calcMode}
    value={
      activeCalc === "amount"
        ? amount
        : adminFee
    }
    onClose={() => setShowCalculator(false)}
    onChange={(val) => {
      if (calcMode === "calculate") return  // ✅ jangan simpan

      if (activeCalc === "amount") {
  setAmount(val)
}

if (activeCalc === "admin") {
  setAdminFee(val)
}
    }}
    label={
      activeCalc === "amount"
        ? "Jumlah"
        : "Biaya admin"
    }
  />
)}

    {showCategory && (
      <CategorySheet
        type={categoryType}
        onChangeType={setCategoryType}
        onSelect={(cat) => {
          setCategory(cat)
          setCategoryType(cat.type)
          setShowCategory(false)
        }}
        onClose={() => setShowCategory(false)}
      />
    )}

    {showWalletPicker && (
      <WalletPicker
        title="Pilih Dompet"
        wallets={wallets}
        selected={
          showWalletPicker === "from"
            ? selectedWallet
            : targetWallet
        }
        onSelect={(wallet) => {
          if (showWalletPicker === "from") {
            setSelectedWallet(wallet)
          } else {
            setTargetWallet(wallet)
          }
          setShowWalletPicker(null)
        }}
        onClose={() => setShowWalletPicker(null)}
      />
    )}

    {/* PREVIEW */}
    {previewPhoto && (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex justify-between p-4">
          <p className="text-white font-semibold">
            Preview
          </p>

          <button onClick={() => setPreviewPhoto(null)}>
            <X className={textClass} />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <img
            src={previewPhoto}
            className="max-w-full max-h-full"
          />
        </div>
      </div>
    )}
  </div>
)
}