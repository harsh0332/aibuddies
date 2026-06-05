// Configuration file for AI Buddies brand copy and details.
// You can edit any details here to update the marketing content sitewide.

export const BRAND_CONFIG = {
  name: "AI Buddies",
  categoryLine: "Agents · Automations · AI Skills",
  primaryTagline: "We build AI systems that run your business — so you don't have to.",
  positioning: "We don't just build AI tools — we build systems that run your business while you sleep. From clinics to media companies, marketing agencies to coaching firms, we help businesses stop doing things manually and start running on AI.",
  
  // Three Pillars
  pillars: [
    {
      title: "24/7 Running",
      description: "No breaks, no holidays. Your systems work around the clock."
    },
    {
      title: "Results from Month One",
      description: "Measurable impact from day one, not months down the line."
    },
    {
      title: "Full Stack",
      description: "AI services under one roof."
    }
  ],

  // Services
  services: [
    {
      id: "ai-chatbots",
      title: "AI Chatbots",
      description: "Intelligent, context-aware assistants that engage your visitors and automate customer interactions instantly."
    },
    {
      id: "whatsapp-automation",
      title: "WhatsApp Automation",
      description: "Automate broadcasts, reminders, and patient/customer messaging pipelines directly on WhatsApp."
    },
    {
      id: "voice-agents",
      title: "Voice Agents",
      description: "AI voice systems that handle incoming queries and perform outgoing calls with natural human cadence."
    },
    {
      id: "lead-qualification",
      title: "Lead Qualification",
      description: "Identify and qualify prospects automatically, steering ready-to-buy clients to your sales representatives."
    },
    {
      id: "ai-customer-support",
      title: "AI Customer Support",
      description: "Resolve tickets, answer FAQs, and handle customer service 24/7 with zero human intervention."
    }
  ],

  // Full Stack AI description
  fullStackAI: {
    title: "Full Stack AI",
    description: "Our comprehensive bundle encompassing all five core AI systems, custom-tailored and unified to automate your entire business workflow under one roof."
  },

  // Process
  process: [
    {
      step: "01",
      title: "Discover",
      description: "We audit your manual workflows, find bottleneck processes, and outline a tailored automation blueprint."
    },
    {
      step: "02",
      title: "Build",
      description: "We configure custom LLM agents, design WhatsApp pipelines, and construct scalable voice systems."
    },
    {
      step: "03",
      title: "Automate",
      description: "We integrate systems with your current tools using n8n and launch agents into production."
    },
    {
      step: "04",
      title: "Results",
      description: "You watch your business run on autopilot, recording immediate efficiency gains and cost savings from month one."
    }
  ],

  // Clients
  clients: [
    {
      name: "Bluhawk Marketing",
      service: "Full Stack AI",
      highlight: "AI Chatbots, WhatsApp Automation & Bot, Voice Agent, Lead Qualification, AI Customer Support."
    },
    {
      name: "MP Fertility Centre",
      service: "WhatsApp Automation",
      highlight: "After-hours AI voice agent, appointment booking, and patient follow-ups. Ensuring no enquiry goes unanswered, even outside clinic hours."
    },
    {
      name: "DPM Entertainment Pvt. Ltd.",
      service: "WhatsApp Automation",
      highlight: "WhatsApp Automation powered via n8n managing client onboarding, broadcast campaigns, and automated booking confirmations."
    },
    {
      name: "Host Dhanraj",
      service: "Full Stack AI",
      highlight: "AI Chatbots, WhatsApp Automation & Bot, Voice Agent, Lead Qualification, AI Customer Support."
    },
    {
      name: "InnovateX Media",
      service: "Full Stack AI",
      highlight: "Voice Agent, AI Chatbots, WhatsApp Automation & Bot, Lead Qualification, AI Customer Support."
    },
    {
      name: "Bizparadise10X",
      service: "Lead Engine",
      highlight: "Lead qualification system incorporating voice agents and AI chatbots. Qualifies and nurtures prospects automatically so sales focuses only on ready-to-buy clients."
    }
  ],

  // Why Us
  whyUs: [
    {
      title: "Fast Delivery",
      description: "Live in days, not months. We deploy working automation systems rapidly."
    },
    {
      title: "24/7 Running",
      description: "Continuous operation around the clock. Your AI never sleeps or takes holidays."
    },
    {
      title: "n8n Powered",
      description: "Reliable, scalable infrastructure built on top of robust workflow engines."
    },
    {
      title: "Real Results",
      description: "Zero manual effort needed to run operations. Watch efficiency increase instantly."
    },
    {
      title: "Full Stack",
      description: "All services under one roof. No need to manage multiple agencies or tools."
    }
  ],

  // Testimonials (Scaffolded - EDITABLE)
  testimonials: [
    {
      company: "MP Fertility Centre",
      service: "WhatsApp Automation via n8n",
      text: "After-hours AI voice agent, appointment booking and patient follow-ups — no enquiry goes unanswered, even outside clinic hours."
    },
    {
      company: "DPM Entertainment Pvt. Ltd.",
      service: "WhatsApp Automation via n8n",
      text: "Client onboarding, broadcast campaigns and booking confirmations — entertainment bookings and client communication, all automated through WhatsApp."
    },
    {
      company: "Bizparadise10X",
      service: "Lead Engine",
      text: "A lead engine with voice agents and AI chatbots that qualifies and nurtures prospects automatically, so the sales team focuses only on ready-to-buy clients."
    }
  ],

  // CTA Benefits & Messaging
  ctaSystem: {
    benefitLine: "Free 30-min call · no obligation",
    secondaryBtnText: "See how it works",
  },

  // Privacy & WhatsApp Trust signals
  trustSignals: {
    privacyLine: "Your details stay private — we never share them. DPDP-aware handling.",
    verifiedBadgeText: "Verified Business Profile",
    whatsappClickToChat: "Chat on WhatsApp",
  },

  // Objection-Handling FAQs (Truthful answers, no fabricated metrics)
  faqs: [
    {
      question: "How much does custom AI cost, and what is the return on investment (ROI)?",
      answer: "We focus on building AI systems that pay for themselves. By capturing missed after-hours leads, reducing manual message bottlenecks, and preventing booking no-shows, our systems recover their costs rapidly. Booking a discovery call is completely free, carries zero commitment, and we will outline a transparent cost breakdown based on the exact workflows you choose to automate."
    },
    {
      question: "Will these AI systems replace my existing staff?",
      answer: "No. Our systems are designed to amplify your staff, not replace them. By automating 80% of repetitive, low-value tasks (like booking appointments, qualifying leads, and answering repetitive FAQs), your team is freed to focus on high-value human relationships. We also implement direct escalation guardrails, routing complex or high-intent enquiries directly to your team on Slack, WhatsApp, or email."
    },
    {
      question: "How reliable are these AI agents? Do they make mistakes or hallucinate?",
      answer: "We build custom prompt constraints, strict operational guardrails, and real-time backend checks into every agent. Unlike raw, unchecked LLMs or brittle rule-based bots, our systems are monitored and include direct fallback routes to human support, ensuring your brand standards and business workflows are protected."
    },
    {
      question: "Where is our data stored, and how do you handle customer privacy?",
      answer: "Data privacy is central to our builds. We follow secure data handling practices and design systems to be DPDP-aware. Your business retains 100% ownership of your Meta Business Suite, WhatsApp Business assets, and backend databases. We customize data-residency routes according to your local requirements."
    },
    {
      question: "How fast can we launch our custom AI system?",
      answer: "Most custom workflow automations, WhatsApp pipelines, and voice agents are designed, built, and launched into production within 7 to 14 days. We work in rapid sprints, delivering a functional initial version first and optimizing it continuously based on live traffic data."
    },
    {
      question: "We are not tech-savvy. Who manages these systems after launch?",
      answer: "We build, deploy, and fully run the systems for you. We provide hands-on onboarding for your team and handle all maintenance, API updates, and fine-tuning. You do not need any coding or engineering expertise to manage your automated business; we handle the technical heavy lifting while you monitor the results."
    }
  ],

  // CTAs & Closing Copy
  closingCTA: {
    heading: "Ready to Automate Your Business?",
    subheading: "Your competitors are already doing it. What are you waiting for?",
    primaryBtn: "Book a Free Call"
  },

  // Contact Information
  contact: {
    whatsapp: "+91 95161 94751",
    instagram: "@aibuddiess",
    whatsappLink: "https://wa.me/919516194751?text=Hi%20AI%20Buddies%2C%20I'd%20like%20to%20book%20a%20free%20call%20to%20automate%20my%20business.",
    instagramLink: "https://instagram.com/aibuddiess",
    email: "", // Sanitized / Not displayed
    address: "India"
  },

  // Honest deck-derived stats (editable for future scaling)
  trustStats: [
    { value: 6, suffix: "+", label: "Businesses Automated" }, // 6 named clients in the deck
    { value: 5, suffix: "", label: "AI Systems Under One Roof" }, // the 5 core services
    { value: 24, suffix: "/7", label: "Always-On Monitoring" }, // 24/7 running systems
    { value: 0, display: "Days", label: "To Launch, Not Months" } // qualitative fallback for rapid deployment
  ],

  problem: {
    eyebrow: "The Cost of Inaction",
    heading: "Your Business is Bleeding Leads and Revenue.",
    description: "Every minute a lead waits is a minute they spend looking at your competitors. Here is the messy status quo holding you back:",
    painPoints: [
      {
        title: "Missed After-Hours Leads",
        description: "Enquiries arriving outside 9-to-5 are left cold. Over 50% of buyers choose the vendor who responds first."
      },
      {
        title: "Slow Inquiry Follow-Up",
        description: "Manual response times take hours instead of seconds. Leads lose interest and bounce."
      },
      {
        title: "Manual WhatsApp Replies",
        description: "Your team spends hours copying and pasting answers to repetitive support questions."
      },
      {
        title: "High Appointment No-Shows",
        description: "No automatic confirmations or multi-channel reminders mean clients forget their slots."
      }
    ]
  }
};
