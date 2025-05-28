import { ThemeToggle } from "@/components"
import { PATHS } from "@/utils"
import { Link } from "react-router-dom"

function Header() {
  return (
    <header className="bg-background text-foreground shadow-lg p-4" >
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold text-teal-300 hover:text-teal-600">
          Excel Analytics Platform
        </Link>

        <nav className="space-x-6 flex items-center">
          <Link to={PATHS.FEATURES} className="hover:text-teal-300">Features</Link>
          <Link to={PATHS.ABOUT} className="hover:text-teal-300">About</Link>
          <Link to={PATHS.SIGNIN} className="hover:text-teal-300">Sign In</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header >
  )
}

export default Header