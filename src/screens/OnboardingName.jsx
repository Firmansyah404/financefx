import { useState } from "react"

export default function OnboardingName({ onNext }) {
  const [name, setName] = useState("")

  const handleNext = () => {
    if (!name) return
    localStorage.setItem("user_name", name)
    onNext()
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6">
      <div className="mt-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Nama Panggilan</h1>
        <p className="text-gray-400">Anda ingin dipanggil apa?</p>

        <input
          className="mt-6 w-full bg-[#1f1f23] rounded-xl p-4 text-center text-lg"
          placeholder="Nama Anda"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <button
        onClick={handleNext}
        className="bg-blue-600 py-4 rounded-xl font-semibold"
      >
        Berikutnya
      </button>
    </div>
  )
}