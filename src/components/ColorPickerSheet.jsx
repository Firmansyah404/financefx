import { X } from "lucide-react"

export default function ColorPickerSheet({
  selected,
  onSelect,
  onClose,
}) {
  const sections = {
    Default: [
      "#4f46e5",
      "#22c55e",
      "#f59e0b",
      "#ef4444",
      "#0ea5e9",
      "#a855f7",
      "#14b8a6",
    "#f97316",
    "#eab308",
    "#10b981",
    "#6366f1",
    "#ec4899",
    "#84cc16",
    "#06b6d4",
    "#8b5cf6",
    "#f43f5e",
    "#0f172a",
    "#1d4ed8",
    "#047857",
    "#b91c1c",
    ],

    Pastel: [
  "#DFFBFF",
  "#E1F8FF",
  "#E3DCFF",
  "#E6D5FF",
  "#FFD7F5",

  "#EDEDF3",
  "#D5D1F5",
  "#DECCE5",
  "#E9D5F3",
  "#F8E7F8",

  "#9381FF",
  "#B8B8FF",
  "#F8F7FF",
  "#DFF8FF",
  "#BEFFD8",

  "#F1FFDB",
  "#E5FFCF",
  "#D7FBCF",
  "#DFF0CF",
  "#BFEFFF",

  "#F9FFCF",
  "#FAFDF4",
  "#FFF4D1",
  "#EFEFEF",
  "#D6ECFF",

  "#FFEDDB",
  "#FFEDE1",
  "#F1ECCF",
  "#EBECEC",
  "#E1FAFF",

  "#FDF4E4",
  "#F8F2E0",
  "#ECE1D6",
  "#FFEBD1",
  "#F3E0DC",

  "#D6E3CC",
  "#F7FBD0",
  "#FCF0AF",
  "#FCE4A8",
  "#E6C897",

  "#FFB3DA",
  "#FFF6BD",
  "#D9FFD6",
  "#C9EAFF",
  "#EBD6FF",

  "#B0F1EF",
  "#FFD6E0",
  "#FFF0AF",
  "#C1FBA4",
  "#7BF1A8"
],

    Gradient: [
      "linear-gradient(135deg, #FF6CAB, #7366FF)",
      "linear-gradient(135deg, #B65EBA, #2E8DE1)",
      "linear-gradient(135deg, #64E8DE, #8A64EB)",
      "linear-gradient(135deg, #7BF2E9, #B65EBA)",
      "linear-gradient(135deg, #FF9482, #7D77FF)",
      "linear-gradient(135deg, #FFC71B, #FF8B1B)",
      "linear-gradient(135deg, #FFA62E, #EA4D2C)",
      "linear-gradient(135deg, #00FFED, #00B8BA)",
      "linear-gradient(135deg, #6EE2F5, #6454F0)",
      "linear-gradient(135deg, #3499FF, #3A3985)",
      "linear-gradient(135deg, #FF9897, #F650A0)",
      "linear-gradient(135deg, #FFCDA5, #EE4D5F)",
      "linear-gradient(135deg, #FF5B94, #8441A4)",
      "linear-gradient(135deg, #F869D5, #5650DE)",
      "linear-gradient(135deg, #F00051, #7366FF)",
    ],
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-end">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* SHEET */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full themed-card rounded-t-3xl p-4 max-h-[75vh] overflow-y-auto"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold themed-text">
            Pilih Warna
          </h2>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* SECTIONS */}
        {Object.entries(sections).map(([title, colors]) => (
          <div key={title} className="mb-5">
            <p className="text-sm themed-text-muted mb-2">
              {title}
            </p>

            <div className="grid grid-cols-5 gap-3">
              {colors.map((c) => {
                const isGradient = c.startsWith("linear-gradient")

                const isActive = selected === c

                return (
                  <button
                    key={c}
                    onClick={() => onSelect(c)}
                    className={`h-12 rounded-xl border-2 transition ${
                      isActive
                        ? "border-indigo-500 scale-105"
                        : "border-transparent"
                    }`}
                    style={{
                      background: c,
                    }}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}