export function formatRupiah(value) {
  if (value === "" || value === null || value === undefined) {
    return "Rp0"
  }

  const number = Number(value.toString().replace(/[^0-9]/g, ""))

  if (isNaN(number)) return "Rp0"

  return (
    "Rp" +
    number.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  )
}