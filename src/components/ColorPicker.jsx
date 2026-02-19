export default function ColorPicker({ selected, onSelect }) {
  const colors = [
    "#4f46e5",
    "#6d28d9",
    "#be185d",
    "#b91c1c",
    "#c2410c",
    "#ca8a04",
    "#16a34a",
  ]

  return (
    <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onSelect(color)}
          className={`w-12 h-12 rounded-full shrink-0 ${
            selected === color
              ? "ring-4 ring-white"
              : "opacity-80"
          }`}
          style={{ background: color }}
        />
      ))}
    </div>
  )
}