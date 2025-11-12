/**
 * Demo Service - Realistic AI Simulation
 * Provides realistic demo responses without API calls
 */

/**
 * Simulate API delay
 */
const simulateDelay = (min = 1000, max = 3000) => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Get demo response for chat assistant
 */
export const getDemoChatResponse = async (userMessage) => {
  await simulateDelay(1500, 2500);
  
  const lowerMessage = userMessage.toLowerCase();
  
  // Pattern matching for common questions
  if (lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
    return `Our pricing is tailored to each project's specific needs. For small to midsize businesses, we typically work with budgets ranging from $5,000 to $50,000+ depending on scope.

**Common Project Types:**
- AI Automation: $10,000 - $30,000
- Custom Development: $15,000 - $50,000
- System Integration: $8,000 - $25,000
- Technical Consulting: $150 - $250/hour

We offer free consultations to discuss your specific needs and provide a detailed estimate. Would you like to schedule a call?`;
  }
  
  if (lowerMessage.includes('service') || lowerMessage.includes('what do you do') || lowerMessage.includes('offer')) {
    return `We specialize in AI-powered solutions and custom development for small to midsize businesses. Here's what we offer:

**🤖 AI & Automation**
- RAG systems and knowledge graphs
- Workflow automation
- Intelligent agents

**💻 Custom Development**
- Full-stack web applications
- Cloud-native solutions
- API development

**🔗 System Integration**
- Third-party API connections
- Data pipeline creation
- Platform integrations

**📊 Technical Consulting**
- Architecture reviews
- Technology selection
- Team mentoring

Would you like to learn more about any specific service?`;
  }
  
  if (lowerMessage.includes('timeline') || lowerMessage.includes('how long') || lowerMessage.includes('duration')) {
    return `Project timelines vary based on complexity, but here are typical ranges:

**Quick Wins (2-4 weeks):**
- Simple automation workflows
- Basic integrations
- MVP development

**Standard Projects (4-8 weeks):**
- Custom applications
- AI agent implementation
- Multi-system integration

**Complex Projects (8-16 weeks):**
- Enterprise-grade solutions
- Advanced AI systems
- Full platform development

We prioritize fast time-to-value and can often deliver working prototypes within 2-3 weeks. Want to discuss your timeline?`;
  }
  
  if (lowerMessage.includes('experience') || lowerMessage.includes('portfolio') || lowerMessage.includes('case study')) {
    return `We've delivered 50+ successful projects for SMBs across various industries. You can view detailed case studies on our website:

**Featured Projects:**
- Digital Events: Ops Agent & Logistics Dashboard
- Grant AI: Discovery & Narrative Drafting
- Eleanor AI: Productivity Assistant

Each case study includes the problem, solution, tech stack, and outcomes. Check them out at /case-studies!

Would you like to see a case study similar to what you're looking for?`;
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hello! 👋 I'm here to help you learn about our AI and development services.

I can answer questions about:
- Our services and capabilities
- Pricing and timelines
- Technology recommendations
- Project estimates

What would you like to know?`;
  }
  
  // Default response
  return `Thanks for your question! I'd be happy to help you learn more about our services.

**Quick Links:**
- View our case studies: /case-studies
- Get a project estimate: Try our AI Project Estimator
- Schedule a consultation: Click "Get Started" in the header

For more specific questions, I recommend scheduling a free consultation call where we can discuss your needs in detail. Would you like to do that?`;
};

/**
 * Get demo project estimate
 */
export const getDemoProjectEstimate = async (projectData) => {
  await simulateDelay(2000, 3500);
  
  const { projectType, features, timeline, budget } = projectData;
  
  // Simple estimation logic
  let baseCost = 0;
  let baseTimeline = 0;
  
  switch (projectType) {
    case 'ai-automation':
      baseCost = 15000;
      baseTimeline = 6;
      break;
    case 'custom-development':
      baseCost = 25000;
      baseTimeline = 8;
      break;
    case 'system-integration':
      baseCost = 12000;
      baseTimeline = 5;
      break;
    case 'consulting':
      baseCost = 5000;
      baseTimeline = 2;
      break;
    default:
      baseCost = 20000;
      baseTimeline = 6;
  }
  
  // Adjust based on features count
  const featureMultiplier = Math.max(1, features.length / 5);
  const cost = Math.round(baseCost * featureMultiplier);
  const estimatedTimelineWeeks = Math.round(baseTimeline * featureMultiplier);
  
  return {
    estimatedCost: {
      min: Math.round(cost * 0.8),
      max: Math.round(cost * 1.2),
      currency: 'USD'
    },
    estimatedTimeline: {
      weeks: estimatedTimelineWeeks,
      range: `${Math.round(estimatedTimelineWeeks * 0.8)}-${Math.round(estimatedTimelineWeeks * 1.2)} weeks`
    },
    recommendedApproach: projectType === 'ai-automation' 
      ? 'Agile development with 2-week sprints, starting with MVP in 4 weeks'
      : 'Phased approach with weekly check-ins and iterative improvements',
    nextSteps: [
      'Schedule a discovery call to refine requirements',
      'Review detailed proposal and timeline',
      'Begin with a 2-week proof of concept (optional)',
      'Proceed with full development'
    ],
    confidence: 'high'
  };
};

/**
 * Get demo tech stack recommendation
 */
export const getDemoTechStackRecommendation = async (requirements) => {
  await simulateDelay(2000, 3000);
  
  const { industry, scale, budget, currentStack } = requirements;
  
  const recommendations = {
    frontend: scale === 'small' ? 'React + Vite' : 'Next.js',
    backend: budget === 'low' ? 'Supabase' : 'Node.js + Express',
    database: scale === 'small' ? 'PostgreSQL (Supabase)' : 'PostgreSQL + Redis',
    ai: 'OpenAI API + LangChain',
    deployment: 'Vercel',
    additional: []
  };
  
  if (industry === 'ecommerce') {
    recommendations.additional.push('Stripe for payments', 'Shopify API integration');
  }
  
  if (scale === 'large') {
    recommendations.additional.push('Docker for containerization', 'Kubernetes for orchestration');
  }
  
  return {
    recommendedStack: recommendations,
    rationale: `Based on your ${industry} industry and ${scale} scale, I recommend this stack for optimal performance and cost-effectiveness.`,
    alternatives: [
      {
        option: 'Full Serverless',
        stack: ['Next.js', 'Vercel Functions', 'Supabase', 'OpenAI'],
        pros: ['Lower operational overhead', 'Auto-scaling'],
        cons: ['Vendor lock-in', 'Cold starts']
      }
    ],
    estimatedCost: {
      monthly: budget === 'low' ? '$50-200' : budget === 'medium' ? '$200-500' : '$500-1000+',
      setup: '$0-5000'
    }
  };
};

/**
 * Get demo workflow analysis
 */
export const getDemoWorkflowAnalysis = async (workflowDescription) => {
  await simulateDelay(2500, 4000);
  
  return {
    currentIssues: [
      'Manual data entry creates bottlenecks',
      'Multiple systems require duplicate data entry',
      'No automated notifications for status changes'
    ],
    recommendations: [
      {
        priority: 'high',
        suggestion: 'Automate data synchronization between systems',
        impact: 'Reduces manual work by 60%',
        effort: '2-3 weeks'
      },
      {
        priority: 'medium',
        suggestion: 'Implement automated status notifications',
        impact: 'Improves response time by 40%',
        effort: '1-2 weeks'
      },
      {
        priority: 'low',
        suggestion: 'Add workflow analytics dashboard',
        impact: 'Provides visibility into bottlenecks',
        effort: '2-3 weeks'
      }
    ],
    automationOpportunities: [
      'Email parsing and data extraction',
      'Automated task assignment based on rules',
      'Scheduled report generation'
    ],
    estimatedSavings: {
      time: '15-20 hours/week',
      cost: '$2,000-3,000/month'
    }
  };
};

/**
 * Get demo proposal draft
 */
export const getDemoProposalDraft = async (projectBrief) => {
  await simulateDelay(3000, 4500);
  
  return {
    title: `Project Proposal: ${projectBrief.projectName || 'Custom Solution'}`,
    sections: [
      {
        title: 'Executive Summary',
        content: `This proposal outlines a comprehensive solution to address ${projectBrief.requirements || 'your business needs'}. Our approach combines modern technology with proven methodologies to deliver measurable results.`
      },
      {
        title: 'Problem Statement',
        content: projectBrief.problem || 'Current processes are manual and time-consuming, limiting scalability and efficiency.'
      },
      {
        title: 'Proposed Solution',
        content: `We propose a ${projectBrief.solutionType || 'custom AI-powered solution'} that will automate workflows, integrate systems, and provide actionable insights.`
      },
      {
        title: 'Technical Approach',
        content: 'Our solution will leverage modern cloud technologies, AI/ML capabilities, and best practices in software development.'
      },
      {
        title: 'Timeline & Milestones',
        content: 'Phase 1: Discovery & Planning (2 weeks)\nPhase 2: Development (6-8 weeks)\nPhase 3: Testing & Deployment (2 weeks)'
      },
      {
        title: 'Investment',
        content: 'Detailed pricing will be provided after discovery call based on specific requirements.'
      }
    ],
    nextSteps: [
      'Review and discuss proposal',
      'Clarify any questions or concerns',
      'Finalize scope and timeline',
      'Begin project kickoff'
    ]
  };
};

/**
 * Get demo email draft
 */
export const getDemoEmailDraft = async (emailParams) => {
  await simulateDelay(1500, 2500);
  
  const { purpose, tone, keyPoints, recipientType } = emailParams;
  
  const templates = {
    professional: `Subject: ${purpose}

Dear ${recipientType === 'client' ? 'Valued Client' : 'Team'},

I hope this message finds you well. I'm reaching out regarding ${purpose.toLowerCase()}.

${keyPoints.map(point => `• ${point}`).join('\n')}

I'd appreciate the opportunity to discuss this further at your earliest convenience. Please let me know a time that works for you.

Best regards,
[Your Name]`,
    
    friendly: `Subject: ${purpose}

Hi there,

I wanted to touch base about ${purpose.toLowerCase()}.

Here are the key points:
${keyPoints.map(point => `• ${point}`).join('\n')}

Let me know your thoughts!

Thanks,
[Your Name]`,
    
    formal: `Subject: ${purpose}

Dear ${recipientType === 'client' ? 'Sir/Madam' : 'Colleagues'},

I am writing to you regarding ${purpose.toLowerCase()}.

Key considerations:
${keyPoints.map(point => `• ${point}`).join('\n')}

I look forward to your response.

Sincerely,
[Your Name]`
  };
  
  return {
    drafts: [
      {
        tone: tone || 'professional',
        subject: purpose,
        body: templates[tone || 'professional']
      },
      {
        tone: 'friendly',
        subject: purpose,
        body: templates.friendly
      }
    ],
    suggestions: [
      'Personalize the greeting with the recipient\'s name',
      'Add a call-to-action if appropriate',
      'Include relevant context or background'
    ]
  };
};

