import { RouterProvider } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { Router } from "./routes"
import { AuthProvider } from "./context"
import { ToastProvider } from "./components"

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={Router} />
      <ToastProvider />
      {/* </ToastProvider>   */}
      {/* <Toaster /> */}
    </AuthProvider>
  )
}

export default App
