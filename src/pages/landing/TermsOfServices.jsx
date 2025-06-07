import { PATHS, Shield, AlertCircle, Mail, FileText } from "@/utils"
import { Link } from "react-router-dom"

function TermsOfServices() {
  const sections = [
    {
      title: "1. About This Platform",
      content: `Excel Analytics Platform is a data analysis platform designed for Excel file processing, analyzing data, and generating interactive charts. This platform demonstrates comprehensive data analysis capabilities for uploading Excel files and creating visualizations.`,
    },
    {
      title: "2. Platform Purpose",
      content: `This platform is built to provide hands-on experience with data analysis and visualization. It showcases modern data processing practices and interactive chart generation techniques.`,
    },
    {
      title: "3. Platform Features",
      content: `The platform includes Excel file upload and parsing, user authentication, interactive dashboard, data mapping with dynamic X/Y axes, chart generation (2D/3D), downloadable charts (PNG/PDF), and AI integration for insights.`,
    },
    {
      title: "4. Data Handling",
      content: `Excel files (.xls or .xlsx) are processed and parsed for analysis. Data is securely stored with user authentication. Please use appropriate data for testing and analysis purposes.`,
    },
    {
      title: "5. Platform Capabilities",
      content: `This platform demonstrates proficiency in data processing, interactive visualizations, chart generation, AI integration, responsive design, and integration with various analytics tools.`,
    },
  ]

  const keyPoints = [
    {
      icon: FileText,
      title: "Platform Features",
      description: "Full-featured application with Excel processing, charts, and AI analytics capabilities.",
    },
    {
      icon: Shield,
      title: "Secure & Functional",
      description: "Authentication, secure file upload, and data processing with proper storage.",
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
            Simple terms for this platform. This platform is created for data analysis and to showcase analytics
            capabilities.
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
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">Platform Terms</h2>
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">{section.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Note */}
        <div className="bg-muted/30 rounded-lg p-8 mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">About the Platform</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              This platform was built to demonstrate data analysis capabilities, including Excel processing, data
              visualization, and modern analytics features.
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
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">Try the Platform</h2>
          <p className="text-muted-foreground mb-6">
            Explore the features and see what this platform can do with your data.
          </p>
          <Link to={PATHS.SIGNUP}>
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
              Start Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TermsOfServices
