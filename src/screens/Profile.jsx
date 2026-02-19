export default function Profile() {
  return (
    <div className="min-h-screen bg-black text-white p-4 pb-28">
      
      {/* TITLE */}
      <h1 className="text-2xl font-semibold mb-6">
        Profil Saya
      </h1>

      {/* KARTU & DOMPET */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">Kartu & Dompet</h2>
        <button className="text-sm px-4 py-1 border border-zinc-600 rounded-full">
          Lihat semua
        </button>
      </div>

      {/* WALLET CARD */}
      <div
        className="rounded-3xl p-5 mb-8"
        style={{
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        }}
      >
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
          💵
        </div>

        <p className="text-sm opacity-80">Kas</p>
        <p className="text-xl font-bold mt-1">
          Rp100.000,00
        </p>
      </div>

      {/* TUJUAN */}
      <h2 className="font-semibold text-lg mb-3">Tujuan</h2>

      <div className="border border-dashed border-zinc-600 rounded-3xl p-6 text-center mb-8">
        <div className="text-5xl mb-3">🎯</div>
        <p className="text-zinc-400 mb-4">
          Anda belum menambahkan tujuan.
        </p>

        <button className="px-5 py-2 bg-zinc-700 rounded-full">
          + Tambah Tujuan
        </button>
      </div>

      {/* UTANG */}
      <h2 className="font-semibold text-lg mb-3">Utang</h2>

      <div className="border border-dashed border-zinc-600 rounded-3xl p-6 text-center">
        <div className="text-5xl mb-3">💳</div>
        <p className="text-zinc-400 mb-4">
          Anda belum menambahkan utang.
        </p>

        <button className="px-5 py-2 bg-zinc-700 rounded-full">
          + Tambah Utang
        </button>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 h-20 flex justify-around items-center">
        <span>🏠</span>
        <span>📄</span>
        <div className="w-14 h-14 bg-zinc-700 rounded-2xl flex items-center justify-center text-xl">
          +
        </div>
        <span>📊</span>
        <span className="text-blue-400">👤</span>
      </div>
    </div>
  )
}