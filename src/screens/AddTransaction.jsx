import { useNavigate } from "react-router-dom"
import {
  Camera,
  ArrowLeft,
  X,
  Wallet,
  Landmark,
  CreditCard,
  Banknote,
  Calculator,
} from "lucide-react"
import { useRef, useState, useEffect } from "react"
import CategorySheet from "../components/CategorySheet"
import CalculatorSheet from "../components/CalculatorSheet"
import WalletPicker from "../components/WalletPicker"
import { formatRupiah } from "../utils/formatRupiah"
import { savePhoto, deletePhoto } from "../utils/photoDB"

const getToday = () => new Date().toISOString().split("T")[0]

const getCurrentTime = () => {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`
}

const formatDate = (value) =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

export default function AddTransaction() {
  const navigate = useNavigate()
  const wallets = JSON.parse(localStorage.getItem("wallets") || "[]")

  const [date, setDate] = useState(getToday())
  const [time, setTime] = useState(getCurrentTime())

  const [name, setName] = useState("")
  const [categoryType, setCategoryType] = useState("expense")
  const [category, setCategory] = useState(null)
  const [showCategory, setShowCategory] = useState(false)

const [adminFee, setAdminFee] = useState(0)
  const [amount, setAmount] = useState(0)
  const [showCalculator, setShowCalculator] = useState(false)
  const [activeCalc, setActiveCalc] = useState("amount")
  const [calcMode, setCalcMode] = useState("input")
// "input" | "calculate"

  const [note, setNote] = useState("")
  const [photos, setPhotos] = useState([])
  const [previewPhoto, setPreviewPhoto] = useState(null)


const [selectedWallet, setSelectedWallet] = useState(
  wallets[0] || null
)
  const [showWalletPicker, setShowWalletPicker] = useState(false)
  const [targetWallet, setTargetWallet] = useState(null)
const [showTargetPicker, setShowTargetPicker] = useState(false)

const isValid =
  category &&
  amount > 0 &&
  selectedWallet &&
  (
    categoryType !== "transfer" ||
    (
      targetWallet &&
      selectedWallet.id !== targetWallet.id
    )
  )

  const dateRef = useRef(null)
  const timeRef = useRef(null)
  const fileRef = useRef(null)

  const walletIconMap = {
    wallet: Wallet,
    bank: Landmark,
    cash: Banknote,
    card: CreditCard,
  }
  
  useEffect(() => {
  if (categoryType !== "transfer") {
    setTargetWallet(null)
  }
}, [categoryType])

  
  const categoryTypeStyle = {
  expense: "bg-rose-500/20 text-rose-400",
  income: "bg-emerald-500/20 text-emerald-400",
}

  useEffect(() => {
    setDate(getToday())
    setTime(getCurrentTime())
  }, [])
  

  const handleSave = () => {
  if (!category || amount <= 0 || !selectedWallet) {
    alert("Lengkapi data dulu")
    return
  }
  
  if (categoryType === "transfer") {
    if (!selectedWallet || !targetWallet) {
      alert("Pilih dompet asal & tujuan!")
      return
    }

    if (selectedWallet.id === targetWallet.id) {
      alert("Dompet tidak boleh sama!")
      return
    }
  }

  const newTransaction = {
  id: Date.now(),
  name: name || "Transaksi Saya",
  type: categoryType,
  category: category.name,
  amount,
  walletId: selectedWallet.id,
  targetWalletId:
  categoryType === "transfer"
    ? targetWallet?.id
    : null,
  date,
  time,
  note,

  // âœ… SIMPAN HANYA ID FOTO
  photoIds: photos.map(p => p.id),

  adminFee: categoryType === "transfer" ? adminFee : 0,
}

  const transactions =
    JSON.parse(localStorage.getItem("transactions")) || []

  localStorage.setItem(
    "transactions",
    JSON.stringify([newTransaction, ...transactions])
  )

  // âœ… UPDATE SALDO WALLET
  const updatedWallets = wallets.map((wallet) => {
  if (categoryType !== "transfer") {
    if (wallet.id !== selectedWallet.id)
      return wallet

    return {
      ...wallet,
      balance:
        categoryType === "income"
          ? wallet.balance + amount
          : wallet.balance - amount,
    }
  }

  // âœ… LOGIC TRANSFER
  if (wallet.id === selectedWallet.id) {
    return {
      ...wallet,
      balance:
        wallet.balance - amount - adminFee,
    }
  }

  if (wallet.id === targetWallet?.id) {
    return {
      ...wallet,
      balance: wallet.balance + amount,
    }
  }

  return wallet
})

  localStorage.setItem("wallets", JSON.stringify(updatedWallets))

  navigate("/home", { state: { success: true } })
}

  // âœ… FIX MULTIPLE FOTO + MAX 2
  const handleAddPhoto = async (e) => {
    const files = Array.from(e.target.files)

    const availableSlots = 2 - photos.length
    const selectedFiles = files.slice(0, availableSlots)

    if (!selectedFiles.length) return

    try {
      const savedPhotos = await Promise.all(
        selectedFiles.map((file) => savePhoto(file))
      )

      setPhotos((prev) => [...prev, ...savedPhotos])
    } catch (err) {
      console.error(err)
      alert("Gagal menyimpan foto")
    }

    e.target.value = null
  }

  const handleRemovePhoto = async (id) => {
    await deletePhoto(id)
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  const WalletCard = ({ wallet, onClick, size = "normal" }) => {
  if (!wallet) return null

  const Icon = walletIconMap[wallet.icon] || Wallet
  
  const isGradient = wallet.color?.startsWith("linear-gradient")
const isLight = isLightColor(wallet.color)

const textClass =
  isGradient
    ? "text-white"
    : isLight
    ? "text-slate-800"
    : "text-white"
  
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
  
  return (
  <button
    onClick={onClick}
    className={`
      rounded-3xl p-4 text-left relative overflow-hidden
      transition-all duration-150
      active:scale-95 active:brightness-110 active:shadow-inner
      ${size === "compact" ? "w-40 h-33" : "w-full h-33"}
    `}
    style={{ background: wallet.color }}
  >
    <div
  className={`
    absolute inset-0 pointer-events-none
    ${isLight ? "bg-white/25" : "bg-black/10"}
  `}
/>

    <div className="relative z-10 flex flex-col h-full">
      {/* ICON */}
      <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center mb-2">
        <Icon size={22} className={textClass} />
      </div>

      {/* TEXT */}
      <div className="mt-1">
<p className={`text-sm ${textClass} opacity-80`}>
  {wallet.name}
</p>

<p className={`text-base font-semibold ${textClass}`}>
  {formatRupiah(wallet.balance)}
</p>
      </div>
    </div>
  </button>
)
}

  return (
  <div className="min-h-screen themed-page p-4 pb-40">

    {/* HEADER */}
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full themed-card flex items-center justify-center"
      >
        <ArrowLeft size={20} className="themed-text" />
      </button>

      <h1 className="text-xl font-semibold themed-text">
        Tambah Transaksi
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
          {formatDate(date)}
        </p>
      </button>

      <button
        onClick={() => timeRef.current?.showPicker()}
        className="flex-1 themed-card rounded-2xl p-4 text-left"
      >
        <p className="text-sm themed-text-muted">Waktu</p>
        <p className="font-semibold themed-text">
          {time}
        </p>
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
        className="bg-transparent outline-none w-full themed-text"
      />
    </div>

    {/* CATEGORY */}
    <button
      onClick={() => setShowCategory(true)}
      className="w-full themed-card rounded-2xl p-4 mb-4 text-left"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm themed-text-muted">
            Kategori
          </p>

          <p className="font-semibold themed-text">
            {category ? category.name : "Pilih kategori"}
          </p>
        </div>

        {category && categoryType !== "transfer" && (
          <span
            className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${
                categoryType === "expense"
                  ? "bg-rose-500/20 text-rose-400"
                  : "bg-emerald-500/20 text-emerald-400"
              }
            `}
          >
            {categoryType === "expense"
              ? "Pengeluaran"
              : "Pemasukan"}
          </span>
        )}
      </div>
    </button>

    {/* WALLET */}
    <div className="mb-4">

      <p className="text-sm themed-text-muted mb-2">
        {categoryType === "transfer" ? "Transfer" : "Dompet"}
      </p>

      {/* TRANSFER UI */}
      {categoryType === "transfer" && (
        <div className="mb-4">
          <div className="flex items-center gap-3 relative">

            {/* SOURCE */}
            <div className="flex-1 flex flex-col">
              <p className="text-xs themed-text-muted mb-1">
                Dari
              </p>

              {selectedWallet ? (
                <WalletCard
                  wallet={selectedWallet}
                  onClick={() => setShowWalletPicker(true)}
                />
              ) : (
                <button
                  onClick={() => setShowWalletPicker(true)}
                  className="themed-card rounded-2xl px-4 py-3 w-[170px] inline-flex items-center justify-center gap-2"
                >
                  <Plus size={18} className="themed-text-muted" />
                  <span className="text-sm themed-text-muted">
                    Pilih Dompet
                  </span>
                </button>
              )}
            </div>

            {/* PANAH */}
            <div className="pt-5">
              <div className="w-10 h-10 rounded-full themed-card flex items-center justify-center shadow-lg">
                <span className="text-lg themed-text-muted">
                  ➝
                </span>
              </div>
            </div>

            {/* TARGET */}
            <div className="flex-1 flex flex-col">
              <p className="text-xs themed-text-muted mb-1">
                Ke
              </p>

              {targetWallet ? (
                <WalletCard
                  wallet={targetWallet}
                  onClick={() => setShowTargetPicker(true)}
                />
              ) : (
                <button
                  onClick={() => setShowTargetPicker(true)}
                  className="w-full h-33 rounded-3xl themed-card p-4 text-left relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black/5" />

                  <div className="relative z-10 flex flex-col h-full">

                    <div className="w-11 h-11 rounded-2xl bg-black/10 mb-2" />

                    <div className="mt-1">
                      <p className="text-sm themed-text-muted">
                        Dompet tujuan
                      </p>

                      <p className="text-base font-semibold themed-text-muted">
                        Rp -
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NON TRANSFER */}
      {categoryType !== "transfer" && (
        <>
          {selectedWallet ? (
            <WalletCard
              wallet={selectedWallet}
              onClick={() => setShowWalletPicker(true)}
              size="compact"
            />
          ) : (
            <button
              onClick={() => setShowWalletPicker(true)}
              className="themed-card rounded-2xl px-5 py-4 mb-3 w-[190px] inline-flex items-center justify-center gap-2 text-sm"
            >
              <Plus size={18} className="themed-text-muted" />
              <span className="themed-text-muted">
                Pilih Dompet
              </span>
            </button>
          )}
        </>
      )}
    </div>

    {/* AMOUNT */}
    <div
      onClick={() => {
        setActiveCalc("amount")
        setCalcMode("input")
        setShowCalculator(true)
      }}
      className="w-full themed-card rounded-2xl p-4 mb-4 text-left relative cursor-pointer active:scale-[0.99] transition"
    >
      <p className="text-sm themed-text-muted">
        Jumlah
      </p>

      <p className="text-lg font-semibold themed-text">
        {formatRupiah(amount)}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation()
          setCalcMode("calculate")
          setShowCalculator(true)
        }}
        className="absolute bottom-3 right-4 h-11 w-11 rounded-xl themed-card flex items-center justify-center shadow-lg"
      >
        <Calculator size={20} className="themed-text-muted" />
      </button>
    </div>

    {/* ADMIN */}
    {categoryType === "transfer" && (
      <button
        onClick={() => {
          setActiveCalc("admin")
          setCalcMode("input")
          setShowCalculator(true)
        }}
        className="w-full themed-card rounded-2xl p-4 mb-4 text-left"
      >
        <p className="text-sm themed-text-muted">
          Biaya admin
        </p>

        <p className="text-lg font-semibold themed-text">
          {formatRupiah(adminFee)}
        </p>
      </button>
    )}

    {/* NOTE + FOTO */}
    <div className="themed-card rounded-2xl p-4 mb-4">
      <div className="flex justify-between items-start">

        <div className="flex-1">
          <p className="text-sm themed-text-muted">
            Catatan
          </p>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Tambahkan catatan..."
            className="bg-transparent outline-none w-full resize-none themed-text"
          />
        </div>

        <button
          onClick={() => fileRef.current?.click()}
          className="h-11 w-11 rounded-xl themed-card flex items-center justify-center"
        >
          <Camera size={20} className="themed-text-muted" />
        </button>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative">
              <img
                src={photo.data}
                alt=""
                className="w-full aspect-square object-cover rounded-xl"
                onClick={() => setPreviewPhoto(photo.data)}
              />

              <button
                onClick={() => handleRemovePhoto(photo.id)}
                className="absolute top-2 right-2 bg-black/80 rounded-full p-1"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    <input
      ref={fileRef}
      type="file"
      hidden
      accept="image/*"
      multiple
      onChange={handleAddPhoto}
    />

    {/* SAVE */}
<button
  onClick={handleSave}
  disabled={!isValid}
  className={`
    w-full rounded-2xl py-4 font-semibold shadow-xl transition-all
    ${
      isValid
        ? "bg-indigo-500 text-white active:scale-95"
        : "themed-card themed-text-muted opacity-50"
    }
  `}
>
  Simpan
</button>

    {/* SHEETS */}
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

    {showCalculator && (
      <CalculatorSheet
        mode={calcMode}
        value={activeCalc === "amount" ? amount : adminFee}
        onClose={() => setShowCalculator(false)}
        onChange={(val) => {
          if (calcMode === "calculate") return
          if (activeCalc === "amount") {
            setAmount(val)
          } else {
            setAdminFee(val)
          }
        }}
        label={activeCalc === "amount" ? "Jumlah" : "Biaya admin"}
      />
    )}

    {showWalletPicker && (
      <WalletPicker
        title="Pilih Dompet"
        wallets={wallets}
        selected={selectedWallet}
        onSelect={(wallet) => {
          setSelectedWallet(wallet)
          setShowWalletPicker(false)
        }}
        onClose={() => setShowWalletPicker(false)}
      />
    )}

    {showTargetPicker && (
      <WalletPicker
        title="Pilih Dompet Tujuan"
        wallets={wallets.filter(w => w.id !== selectedWallet?.id)}
        selected={targetWallet}
        onSelect={(wallet) => {
          setTargetWallet(wallet)
          setShowTargetPicker(false)
        }}
        onClose={() => setShowTargetPicker(false)}
      />
    )}

    {/* PREVIEW FOTO */}
    {previewPhoto && (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <button
          onClick={() => setPreviewPhoto(null)}
          className="absolute top-6 right-6 themed-card p-2 rounded-full"
        >
          <X size={20} className="themed-text" />
        </button>

        <img
          src={previewPhoto}
          alt=""
          className="max-w-[90%] max-h-[80%] rounded-2xl"
        />
      </div>
    )}
  </div>
)
}