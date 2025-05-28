import { RouterProvider } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { Router } from "./routes"
import { AuthProvider } from "./context"

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={Router} />
      <Toaster />
    </AuthProvider>
  )
}

export default App
