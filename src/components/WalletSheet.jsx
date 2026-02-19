import { X } from "lucide-react"
import { formatRupiah } from "../utils/formatRupiah"

export default function WalletSheet({ wallets, selected, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
      <div className="w-full bg-zinc-900 rounded-t-3xl p-4">
        {/* HANDLE */}
        <div className="w-10 h-1 bg-zinc-600 rounded mx-auto mb-4" />

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Pilih Dompet</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* WALLET LIST */}
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => onSelect(wallet)}
              className={`w-full text-left rounded-2xl p-4 transition
                ${
                  selected?.id === wallet.id
                    ? "ring-2 ring-indigo-500"
                    : ""
                }
              `}
              style={{ background: wallet.color }}
            >
              <p className="opacity-90">{wallet.name}</p>
              <p className="font-bold">
                {formatRupiah(wallet.balance)}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}