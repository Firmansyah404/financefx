import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Home, FileText, Plus, BarChart2, Wallet } from "lucide-react"

export default function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const [globalTheme, setGlobalTheme] = useState(
    () => localStorage.getItem("globalTheme") || "dark"
  )

  useEffect(() => {
    const reloadTheme = () => {
      setGlobalTheme(localStorage.getItem("globalTheme") || "dark")
    }

    window.addEventListener("themeChange", reloadTheme)
    return () => window.removeEventListener("themeChange", reloadTheme)
  }, [])

  useEffect(() => {
    const themes = [
      "theme-dark",
      "theme-liquid",
      "theme-light",
      "theme-neo",
      "theme-pastel",
    ]

    document.body.classList.remove(...themes)
    document.documentElement.classList.remove(...themes)

    document.body.classList.add(`theme-${globalTheme}`)
    document.documentElement.classList.add(`theme-${globalTheme}`)
  }, [globalTheme])

  const hideNavRoutes = [
    "/add-transaction",
    "/settings",
    "/add-wallet",
    "/settings/theme",
    "/transaction",
    "/add-category",
    "/all-wallet",
    "/wallets",
    "/hutang"
  ]

  const hideNav = hideNavRoutes.some((path) =>
    location.pathname.startsWith(path)
  )

  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <div className="min-h-screen themed-page">
      <Outlet />

      {!hideNav && (
        globalTheme === "liquid"
          ? (
            <LiquidNav
              navigate={navigate}
              isActive={isActive}
              theme={globalTheme}
            />
          )
          : (
            <DarkNav
              navigate={navigate}
              isActive={isActive}
              theme={globalTheme}
            />
          )
      )}
    </div>
  )
}

function DarkNav({ navigate, isActive, theme }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div
        className="
          mx-4 mb-4
          h-16
          themed-card
          rounded-3xl
          flex items-center justify-around
          shadow-2xl
        "
      >
        <NavIcon
          active={isActive("/home")}
          onClick={() => navigate("/home")}
        >
          <Home />
        </NavIcon>

        <NavIcon
          active={isActive("/transactions")}
          onClick={() => navigate("/transactions")}
        >
          <FileText size={22} />
        </NavIcon>

        <AddButton
          theme={theme}
          onClick={() => navigate("/add-transaction")}
        />

        <NavIcon
          active={isActive("/statistik")}
          onClick={() => navigate("/statistik")}
        >
          <BarChart2 />
        </NavIcon>

        <NavIcon
          active={isActive("/wallet")}
          onClick={() => navigate("/wallet")}
        >
          <Wallet />
        </NavIcon>
      </div>
    </div>
  )
}

function LiquidNav({ navigate, isActive, theme }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className="
          flex items-center gap-6
          px-6 py-3
          rounded-full
          bg-black/10
          backdrop-blur-md
          border border-white/20
          shadow-[0_10px_40px_rgba(0,0,0,0.45)]
          shadow-inner shadow-white/10
        "
      >
        <NavIconLiquid
          active={isActive("/home")}
          onClick={() => navigate("/home")}
        >
          <Home />
        </NavIconLiquid>

        <NavIconLiquid
          active={isActive("/transactions")}
          onClick={() => navigate("/transactions")}
        >
          <FileText size={22} />
        </NavIconLiquid>

        <AddButton
          theme={theme}
          onClick={() => navigate("/add-transaction")}
        />

        <NavIconLiquid
          active={isActive("/statistik")}
          onClick={() => navigate("/statistik")}
        >
          <BarChart2 />
        </NavIconLiquid>

        <NavIconLiquid
          active={isActive("/wallet")}
          onClick={() => navigate("/wallet")}
        >
          <Wallet />
        </NavIconLiquid>
      </div>
    </div>
  )
}

function NavIcon({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`
        p-3 rounded-2xl transition
        ${active ? "themed-card scale-105" : "themed-text-muted"}
      `}
    >
      {children}
    </button>
  )
}

function NavIconLiquid({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`
        p-2 rounded-2xl transition
        ${active ? "bg-white/20 text-white scale-105" : "text-white/50"}
      `}
    >
      {children}
    </button>
  )
}

function AddButton({ onClick, theme }) {
  const isPastel = theme === "pastel"

  return (
    <button
      onClick={onClick}
      className="
        w-14 h-14
        rounded-2xl
        flex items-center justify-center
        text-white
        -mt-8
        shadow-xl
        active:scale-95
        transition
      "
      style={{
        background: isPastel ? "#A5B4FC" : "#6366F1",
        boxShadow: isPastel
          ? "0 10px 25px rgba(165, 180, 252, 0.45)"
          : "0 10px 25px rgba(99, 102, 241, 0.45)"
      }}
    >
      <Plus size={28} />
    </button>
  )
}