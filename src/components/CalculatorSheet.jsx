import { useState, useEffect } from "react"

export default function CalculatorSheet({
  value = 0,
  onChange,
  onClose,
  label = "Jumlah",
  mode = "input",
}) {
  const [display, setDisplay] = useState("")
  const [expression, setExpression] = useState("")

  // ===== FORMAT ANGKA =====
  const formatNumber = (val) => {
    if (val === "") return "0"

    const cleaned = String(val).replace(/\./g, "")
    if (!/^\d+$/.test(cleaned)) return val

    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const formatExpression = (exp) => {
    const parts = exp.split(/([+\-*/])/)

    return parts
      .map((part) => {
        if (/^[+\-*/]$/.test(part)) return part
        if (part === "") return ""

        const cleaned = part.replace(/\./g, "")
        if (!/^\d+$/.test(cleaned)) return part

        return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      })
      .join("")
  }

  // ===== SYNC DARI PARENT =====
  useEffect(() => {
    if (value === 0) {
      setDisplay("")
      setExpression("")
    } else {
      setDisplay(formatExpression(String(value)))
      setExpression(String(value))
    }
  }, [value])

  // ===== INPUT ANGKA =====
  const inputNumber = (num) => {
    setExpression((prevExp) => {
      if (prevExp === "" && num === 0) return prevExp

      const newExp = prevExp + num
      setDisplay(formatExpression(newExp))

      return newExp
    })
  }

  // ===== INPUT TITIK =====
  const inputDot = () => {
    setDisplay((prev) => {
      const parts = prev.split(/([+\-×÷])/)
      let last = parts.pop() ?? ""

      if (last.includes(".")) return prev
      return [...parts, last + "."].join("")
    })

    setExpression((prev) => {
      const parts = prev.split(/([+\-*/])/)
      let last = parts.pop() ?? ""

      if (last.includes(".")) return prev
      return [...parts, last + "."].join("")
    })
  }

  // ===== CLEAR =====
  const clearAll = () => {
    setDisplay("")
    setExpression("")
  }

  // ===== DELETE =====
  const deleteLast = () => {
    setExpression((prev) => {
      const newExp = prev.slice(0, -1)
      setDisplay(formatExpression(newExp))
      return newExp
    })
  }

  // ===== OPERATOR =====
  const inputOperator = (symbol, real) => {
    setExpression((prev) => {
      if (!prev) return prev
      if (/[+\-*/]$/.test(prev)) return prev

      const newExp = prev + real
      setDisplay(formatExpression(newExp))
      return newExp
    })
  }

  // ===== EVALUATE =====
  const evaluate = () => {
    try {
      const result = eval(expression)
      if (isNaN(result)) return

      const newExp = String(result)
      setExpression(newExp)
      setDisplay(formatExpression(newExp))
    } catch {}
  }

  // ===== CONFIRM =====
  const confirm = () => {
    if (mode === "calculate") {
      onClose()
      return
    }

    const cleaned = expression.replace(/\./g, "")
    const num = Number(cleaned)

    if (onChange) {
      onChange(isNaN(num) ? 0 : num)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-end">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* SHEET */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-full
          themed-card rounded-t-3xl
          px-4 pt-4
          pb-[calc(env(safe-area-inset-bottom)+24px)]
        "
      >
        {/* HANDLE */}
        <div className="w-10 h-1 themed-text-muted/40 rounded mx-auto mb-4" />

        {/* DISPLAY */}
        <div className="themed-card rounded-2xl p-4 mb-4">
          <p className="text-sm themed-text-muted">
            {label}
          </p>

          <p className="text-2xl font-semibold themed-text">
            Rp {formatNumber(display)}
          </p>

          {mode === "calculate" && (
            <p className="text-xs themed-text-muted mt-1">
              Mode Hitung (tidak disimpan)
            </p>
          )}
        </div>

        {/* KEYPAD */}
        <div className="grid grid-cols-4 gap-3">
          <Key label="AC" onClick={clearAll} />
          <Key
            label="÷"
            disabled={mode !== "calculate"}
            onClick={() => inputOperator("÷", "/")}
          />
          <Key
            label="×"
            disabled={mode !== "calculate"}
            onClick={() => inputOperator("×", "*")}
          />
          <Key label="DEL" onClick={deleteLast} />

          {[7, 8, 9].map((n) => (
            <Key key={n} label={n} onClick={() => inputNumber(n)} />
          ))}
          <Key label="(" disabled />

          {[4, 5, 6].map((n) => (
            <Key key={n} label={n} onClick={() => inputNumber(n)} />
          ))}
          <Key
            label="-"
            disabled={mode !== "calculate"}
            onClick={() => inputOperator("-", "-")}
          />

          {[1, 2, 3].map((n) => (
            <Key key={n} label={n} onClick={() => inputNumber(n)} />
          ))}
          <Key
            label="+"
            disabled={mode !== "calculate"}
            onClick={() => inputOperator("+", "+")}
          />

          <Key label="." onClick={inputDot} />
          <Key label="0" onClick={() => inputNumber(0)} />
          <Key
            label="="
            disabled={mode !== "calculate"}
            onClick={evaluate}
          />

          {mode === "input" ? (
            <Key label="✓" primary onClick={confirm} />
          ) : (
            <Key label="Kembali" onClick={onClose} />
          )}
        </div>
      </div>
    </div>
  )
}

function Key({ label, onClick, primary, disabled }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        h-14 rounded-xl text-lg font-semibold
        transition-all duration-150
        themed-card
        ${
          disabled
            ? "opacity-40"
            : primary
            ? "bg-indigo-600 text-white active:scale-95 shadow-lg shadow-indigo-600/30"
            : "active:scale-95"
        }
      `}
    >
      {label}
    </button>
  )
}