"use client"

import { PATHS } from "@/utils"
import { Link } from "react-router-dom"
import { Shield, AlertCircle, Mail, GraduationCap } from "lucide-react"

function TermsOfServices() {
  const sections = [
    {
      title: "1. About This Project",
      content: `Excel Analytics Platform is a MERN stack (MongoDB, Express.js, React.js, Node.js) project designed as a 5-week structured learning experience. This platform demonstrates full-stack development capabilities for uploading Excel files, analyzing data, and generating interactive charts.`,
    },
    {
      title: "2. Educational Purpose",
      content: `This project is built as part of a structured learning curriculum to gain hands-on experience with complete application development using the MERN stack. It showcases modern web development practices and data visualization techniques.`,
    },
    {
      title: "3. Platform Features",
      content: `The platform includes Excel file upload and parsing, user authentication with JWT, interactive dashboard, data mapping with dynamic X/Y axes, chart generation (2D/3D), downloadable charts (PNG/PDF), and optional AI integration for insights.`,
    },
    {
      title: "4. Data Handling",
      content: `Excel files (.xls or .xlsx) are processed using SheetJS/xlsx library. Data is securely stored in MongoDB with user authentication. As this is a learning project, please use sample data for testing purposes.`,
    },
    {
      title: "5. Technology Demonstration",
      content: `This project demonstrates proficiency in React.js, Node.js, Express.js, MongoDB, Plotly for 2D/3D charts, Tailwind CSS for styling, and integration with various APIs and tools.`,
    },
  ]

  const keyPoints = [
    {
      icon: GraduationCap,
      title: "MERN Stack Project",
      description: "Full-stack application built with MongoDB, Express.js, React.js, and Node.js over 10 weeks.",
    },
    {
      icon: Shield,
      title: "Secure & Functional",
      description: "JWT-based authentication, secure file upload, and data processing with MongoDB storage.",
    },
    {
      icon: AlertCircle,
      title: "Advanced Features",
      description: "Interactive charts, 3D visualizations, AI integration, and downloadable reports.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Simple terms for this internship project. This platform is created for educational purposes and to showcase
            technical development skills.
          </p>
          <div className="text-sm text-muted-foreground mt-4">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {keyPoints.map((point, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <point.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">{point.title}</h3>
              <p className="text-muted-foreground">{point.description}</p>
            </div>
          ))}
        </div>

        {/* Terms Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">Project Terms</h2>
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">{section.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Note */}
        <div className="bg-muted/30 rounded-lg p-8 mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">About the Developer</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              This project was built as part of an internship to demonstrate full-stack development skills, including
              React, Node.js, data visualization, and modern web technologies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={PATHS.CONTACT}>
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Get in Touch
                </button>
              </Link>
              <Link to={PATHS.PRIVACY_POLICY}>
                <button className="px-6 py-3 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors font-medium">
                  Privacy Policy
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">Try the Demo</h2>
          <p className="text-muted-foreground mb-6">
            Explore the features and see what this internship project can do with your data.
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

export default TermsOfServices
