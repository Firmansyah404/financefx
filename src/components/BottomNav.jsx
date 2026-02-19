import { NavLink } from "react-router-dom"
import {
  Home,
  PlusCircle,
  List,
  PieChart,
  User,
} from "lucide-react"

const navItems = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/transactions", label: "Transaksi", icon: List },
  { to: "/add", label: "Tambah", icon: PlusCircle, primary: true },
  { to: "/stats", label: "Statistik", icon: PieChart },
  { to: "/profile", label: "Profil", icon: User },
]

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-3 mb-3 bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-lg">
        <nav className="flex justify-between items-center px-3 py-2">
          {navItems.map(({ to, label, icon: Icon, primary }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center
                 flex-1 py-2 rounded-2xl
                 transition-all duration-300
                 ${
                   isActive
                     ? primary
                       ? "text-white"
                       : "text-white"
                     : "text-zinc-400"
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* ACTIVE INDICATOR */}
                  {isActive && !primary && (
                    <span
                      className="
                        absolute inset-0
                        bg-zinc-800
                        rounded-2xl
                        scale-100
                        transition-transform duration-300
                      "
                    />
                  )}

                  {/* ICON */}
                  <div
                    className={`
                      relative z-10
                      transition-all duration-300
                      ${
                        primary
                          ? "bg-indigo-600 text-white p-3 rounded-full -mt-6 shadow-lg"
                          : isActive
                          ? "scale-110"
                          : "scale-100"
                      }
                    `}
                  >
                    <Icon size={22} />
                  </div>

                  {/* LABEL */}
                  {!primary && (
                    <span
                      className={`
                        relative z-10 text-xs mt-1
                        transition-opacity duration-300
                        ${isActive ? "opacity-100" : "opacity-70"}
                      `}
                    >
                      {label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}