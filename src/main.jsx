import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"
import "./themes/themes.css"
import "./themes/components.css"

const savedTheme = localStorage.getItem("globalTheme") || "dark"

document.body.classList.remove(
  "theme-dark",
  "theme-liquid",
  "theme-light",
  "theme-neo"
)
document.documentElement.classList.remove(
  "theme-dark",
  "theme-liquid",
  "theme-light",
  "theme-neo"
)

document.body.classList.add(`theme-${savedTheme}`)
document.documentElement.classList.add(`theme-${savedTheme}`)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)