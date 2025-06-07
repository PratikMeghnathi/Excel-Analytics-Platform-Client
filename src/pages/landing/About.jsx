import { Link } from "react-router-dom"
import { Github, Linkedin, Mail, Code, Database, Palette, Brain, PATHS } from "@/utils"

function About() {
  const projectDetails = {
    type: "Excel Analytics Platform",
    purpose: "A comprehensive platform for data analysis and visualization",
  }

  const teamMembers = [
    {
      name: "Pratik Meghnathi",
      role: "Full-Stack Developer",
      description: "Focused on creating a comprehensive Excel analytics solution with modern features.",
      skills: ["Data Visualization", "Analytics", "UI/UX Design", "API Integration"],
      social: {
        github: "https://github.com/PratikMeghnathi",
        linkedin: "https://www.linkedin.com/in/pratik-meghnathi-29b7402a2/",
        email: "pratikmeghnathi050@gmail.com",
      },
    },
  ]

  const platformFeatures = [
    {
      title: "Excel Data Processing",
      description: "Upload and process Excel files with support for multiple sheets and data types",
      features: ["Multiple file format support", "Data structure validation", "Multi-sheet processing"],
    },
    {
      title: "Interactive Visualizations",
      description: "Create stunning 2D and 3D charts with real-time preview and customizable options",
      features: ["Multiple chart types", "3D visualizations", "Real-time preview", "Downloadable formats"],
    },
    {
      title: "AI-Powered Insights",
      description: "Generate intelligent analysis with multiple prompt types for comprehensive data understanding",
      features: ["Summary analysis", "Trend detection", "Performance insights", "Overview reports"],
    },
    {
      title: "User Management",
      description: "Secure user management with admin, standard user, and read-only access levels",
      features: ["Authentication", "Admin controls", "User profiles", "Access management"],
    },
  ]

  const keyCapabilities = [
    "Upload Excel files with automatic parsing",
    "Choose X and Y axes dynamically for chart generation",
    "Generate 2D/3D charts (bar, line, pie, scatter, 3D column)",
    "Download charts in PNG/PDF formats",
    "AI-powered insights and summary reports",
    "Dashboard with upload history and saved analyses",
    "Modern responsive UI with clean design",
    "Secure authentication and role-based permissions",
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">About Excel Analytics Platform</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A comprehensive platform designed for Excel data processing, visualization, and AI-powered insights.
          </p>
        </div>

        {/* Project Overview */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 mb-12">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">Project Details</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span className="text-muted-foreground">
                    <strong>Type:</strong> {projectDetails.type}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span className="text-muted-foreground">
                    <strong>Purpose:</strong> {projectDetails.purpose}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">Key Capabilities</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Excel data processing and analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">File processing and data management</span>
                </li>
                <li className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Data visualization techniques</span>
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">AI integration for insights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-card-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="flex flex-wrap gap-2">
                  {feature.features.map((item, idx) => (
                    <span key={idx} className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Capabilities */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Complete Analytics Solution</h2>
              <div className="space-y-3">
                {keyCapabilities.map((capability, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{capability}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                <div className="text-center">
                  <Code className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                  <Brain className="w-12 h-12 text-primary mx-auto" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Data Processing Pipeline</h3>
              <p className="text-sm text-muted-foreground">
                Upload Excel files → Parse and validate data → Select visualization axes → Generate interactive charts →
                Export or save analysis
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">Development Team</h2>
          <div className="max-w-2xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-card-foreground mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-4">{member.description}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {member.skills.map((skill, idx) => (
                    <span key={idx} className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex justify-center gap-3">
                  <a
                    href={member.social.github}
                    className="p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <a
                    href={`mailto:${member.social.email}`}
                    className="p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Interested in the platform?</h2>
          <p className="text-muted-foreground mb-6">
            Want to learn more about our platform or see how it can help with your data analysis needs?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={PATHS.CONTACT}>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
                Contact Us
              </button>
            </Link>
            <Link to={PATHS.FEATURES}>
              <button className="px-6 py-3 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors font-medium">
                View Features
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
