export default function CashFlowCard() {
  return (
    <section className="mx-4 mt-4 bg-[#6f6bb2] rounded-2xl p-5 text-white">
      <div className="flex justify-between items-center">
        <p className="opacity-90">Cash Flow</p>
        <span className="text-xl">›</span>
      </div>

      <p className="text-3xl font-bold mt-2">Rp0</p>

      <div className="flex justify-between mt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-200 text-pink-600 rounded-lg grid place-items-center">
            📉
          </div>
          <div>
            <p className="text-sm opacity-80">Expenses</p>
            <p className="font-semibold">Rp0</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-200 text-green-600 rounded-lg grid place-items-center">
            📈
          </div>
          <div>
            <p className="text-sm opacity-80">Income</p>
            <p className="font-semibold">Rp0</p>
          </div>
        </div>
      </div>
    </section>
  )
}