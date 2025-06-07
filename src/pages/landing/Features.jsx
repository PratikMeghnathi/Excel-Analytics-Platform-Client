import { PATHS, FileSpreadsheet, BarChart3, Brain, Users, Download, Settings, Database, CheckCircle, Zap, Shield, TrendingUp, } from "@/utils"
import { Link } from "react-router-dom"
import { Eye } from "lucide-react"

function Features() {
  const coreFeatures = [
    {
      icon: FileSpreadsheet,
      title: "Excel Data Processing",
      description: "Comprehensive Excel file handling with advanced parsing capabilities.",
      features: [
        "Upload Excel files (*.xlsx, *.xls)",
        "Parse and validate data structures",
        "Support for multiple sheets",
        "Handle various data types automatically",
        "Real-time data preview",
      ],
    },
    {
      icon: BarChart3,
      title: "Data Analysis & Visualization",
      description: "Create stunning interactive charts with powerful customization options.",
      features: [
        "Interactive chart creation",
        "Multiple chart types (bar, line, pie, scatter, 3D)",
        "Dynamic X and Y axis selection",
        "Real-time chart preview",
        "Data filtering and transformation",
      ],
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Generate intelligent insights from your Excel data using AI technology.",
      features: [
        "Generate AI insights from data",
        "Summary analysis reports",
        "Trend detection algorithms",
        "Performance analysis",
        "Overview and recommendations",
      ],
    },
    {
      icon: Users,
      title: "User Management",
      description: "Secure authentication with role-based access control system.",
      features: [
        "JWT-based authentication",
        "Admin role with full access",
        "Standard user permissions",
        "Read-only user access",
        "User profile management",
      ],
    },
  ]

  const dashboardFeatures = [
    {
      icon: Database,
      title: "Upload History",
      description: "Track all your file uploads with detailed history and metadata.",
    },
    {
      icon: TrendingUp,
      title: "Saved Analyses",
      description: "Library of saved analyses with AI insights and chart configurations.",
    },
    {
      icon: Zap,
      title: "Quick Operations",
      description: "Fast access to frequently used operations and recent analyses.",
    },
    {
      icon: Shield,
      title: "Admin Analytics",
      description: "Comprehensive analytics dashboard for administrators and monitoring.",
    },
  ]

  const technicalFeatures = [
    {
      icon: Download,
      title: "Export Options",
      description: "Download charts in PNG/PDF formats for reports and presentations.",
      details: [
        "PNG format for web use",
        "PDF format for documents",
        "High-resolution exports",
        "3D interactive download (.glb format)",
      ],
    },
    {
      icon: Settings,
      title: "Customizable Charts",
      description: "Extensive customization options for chart appearance and behavior.",
      details: ["Color scheme selection", "Chart size adjustment", "Legend positioning", "Axis label customization"],
    },
    {
      icon: Eye,
      title: "Real-time Preview",
      description: "See your charts update instantly as you modify data and settings.",
      details: ["Live chart updates", "Interactive preview", "Instant feedback", "No page refresh needed"],
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Robust data handling with MongoDB storage and efficient processing.",
      details: ["Secure data storage", "Fast data retrieval", "Data backup systems", "Scalable architecture"],
    },
  ]

  const chartTypes = [
    "Bar Charts",
    "Line Charts (2D/3D)",
    "Pie Charts",
    "Scatter Plots (2D/3D)",
    "Surface 3D",
    "Mesh 3D",
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Platform Features</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive Excel analytics platform with advanced data processing, visualization, and AI-powered
            insights. Built with modern MERN stack technology for optimal performance.
          </p>
        </div>

        {/* Core Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">Core Platform Features</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">Dashboard Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Types */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 mb-12">
          <h2 className="text-2xl font-semibold text-card-foreground text-center mb-6">Supported Chart Types</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {chartTypes.map((type, index) => (
              <div key={index} className="bg-muted/30 rounded-md p-3 text-center">
                <div className="text-sm font-medium text-card-foreground">{type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">Technical Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {technicalFeatures.map((feature, index) => (
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

        {/* AI Analysis Types */}
        <div className="bg-muted/30 rounded-lg p-6 sm:p-8 mb-12">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-6">AI Analysis Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <h3 className="font-semibold text-card-foreground mb-2">Summary Analysis</h3>
              <p className="text-sm text-muted-foreground">Comprehensive data overview and key statistics</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <h3 className="font-semibold text-card-foreground mb-2">Trend Detection</h3>
              <p className="text-sm text-muted-foreground">Identify patterns and trends in your data</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <h3 className="font-semibold text-card-foreground mb-2">Performance Analysis</h3>
              <p className="text-sm text-muted-foreground">Evaluate performance metrics and KPIs</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <h3 className="font-semibold text-card-foreground mb-2">Overview Reports</h3>
              <p className="text-sm text-muted-foreground">Generate comprehensive analysis reports</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">Ready to explore these features?</h2>
          <p className="text-muted-foreground mb-6">
            Start using our Excel Analytics Platform and experience the power of data visualization and AI insights.
          </p>
          <Link to={PATHS.SIGNUP}>
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
              Get Started Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Features
