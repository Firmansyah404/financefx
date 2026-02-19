export default function SummaryCard({ title, amount }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{amount}</p>
    </div>
  )
}