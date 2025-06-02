"use client"

import { PATHS } from "@/utils"
import { Link } from "react-router-dom"
import { Github, Linkedin, Mail, Code, Database, Palette, Brain } from "lucide-react"

function About() {
  const projectDetails = {
    type: "MERN Stack Full-Stack Project",
    duration: "5-week development period",
    structure: "1-week modules with structured goals",
    purpose: "Student project for hands-on experience with complete application development",
  }

  const teamMembers = [
    {
      name: "Pratik Meghnathi",
      role: "Full-Stack Developer",
      description: "MERN stack specialists focused on creating a comprehensive Excel analytics solution.",
      skills: ["React.js", "Node.js", "MongoDB", "Express.js"],
      social: {
        github: "https://github.com/PratikMeghnathi",
        linkedin: "https://www.linkedin.com/in/pratik-meghnathi-29b7402a2/",
        email: "pratikmeghnathi050@gmail.com",
      },
    },
  ]

  const techStack = {
    frontend: [
      { name: "React.js", description: "Component-based UI framework" },
      { name: "Shadcn/ui", description: "Accessible and customizable component library" },
      { name: "Tailwind CSS", description: "Utility-first styling" },
      { name: "Plotly.js", description: "Interactive 2D and 3D chart generation" },
      { name: "Three.js", description: "3D visualizations with .glb export support" },
    ],
    backend: [
      { name: "Node.js", description: "JavaScript runtime" },
      { name: "Express.js", description: "Web application framework" },
      { name: "MongoDB", description: "NoSQL database" },
      { name: "Multer", description: "File upload handling" },
      { name: "Xlsx", description: "Excel file parsing" },
    ],
    optional: [
      { name: "Gemini API", description: "AI insights generation" },
      { name: "Hoppscotch", description: "API testing" },
      { name: "GitHub", description: "Version control" },
      { name: "Redis", description: "Temporary data storage" },
      { name: "Mailjet", description: "Email delivery service" },
    ],
  }

  const developmentPhases = [
    {
      week: "Week 1",
      title: "Project Setup & Authentication",
      tasks: ["User/admin authentication", "Dashboard layout", "Basic project structure"],
    },
    {
      week: "Week 2",
      title: "File Upload & Data Processing",
      tasks: ["Excel file upload", "SheetJS parsing", "Data storage in MongoDB"],
    },
    {
      week: "Week 3",
      title: "Chart Generation",
      tasks: ["Chart.js & Three.js integration", "Dynamic axis selection", "Chart rendering"],
    },
    {
      week: "Week 4",
      title: "Analysis & Features",
      tasks: ["Save analysis history", "Download functionality", "AI API integration"],
    },
    {
      week: "Week 5",
      title: "Admin Panel & Testing",
      tasks: ["Admin dashboard", "Bug fixes", "Testing", "Deployment preparation"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">About Excel Analytics Platform</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A comprehensive MERN stack project designed for students to gain hands-on experience with complete
            application development, from Excel data processing to AI-powered insights.
          </p>
        </div>

        {/* Project Overview */}
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 mb-12">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6">Project Overview</h2>
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
                    <strong>Duration:</strong> {projectDetails.duration}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span className="text-muted-foreground">
                    <strong>Structure:</strong> {projectDetails.structure}
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
              <h3 className="text-lg font-semibold text-card-foreground mb-3">Key Learning Objectives</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Full-stack development with MERN</span>
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
                  <span className="text-muted-foreground">AI API integration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Development Timeline */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">Development Timeline</h2>
          <div className="space-y-4">
            {developmentPhases.map((phase, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-shrink-0">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {phase.week}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">{phase.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {phase.tasks.map((task, idx) => (
                        <span key={idx} className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm">
                          {task}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">Technology Stack & Tools</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Frontend</h3>
              <div className="space-y-3">
                {techStack.frontend.map((tech, index) => (
                  <div key={index}>
                    <div className="font-medium text-card-foreground">{tech.name}</div>
                    <div className="text-sm text-muted-foreground">{tech.description}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Backend</h3>
              <div className="space-y-3">
                {techStack.backend.map((tech, index) => (
                  <div key={index}>
                    <div className="font-medium text-card-foreground">{tech.name}</div>
                    <div className="text-sm text-muted-foreground">{tech.description}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Optional Tools</h3>
              <div className="space-y-3">
                {techStack.optional.map((tech, index) => (
                  <div key={index}>
                    <div className="font-medium text-card-foreground">{tech.name}</div>
                    <div className="text-sm text-muted-foreground">{tech.description}</div>
                  </div>
                ))}
              </div>
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
                  >
                    <Github className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
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
          <h2 className="text-2xl font-semibold text-foreground mb-4">Interested in the project?</h2>
          <p className="text-muted-foreground mb-6">
            Want to learn more about our development process or contribute to the project?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={PATHS.CONTACT}>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
                Contact Team
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
