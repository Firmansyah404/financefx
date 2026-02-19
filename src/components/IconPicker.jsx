import {
  Wallet,
  Landmark,
  Banknote,
  CreditCard,
  TrendingUp,
  Coins,
  X,
} from "lucide-react"

const icons = {
  wallet: Wallet,
  bank: Landmark,
  cash: Banknote,
  card: CreditCard,
  invest: TrendingUp,
  coins: Coins,
}

export default function IconPicker({ selected, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
      <div className="bg-zinc-900 w-full rounded-t-3xl p-5">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Pilih Ikon</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {Object.entries(icons).map(([key, Icon]) => (
            <button
              key={key}
              onClick={() => {
                onSelect(key)
                onClose()
              }}
              className={`p-4 rounded-2xl flex justify-center items-center ${
                selected === key
                  ? "bg-indigo-600"
                  : "bg-zinc-800"
              }`}
            >
              <Icon size={26} />
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}