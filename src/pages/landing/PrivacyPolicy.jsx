import { PATHS, Lock, Database, UserCheck, Mail, Shield } from "@/utils"
import { Link } from "react-router-dom"

function PrivacyPolicy() {
  const sections = [
    {
      title: "1. About This Platform",
      content: `Excel Analytics Platform is a comprehensive data analysis platform designed for Excel file processing, data visualization, and user authentication. This platform demonstrates data analysis capabilities with Excel file processing, chart generation, and AI-powered insights.`,
    },
    {
      title: "2. Data Collection & Processing",
      content: `The platform collects user account information for authentication and processes uploaded Excel files (.xls/.xlsx). All data is stored securely with proper user isolation and data protection measures.`,
    },
    {
      title: "3. File Upload & Analysis",
      content: `Users can upload Excel files which are parsed and analyzed to generate interactive 2D/3D charts. The platform supports dynamic X/Y axis mapping and provides downloadable charts in PNG/PDF formats.`,
    },
    {
      title: "4. AI Integration",
      content: `The platform integrates with AI services to provide smart insights and summary reports from uploaded data. This feature demonstrates advanced analytics capabilities for data understanding.`,
    },
    {
      title: "5. Security Implementation",
      content: `Authentication ensures secure user sessions. File uploads are handled securely, and all data operations follow best practices for data protection and user privacy.`,
    },
    {
      title: "6. Data Usage Recommendation",
      content: `We recommend using appropriate data for testing and analysis. The platform is designed to handle various types of Excel data while maintaining security and privacy standards.`,
    },
  ]

  const privacyFeatures = [
    {
      icon: Shield,
      title: "Data Protection",
      description: "Built with privacy considerations and data protection measures from the start.",
    },
    {
      icon: Lock,
      title: "Secure by Design",
      description: "Implements proper security practices for data handling and user authentication.",
    },
    {
      icon: Database,
      title: "Minimal Data",
      description: "Collects only what's necessary to provide the platform's analytics capabilities.",
    },
    {
      icon: UserCheck,
      title: "User Control",
      description: "You have full control over your data with easy deletion and management options.",
    },
  ]

  const dataTypes = [
    {
      category: "User Authentication",
      items: ["Email and password", "User session tokens", "Account preferences"],
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
            Simple privacy practices for this platform. Your privacy matters in our data analytics platform.
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
              We recommend using appropriate data to explore the features. This ensures optimal experience while
              allowing you to see the platform's capabilities.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-card border border-border rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">Questions?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            If you have any questions about this platform or how your data is handled, feel free to reach out.
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
          <h2 className="text-2xl font-semibold text-foreground mb-4">Try the Platform</h2>
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

export default PrivacyPolicy
