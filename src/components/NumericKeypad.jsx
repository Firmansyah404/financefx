export default function NumericKeypad({ value, onChange, onClose }) {
  const keys = ["1","2","3","4","5","6","7","8","9","0","⌫","✓"]

  const handlePress = (k) => {
    if (k === "⌫") onChange(value.slice(0, -1))
    else if (k === "✓") onClose()
    else onChange(value + k)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1d] p-4 rounded-t-3xl">
      <div className="grid grid-cols-3 gap-3">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => handlePress(k)}
            className="bg-[#2a2d36] py-4 rounded-xl text-lg font-semibold"
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}