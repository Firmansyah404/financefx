import { useNavigate } from "react-router-dom"
import { formatRupiah } from "../utils/formatRupiah"
import { useLocation } from "react-router-dom"
import { useState, useEffect, useMemo, useCallback } from "react"
import { CheckCircle2 } from "lucide-react"
import Cropper from "react-easy-crop"

export default function Home() {
  const navigate = useNavigate()

  const username = useMemo(() => {
  return localStorage.getItem("username") || "Pengguna"
}, [])


const [transactions, setTransactions] = useState([])
const [wallets, setWallets] = useState([])

useEffect(() => {
  const loadData = () => {
    const trx = JSON.parse(localStorage.getItem("transactions")) || []
    const wlt = JSON.parse(localStorage.getItem("wallets")) || []

    setTransactions(prev => {
      if (JSON.stringify(prev) === JSON.stringify(trx)) return prev
      return trx
    })

    setWallets(prev => {
      if (JSON.stringify(prev) === JSON.stringify(wlt)) return prev
      return wlt
    })
  }

  loadData()

  window.addEventListener("transactionsUpdated", loadData)

  return () => {
    window.removeEventListener("transactionsUpdated", loadData)
  }
}, [])

const getGreeting = () => {
  const hour = new Date().getHours()

  if (hour >= 4 && hour < 11) return "Selamat pagi"
  if (hour >= 11 && hour < 15) return "Selamat siang"
  if (hour >= 15 && hour < 18) return "Selamat sore"

  return "Selamat malam"
}

const [greeting, setGreeting] = useState(getGreeting())

useEffect(() => {
  const updateGreeting = () => setGreeting(getGreeting())

 updateGreeting()
 document.addEventListener("visibilitychange", updateGreeting)

  return () => {
     document.removeEventListener("visibilitychange", updateGreeting)
  }
}, [])

const [profilePhoto, setProfilePhoto] = useState(
  localStorage.getItem("profilePhoto") || null
)

const [rawPhoto, setRawPhoto] = useState(null)
const [showCrop, setShowCrop] = useState(false)

const [crop, setCrop] = useState({ x: 0, y: 0 })
const [zoom, setZoom] = useState(1)
const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)


const onCropComplete = (_, croppedPixels) => {
  setCroppedAreaPixels(croppedPixels)
}

const getCroppedImg = (imageSrc, cropPixels) => {
  return new Promise((resolve) => {
    const image = new Image()
    image.src = imageSrc

    image.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      canvas.width = cropPixels.width
      canvas.height = cropPixels.height

      ctx.drawImage(
        image,
        cropPixels.x,
        cropPixels.y,
        cropPixels.width,
        cropPixels.height,
        0,
        0,
        cropPixels.width,
        cropPixels.height
      )

      resolve(canvas.toDataURL("image/jpeg"))
    }
  })
}

const handleSaveCrop = async () => {
  if (!rawPhoto || !croppedAreaPixels) return

  const croppedImage = await getCroppedImg(
    rawPhoto,
    croppedAreaPixels
  )

  setProfilePhoto(croppedImage)
  localStorage.setItem("profilePhoto", croppedImage)

  setShowCrop(false)
  setRawPhoto(null)
}

const handlePickPhoto = (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    setRawPhoto(reader.result)   // ✅ kirim ke cropper
    setShowCrop(true)            // ✅ tampilkan modal crop
  }

  reader.readAsDataURL(file)
}

  // ✅ DOMPET AKTIF
  const activeWallet = useMemo(() => {
  const activeWalletId = Number(localStorage.getItem("activeWalletId"))
  return wallets.find(w => w.id === activeWalletId)
}, [wallets])
  
  const getWalletById = useCallback(
  (walletId) => wallets.find(w => w.id === walletId),
  [wallets]
)

  const sortedTransactions = useMemo(() => {
  return [...transactions].sort(
    (a, b) =>
      new Date(`${b.date} ${b.time}`) -
      new Date(`${a.date} ${a.time}`)
  )
}, [transactions])

const [showToast, setShowToast] = useState(false)
const [toastMessage, setToastMessage] = useState("")


const location = useLocation()
const [showSuccess, setShowSuccess] = useState(false)
useEffect(() => {
  if (location.state?.success) {
    setShowSuccess(true)
    
    window.history.replaceState({}, document.title)

    const timer = setTimeout(() => {
  setShowSuccess(false)
}, 3000)

    return () => clearTimeout(timer)
  }
}, [location.state])

useEffect(() => {
  if (location.state?.toast === "deleted") {
    setToastMessage("Transaksi berhasil dihapus")
    setShowToast(true)

    window.history.replaceState({}, document.title)

    const timer = setTimeout(() => {
      setShowToast(false)
    }, 3000)

    return () => clearTimeout(timer)
  }
}, [location.state])


  const income = useMemo(() => {
  return transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)
}, [transactions])

const expense = useMemo(() => {
  return transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)
}, [transactions])

  const totalSaldo = useMemo(() => {
  return wallets
    .filter((w) => w.includeInTotal ?? true)
    .reduce((sum, w) => sum + (w.balance || 0), 0)
}, [wallets])

  const groupedTransactions = useMemo(() => {
  return sortedTransactions.reduce((acc, t) => {
    const dateKey = new Date(t.date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(t)
    return acc
  }, {})
}, [sortedTransactions])

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
    <div className="min-h-[100dvh] themed-page flex flex-col">
       
{showCrop && rawPhoto && (
  <div className="
    fixed inset-0
    z-[999]
    bg-black
    flex flex-col
  ">

    {/* AREA CROPPER */}
    <div className="relative flex-1">
      <Cropper
        image={rawPhoto}
        crop={crop}
        zoom={zoom}
        aspect={1}
        objectFit="contain"
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
    </div>

    {/* CONTROL PANEL */}
    <div className="
      p-4
      bg-black/80
      backdrop-blur-md
      flex flex-col gap-4
    ">
      <input
        type="range"
        min={1}
        max={3}
        step={0.1}
        value={zoom}
        onChange={(e) => setZoom(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={() => {
            setShowCrop(false)
            setRawPhoto(null)
          }}
          className="
            flex-1 py-3
            rounded-xl
            bg-white/10
            text-white
          "
        >
          Batal
        </button>

        <button
          onClick={handleSaveCrop}
          className="
            flex-1 py-3
            rounded-xl
            btn-primary
          "
        >
          Simpan
        </button>
      </div>
    </div>

  </div>
)}
       
       {/* ✅ TOAST SUCCESS */}
{showSuccess && (
  <div
    className="
      fixed
      themed-toast
      top-6
      left-1/2
      -translate-x-1/2
      px-6
      h-12
      rounded-full
      shadow-2xl
      flex items-center
      gap-3
      text-sm
      font-medium
      animate-toast
      z-50
      whitespace-nowrap
    "
  >
    <CheckCircle2
      size={20}
      className="text-emerald-400 shrink-0"
    />

    <span className="leading-none">
      Transaksi berhasil disimpan
    </span>
  </div>
)}

      {/* ===== STATIC HEADER ===== */}
      <div className="p-4 pb-3 shrink-0 sticky top-0 themed-header z-50">
<div className="flex items-center justify-between mb-5">
  
  {/* KIRI → Greeting */}
  <div>
    <p className="text-lg themed-text-muted">
      {greeting}
    </p>

    <p className="text-2xl font-semibold themed-text leading-tight">
      {username}
    </p>
  </div>

  {/* KANAN → Profile Photo */}
  <label className="cursor-pointer">
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handlePickPhoto}
    />

    <div className="
      w-12 h-12 rounded-full
      themed-card
      overflow-hidden
      flex items-center justify-center
      active:scale-90 transition
    ">
      {profilePhoto ? (
        <img
          src={profilePhoto}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="
          w-full h-full
          bg-gradient-to-br from-indigo-400 to-indigo-600
          flex items-center justify-center
          text-white font-semibold text-lg
        ">
          {username.charAt(0)}
        </div>
      )}
    </div>
  </label>
</div>

        {/* SUMMARY */}
        <div className="themed-card rounded-2xl p-6 text-center">
          <p className="text-sm themed-text-soft mb-2">
            Total Saldo
          </p>
          <p className="text-2xl font-bold mb-4">
            {formatRupiah(totalSaldo)}
          </p>

          <div className="flex gap-3">
            <div className="flex-1 themed-card rounded-2xl p-3">
              <p className="text-xs themed-text-soft">
                Pemasukan
              </p>
              <p className="font-semibold text-emerald-400">
                {formatRupiah(income)}
              </p>
            </div>

            <div className="flex-1 themed-card rounded-2xl p-3">
              <p className="text-xs themed-text-soft">
                Pengeluaran
              </p>
              <p className="font-semibold text-rose-400">
                {formatRupiah(expense)}
              </p>
            </div>
          </div>
        </div>

        {/* TRANSAKSI HEADER */}
        <div className="flex justify-between items-center mt-6 mb-3">
          <h2 className="font-semibold text-lg themed-text">
            Transaksi Terbaru
          </h2>
         <button
  onClick={() => navigate("/transactions")}
  className="px-4 py-2 rounded-full themed-card text-sm active:scale-95 transition"
>
  Lihat semua
</button>
        </div>
      </div>

{/* ===== SCROLLABLE TRANSACTION LIST ===== */}
<div className="flex-1 overflow-y-auto px-4 pb-32">

  {sortedTransactions.length === 0 ? (
<div className="
  themed-card rounded-2xl p-5
  text-center themed-text-muted
">
  Anda belum menambahkan transaksi
</div>
  ) : (
    Object.entries(groupedTransactions).map(([date, items]) => (
      <div key={date} className="mb-6">

        {/* ✅ STICKY DATE */}
        <div className="sticky top-0 z-30 themed-page pb-2">
          <div className="inline-block themed-card text-sm px-4 py-1 rounded-full shadow-sm">
            {date}
          </div>
        </div>

        {/* WALLET BADGE */}
        <div className="flex items-center gap-2 mb-3">
          {activeWallet && (
            <div
              className="px-3 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap"
              style={{ background: activeWallet.color }}
            >
              {activeWallet.name}
            </div>
          )}
        </div>

        {/* ITEMS */}
        <div className="space-y-3">
          {items.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(`/transaction/${t.id}`)}
              className="w-full text-left themed-card rounded-2xl p-4 flex justify-between items-center active:scale-[0.99] transition-all duration-300 animate-fade-in"
            >
              <div>
                <p className="font-medium">
                  {t.name || "Transaksi"}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm themed-text-muted">
                    {t.category}
                  </p>

                  {(() => {
                    const wallet = getWalletById(t.walletId)
                    if (!wallet) return null

                    const isGradient = wallet.color?.startsWith("linear-gradient")
                    const isLight = isLightColor(wallet.color)

                    const textClass =
                      isGradient
                        ? "text-white"
                        : isLight
                        ? "text-slate-800"
                        : "text-white"

                    return (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${textClass}`}
                        style={{
                          backgroundColor: !isGradient ? wallet.color : undefined,
                          backgroundImage: isGradient ? wallet.color : undefined,
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

                {/* ✅ KHUSUS TRANSFER */}
                {t.type === "transfer" && (
                  <p className="text-xs text-rose-400 mb-1">
                    Biaya admin{" "}
                    {Number(t.adminFee) > 0
                      ? `(${formatRupiah(t.adminFee)})`
                      : "(Gratis)"}
                  </p>
                )}

                <p className="text-sm themed-text-muted">
                  {t.time}
                </p>
              </div>
            </button>
          ))}
        </div>

      </div>
    ))
  )}
</div>

{/* ✅ TOAST */}
{showToast && (
  <div className="
    fixed top-4 left-1/2 -translate-x-1/2 z-50
    min-w-[300px]
    px-6 py-4
    rounded-full
    themed-toast
    flex items-center gap-3
    text-sm
    shadow-2xl
    animate-toast
  ">
    <CheckCircle2 className="text-emerald-400" size={22} />
    <span className="font-medium">
      {toastMessage}
    </span>
  </div>
)}
    </div>
  )
}