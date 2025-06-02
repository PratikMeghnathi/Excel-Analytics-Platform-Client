"use client"

import { PATHS } from "@/utils"
import { Link } from "react-router-dom"
import { Lock, Database, UserCheck, Mail, GraduationCap } from "lucide-react"

function PrivacyPolicy() {
  const sections = [
    {
      title: "1. About This MERN Stack Project",
      content: `Excel Analytics Platform is a comprehensive MERN stack project designed for educational purposes. It demonstrates full-stack development with Excel file processing, data visualization, and user authentication over a 5-week development period.`,
    },
    {
      title: "2. Data Collection & Processing",
      content: `The platform collects user account information for JWT authentication and processes uploaded Excel files (.xls/.xlsx) using Xlsx library. All data is stored securely in MongoDB with proper user isolation.`,
    },
    {
      title: "3. File Upload & Analysis",
      content: `Users can upload Excel files which are parsed and analyzed to generate interactive 2D/3D charts. The platform supports dynamic X/Y axis mapping and provides downloadable charts in PNG/PDF formats.`,
    },
    {
      title: "4. AI Integration (Optional)",
      content: `The platform optionally integrates with AI APIs (like GeminiAI) to provide smart insights and summary reports from uploaded data. This feature demonstrates API integration capabilities.`,
    },
    {
      title: "5. Security Implementation",
      content: `JWT-based authentication ensures secure user sessions. File uploads are handled securely with Multer, and all data operations follow MongoDB best practices for data protection.`,
    },
    {
      title: "6. Educational Use Recommendation",
      content: `As this is a learning project, we recommend using sample Excel data for testing. The platform is designed to showcase technical capabilities rather than handle sensitive business data.`,
    },
  ]

  const privacyFeatures = [
    {
      icon: GraduationCap,
      title: "Educational Purpose",
      description: "Built as a learning project with privacy considerations in mind from the start.",
    },
    {
      icon: Lock,
      title: "Secure by Design",
      description: "Implements proper security practices even for demonstration purposes.",
    },
    {
      icon: Database,
      title: "Minimal Data",
      description: "Collects only what's necessary to demonstrate the platform's capabilities.",
    },
    {
      icon: UserCheck,
      title: "User Control",
      description: "You have full control over your demo data with easy deletion options.",
    },
  ]

  const dataTypes = [
    {
      category: "User Authentication",
      items: ["Email and password (JWT)", "User session tokens", "Account preferences"],
    },
    {
      category: "Excel File Data",
      items: ["Uploaded .xls/.xlsx files", "Parsed spreadsheet data", "Generated chart configurations"],
    },
    {
      category: "Generated Content",
      items: ["Interactive 2D/3D charts", "AI-generated insights", "Downloadable reports (PNG/PDF)"],
    },
    {
      category: "Platform Analytics",
      items: ["Upload history dashboard", "Chart generation logs", "User activity patterns"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Simple privacy practices for this internship demo project. Your privacy matters, even in educational
            projects.
          </p>
          <div className="text-sm text-muted-foreground mt-4">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>

        {/* Privacy Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {privacyFeatures.map((feature, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Data Collection */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">What We Collect</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dataTypes.map((type, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">{type.category}</h3>
                <ul className="space-y-2">
                  {type.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Policy Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">Privacy Details</h2>
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">{section.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-muted/30 rounded-lg p-8 mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Recommendation</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Since this is a demonstration project, we recommend using sample or non-sensitive data to explore the
              features. This ensures your privacy while allowing you to see the platform's capabilities.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-card border border-border rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">Questions?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            If you have any questions about this demo project or how your data is handled, feel free to reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={PATHS.CONTACT}>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Get in Touch
              </button>
            </Link>
            <Link to={PATHS.TERMS_OF_SERVICES}>
              <button className="px-6 py-3 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors font-medium">
                Terms of Service
              </button>
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Try the Demo</h2>
          <p className="text-muted-foreground mb-6">
            Explore the features safely with sample data and see what this project can do.
          </p>
          <Link to={PATHS.SIGNUP}>
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
              Start Demo
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
