"use client"

import { PATHS } from "@/utils"
import { Link } from "react-router-dom"
import { FileSpreadsheet, BarChart3, Brain, Users, ArrowRight, CheckCircle, Upload } from "lucide-react"

function Welcome() {
  const coreFeatures = [
    {
      icon: FileSpreadsheet,
      title: "Excel Data Processing",
      description: "Upload and process Excel files (.xlsx, .xls) with support for multiple sheets and data types.",
      details: ["Multiple file format support", "Data structure validation", "Multi-sheet processing"],
    },
    {
      icon: BarChart3,
      title: "Interactive Visualizations",
      description: "Create stunning 2D and 3D charts with real-time preview and customizable options.",
      details: ["5+ chart types", "3D visualizations", "Real-time preview", "Downloadable formats"],
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Generate intelligent analysis with multiple prompt types for comprehensive data understanding.",
      details: ["Summary analysis", "Trend detection", "Performance insights", "Overview reports"],
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Secure user management with admin, standard user, and read-only access levels.",
      details: ["JWT authentication", "Admin controls", "User profiles", "Access management"],
    },
  ]

  const keyCapabilities = [
    "Upload Excel files (.xlsx, .xls) with automatic parsing",
    "Choose X and Y axes dynamically for chart generation",
    "Generate 2D/3D charts (bar, line, pie, scatter, 3D column)",
    "Download charts in PNG/PDF formats",
    "AI-powered insights and summary reports",
    "Dashboard with upload history and saved analyses",
    "Modern responsive UI built with React and Tailwind CSS",
    "Secure authentication and role-based permissions",
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Excel Analytics Platform
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
            A powerful MERN stack platform for uploading Excel files, analyzing data, and generating interactive 2D and
            3D charts. Transform your spreadsheet data into actionable insights with AI-powered analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={PATHS.SIGNUP}>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Start Analyzing Data
              </button>
            </Link>
            <Link to={PATHS.SIGNIN}>
              <button className="px-6 py-3 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors font-medium">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Core Features */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground text-center mb-8">
            Core Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Capabilities */}
        <div className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-6">
                Complete Excel Analytics Solution
              </h2>
              <div className="space-y-3">
                {keyCapabilities.map((capability, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{capability}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                <div className="text-center">
                  <FileSpreadsheet className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                  <BarChart3 className="w-12 h-12 text-primary mx-auto" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Excel to Charts Pipeline</h3>
              <p className="text-sm text-muted-foreground">
                Upload Excel files → Parse data → Select axes → Generate interactive charts → Download or save analysis
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 mb-12 sm:mb-16">
          <h2 className="text-2xl font-semibold text-card-foreground text-center mb-6">Built with Modern Technology</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <div className="text-2xl font-bold text-primary mb-1">React.js</div>
              <div className="text-sm text-muted-foreground">Frontend</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-primary mb-1">Node.js</div>
              <div className="text-sm text-muted-foreground">Backend</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-primary mb-1">MongoDB</div>
              <div className="text-sm text-muted-foreground">Database</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-primary mb-1">Chart.js</div>
              <div className="text-sm text-muted-foreground">Visualization</div>
            </div>
          </div>
        </div>

        {/* User Roles */}
        <div className="bg-muted/30 rounded-lg p-6 sm:p-8 mb-12">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-6">Access Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <h3 className="font-semibold text-card-foreground mb-2">Admin</h3>
              <p className="text-sm text-muted-foreground">
                Full platform access, user management, analytics dashboard
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <h3 className="font-semibold text-card-foreground mb-2">Standard User</h3>
              <p className="text-sm text-muted-foreground">Upload files, create charts, save analyses, AI insights</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <h3 className="font-semibold text-card-foreground mb-2">Read-Only</h3>
              <p className="text-sm text-muted-foreground">View shared analyses and charts, limited access</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-card-foreground mb-4">
            Ready to analyze your Excel data?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join our platform and transform your spreadsheet data into powerful visualizations and AI-driven insights.
          </p>
          <Link to={PATHS.SIGNUP}>
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium inline-flex items-center gap-2">
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Welcome
