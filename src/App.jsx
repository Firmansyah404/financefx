import { Routes, Route, Navigate } from "react-router-dom"

import Username from "./screens/Username"
import CreateWallet from "./screens/CreateWallet"

import Home from "./screens/Home"
import Wallet from "./screens/Wallet"
import AllWallets from "./screens/AllWallets"
import AddWallet from "./screens/AddWallet"
import DetailWallet from "./screens/DetailWallet"
import EditWallet from "./screens/EditWallet"
import AdjustWallet from "./screens/AdjustWallet"

import AddTransaction from "./screens/AddTransaction"
import TransactionDetail from "./screens/TransactionDetail"
import EditTransaction from "./screens/EditTransaction"
import AddCategory from "./screens/AddCategory"

import Transactions from "./screens/Transactions"
import Statistik from "./screens/Statistik"

import Settings from "./screens/Settings"
import Theme from "./screens/Theme"
import ThemeGlobal from "./screens/ThemeGlobal"
import AboutApp from "./screens/AboutApp"

import Hutang from "./screens/Hutang"
import HutangList from "./screens/HutangList"
import HutangDetail from "./screens/HutangDetail"

import MainLayout from "./layouts/MainLayout"

export default function App() {
  const username = localStorage.getItem("username")
  const wallets = localStorage.getItem("wallets")

  return (
    <Routes>
      {/* ================= ROOT ================= */}
      <Route
        path="/"
        element={
          !username
            ? <Navigate to="/username" replace />
            : !wallets
            ? <Navigate to="/create-wallet" replace />
            : <Navigate to="/home" replace />
        }
      />

      {/* ============== ONBOARDING (NO LAYOUT) ============== */}
      <Route path="/username" element={<Username />} />
      <Route path="/create-wallet" element={<CreateWallet />} />

      {/* ============== MAIN APP (WITH MainLayout) ============== */}
      <Route element={<MainLayout />}>

        {/* HOME */}
        <Route path="/home" element={<Home />} />

        {/* WALLET */}
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/wallets" element={<AllWallets />} />
        <Route path="/add-wallet" element={<AddWallet />} />
        <Route path="/wallet/:id" element={<DetailWallet />} />
        <Route path="/edit-wallet/:id" element={<EditWallet />} />
        <Route path="/adjust-wallet/:id" element={<AdjustWallet />} />

        {/* TRANSAKSI */}
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/add-transaction" element={<AddTransaction />} />
        <Route path="/transaction/:id" element={<TransactionDetail />} />
        <Route path="/edit-transaction/:id" element={<EditTransaction />} />
        <Route path="/add-category" element={<AddCategory />} />

        {/* STATISTIK */}
        <Route path="/statistik" element={<Statistik />} />

        {/* SETTINGS */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/theme" element={<Theme />} />
        <Route path="/settings/theme-global" element={<ThemeGlobal />} />
        <Route path="/settings/about" element={<AboutApp />} />

        {/* HUTANG */}
        <Route path="/hutang" element={<Hutang />} />
        <Route path="/hutang-list" element={<HutangList />} />
        <Route path="/hutang/:id" element={<HutangDetail />} />

      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}