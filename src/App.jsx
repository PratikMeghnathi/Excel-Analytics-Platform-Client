import { RouterProvider } from "react-router-dom"
import { Router } from "./routes"
import { AuthProvider } from "./context"
import { ToastProvider } from "./components"
import { API_BASE_URL, VITE_ENV } from "./utils"

function App() {
  console.log('Environment: ', VITE_ENV)
  console.log('Hitting request on: ', API_BASE_URL)
  return (
    <AuthProvider>
      <RouterProvider router={Router} />
      <ToastProvider />
    </AuthProvider>
  )
}

export default App