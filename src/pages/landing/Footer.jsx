"use client"

import { PATHS } from "@/utils"
import { Link } from "react-router-dom"
import { BarChart3, Github, Mail, ExternalLink } from "lucide-react"

function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: "Features", path: PATHS.FEATURES },
      { label: "About", path: PATHS.ABOUT },
      { label: "Contact", path: PATHS.CONTACT },
    ],
    legal: [
      { label: "Privacy Policy", path: PATHS.PRIVACY_POLICY },
      { label: "Terms of Service", path: PATHS.TERMS_OF_SERVICES },
    ],
    resources: [
      { label: "GitHub Repository", path: "https://github.com/PratikMeghnathi/excel-analytics", external: true },
    ],
  }

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link to={PATHS.WELCOME} className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Excel Analytics</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              A comprehensive MERN stack internship project showcasing Excel data analysis, interactive visualizations,
              and AI-powered insights.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/PratikMeghnathi"
                className="p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                aria-label="GitHub Repository"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4 text-muted-foreground" />
              </a>
              <a
                href="mailto:pratikmeghnathi050@gmail.com"
                className="p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                aria-label="Email Contact"
              >
                <Mail className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.path}>
                  {link.external ? (
                    <a
                      href={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Excel Analytics Platform. Built by Pratik Meghnathi.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>MERN Stack Project</span>
              <span>•</span>
              <span>Internship Portfolio</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
