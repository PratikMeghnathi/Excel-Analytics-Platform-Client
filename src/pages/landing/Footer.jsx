import { PATHS } from "@/utils"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="bg-background text-foreground py-6">
      <div className="container mx-auto text-center px-4">
        <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
        <div className="flex justify-center mt-4 space-x-6">
          <Link to={PATHS.PRIVACY_POLICY} className="hover:text-teal-200">Privacy Policy</Link>
          <Link to={PATHS.TERMS_OF_SERVICES} className="hover:text-teal-200">Terms of Service</Link>
          <Link to={PATHS.CONTACT} className="hover:text-teal-200">Contact Us</Link>
        </div>
      </div>
    </footer>
  )
} 

export default Footer