import { RouterProvider } from "react-router-dom"
import { Router } from "./routes"
import { AuthProvider } from "./context"
import { ToastProvider } from "./components"

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={Router} />
      <ToastProvider />
    </AuthProvider>
  )
}

export default App
