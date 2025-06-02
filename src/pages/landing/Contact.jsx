"use client"

import { useState } from "react"
import { PATHS } from "@/utils"
import { Link } from "react-router-dom"
import { Mail, Github, Linkedin, Send, CheckCircle, GraduationCap, Code } from "lucide-react"

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitted(true)
    setFormData({ name: "", email: "", subject: "", message: "" })
    setIsSubmitting(false)
  }

  const techStack = {
    frontend: ['React.js', 'Shadcn', 'Tailwind CSS', 'Plotly', 'THREE'],
    backend: ['Node.js', 'Express.js', 'MongoDB', 'Xlsx'],
    toolsAndApi: ['JWT Auth', 'Multer', 'GeminiAI API', 'Redis-stack', 'Mailjet'],
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "pratikmeghnathi050@gmail.com",
      description: "Discuss this MERN stack project or opportunities",
    },
    {
      icon: Github,
      title: "GitHub",
      content: "https://github.com/PratikMeghnathi",
      description: "View the complete source code and documentation",
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      content: "https://www.linkedin.com/in/pratik-meghnathi-29b7402a2/",
      description: "Connect for professional opportunities",
    },
  ]

  const faqs = [
    {
      question: "What is the Excel Analytics Platform?",
      answer:
        "A MERN stack project for uploading Excel files, analyzing data, and generating interactive 2D/3D charts with downloadable reports.",
    },
    {
      question: "What features does it include?",
      answer:
        "JWT authentication, file upload/parsing, dashboard, dynamic data mapping, chart generation, AI integration, and downloadable charts (PNG/PDF).",
    },
    {
      question: "What technologies were used?",
      answer:
        "Frontend: React.js, Plotly, Three.js, Tailwind CSS. Backend: Node.js, Express.js, MongoDB, Multer, Xlsx/SheetJS. Optional: GeminiAI API.",
    },
    {
      question: "How long did this project take?",
      answer:
        "This is a structured 5-week project divided into 5 development modules, designed for comprehensive MERN stack learning.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about this project or interested in discussing opportunities? I'd love to hear from you!
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <info.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">{info.title}</h3>
              <p className="text-primary font-medium mb-2">{info.content}</p>
              <p className="text-sm text-muted-foreground">{info.description}</p>
            </div>
          ))}
        </div>

        {/* Contact Form and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-card-foreground mb-6">Send a Message</h2>

            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Message sent!</h3>
                <p className="text-muted-foreground mb-4">
                  Thank you for reaching out. I'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-card-foreground mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground resize-none"
                    placeholder="Tell me about your feedback, questions, or opportunities..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                About This Project
              </h3>
              <p className="text-muted-foreground mb-4">
                This Excel Analytics platform was built as an internship project to showcase full-stack development
                skills, data visualization, and modern web technologies.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                MERN Stack Technologies
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-card-foreground mb-2">Frontend:</p>
                  <div className="flex flex-wrap gap-2">
                    {
                      techStack.frontend.map((tech, index) => (
                        <span key={index} className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm">
                          {tech}
                        </span>
                      ))
                    }
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground mb-2">Backend:</p>
                  <div className="flex flex-wrap gap-2">
                    {
                      techStack.backend.map((tech, index) => (
                        <span key={index} className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded text-sm">
                          {tech}
                        </span>
                      ))
                    }
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground mb-2">Tools & APIs:</p>
                  <div className="flex flex-wrap gap-2">
                    {
                      techStack.toolsAndApi.map((tech, index) => (
                        <span key={index} className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-sm">
                          {tech}
                        </span>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to={PATHS.FEATURES} className="block text-primary hover:underline">
                  View Features
                </Link>
                <Link to={PATHS.PRIVACY_POLICY} className="block text-primary hover:underline">
                  Privacy Policy
                </Link>
                <Link to={PATHS.TERMS_OF_SERVICES} className="block text-primary hover:underline">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Try the Demo</h2>
          <p className="text-muted-foreground mb-6">
            Explore the features and see what this internship project can accomplish.
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

export default Contact
