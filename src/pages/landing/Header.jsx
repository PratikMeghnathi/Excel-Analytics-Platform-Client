import { ThemeToggle } from "@/components"
import { PATHS, BarChart3, Menu, X } from "@/utils"
import { Link, useLocation } from "react-router-dom"
import { useState } from "react"

function Header() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { path: PATHS.FEATURES, label: "Features" },
    { path: PATHS.ABOUT, label: "About" },
    { path: PATHS.CONTACT, label: "Contact" },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={PATHS.WELCOME} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BarChart3 className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Excel Analytics</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(item.path) ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="h-4 w-px bg-border" />
            <Link
              to={PATHS.SIGNIN}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              to={PATHS.SIGNUP}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive(item.path) ? "text-primary" : "text-muted-foreground"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              <Link
                to={PATHS.SIGNIN}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to={PATHS.SIGNUP}
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors text-center"
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
