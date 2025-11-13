/**
 * AI Service - Real AI API Integration
 * Handles calls to OpenAI, Anthropic, and other AI services
 */

const API_BASE_URL = process.env.REACT_APP_AI_API_BASE_URL || '';

/**
 * Check if API is available
 */
export const isAPIAvailable = () => {
  return !!(process.env.REACT_APP_OPENAI_API_KEY || process.env.REACT_APP_ANTHROPIC_API_KEY);
};

/**
 * Call OpenAI API
 */
export const callOpenAI = async (messages, options = {}) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const {
    model = 'gpt-4o-mini',
    temperature = 0.7,
    maxTokens = 1000,
    stream = false
  } = options;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

/**
 * Call Anthropic API
 */
export const callAnthropic = async (messages, options = {}) => {
  const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }

  const {
    model = 'claude-3-5-sonnet-20241022',
    maxTokens = 1000,
    temperature = 0.7
  } = options;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature,
        messages
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Anthropic API error');
    }

    const data = await response.json();
    return data.content[0]?.text || '';
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw error;
  }
};

/**
 * Generic AI chat function (tries OpenAI first, falls back to Anthropic)
 */
export const chatWithAI = async (messages, options = {}) => {
  const preferredProvider = options.provider || 'openai';
  
  try {
    if (preferredProvider === 'openai' && process.env.REACT_APP_OPENAI_API_KEY) {
      return await callOpenAI(messages, options);
    } else if (preferredProvider === 'anthropic' && process.env.REACT_APP_ANTHROPIC_API_KEY) {
      return await callAnthropic(messages, options);
    } else if (process.env.REACT_APP_OPENAI_API_KEY) {
      return await callOpenAI(messages, options);
    } else if (process.env.REACT_APP_ANTHROPIC_API_KEY) {
      return await callAnthropic(messages, options);
    } else {
      throw new Error('No AI API key configured');
    }
  } catch (error) {
    console.error('AI chat error:', error);
    throw error;
  }
};

/**
 * Chat with intake specialist role
 */
export const chatWithIntakeSpecialist = async (messages, intakeData = {}) => {
  const systemPrompt = `You are an AI intake specialist for a technology consultancy that helps small to midsize businesses with AI automation, custom development, system integration, and technical consulting.

Your role is to:
1. Have a natural, friendly conversation with potential clients
2. Gather key information naturally through conversation:
   - Name and contact information (email, phone)
   - Company name
   - Their business challenges and pain points
   - What solutions they're interested in (AI automation, custom development, integration, consulting)
   - Budget range (if they're comfortable sharing)
   - Timeline/urgency
3. Ask follow-up questions to understand their needs better
4. When you have enough information (name/email + company + some context about needs), offer to schedule a discovery call
5. Be conversational and helpful - don't make it feel like a form

Current information gathered:
${JSON.stringify(intakeData, null, 2)}

Keep responses concise (2-3 sentences typically), friendly, and professional. Ask one question at a time. When you have enough info, suggest scheduling a discovery call.`;

  const messagesWithSystem = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];

  return await chatWithAI(messagesWithSystem, {
    temperature: 0.7,
    maxTokens: 300
  });
};

/**
 * Get expert project estimation with enablement focus
 */
export const getExpertProjectEstimate = async (projectData, conversationHistory = []) => {
  const systemPrompt = `You are an expert, pragmatic, action-oriented problem solver working for a technology consultancy. You embody multiple expert perspectives:

**Your Expertise:**
- CEO/Founder: Business strategy, ROI, growth, market positioning
- Investor: Risk assessment, scalability, exit potential, capital efficiency
- Teacher/Enablement: Education, knowledge transfer, empowering clients to make informed decisions
- CTO: Technical architecture, scalability, security, tech stack selection
- Senior Developer: Implementation reality, development practices, code quality
- Social/Business: Team dynamics, change management, adoption strategies

**Your Mission:**
Help small to midsize businesses define realistic, budget-appropriate solutions that actually work for them. You're heavy on enablement - teaching them what's possible, what's realistic, and empowering them to make good decisions.

**Your Approach:**
1. Understand their REAL business problem (not just what they think they need)
2. Define realistic expectations for implementation (time, cost, complexity)
3. Recommend a tech stack that fits their budget AND their capabilities
4. Suggest alternative business solutions they might not have considered
5. Enable them with knowledge so they can make informed decisions
6. Be pragmatic - focus on what will actually work, not what sounds impressive

**Key Principles:**
- Budget constraints are real - work within them, don't just say "you need more money"
- Implementation reality matters - consider their team, timeline, and capabilities
- Enablement over dependency - teach them, don't just sell them
- Multiple solutions exist - suggest alternatives if their initial idea isn't optimal
- Realistic expectations prevent disappointment - be honest about timelines and challenges

Current project data:
${JSON.stringify(projectData, null, 2)}

Provide a comprehensive estimate that includes:
1. Realistic cost range (min, max, currency)
2. Realistic timeline with phases
3. Recommended tech stack (budget-appropriate, capability-appropriate)
4. Implementation approach (phased, realistic)
5. Alternative solutions they should consider
6. What they need to know (enablement/education)
7. Realistic expectations (what to expect, what challenges they'll face)
8. Next steps

Be honest, educational, and empowering. Help them make the right decision, not just get a quote.`;

  const prompt = `Based on this project information, provide an expert, pragmatic estimate:

Project Type: ${projectData.projectType}
Features: ${projectData.features?.join(', ') || 'Standard features'}
Additional Requirements: ${projectData.customFeatures || 'None'}
Budget Range: ${projectData.budget || 'Not specified'}
Timeline Preference: ${projectData.timeline || 'Not specified'}
Description: ${projectData.description || 'Not provided'}

Provide a comprehensive, enablement-focused estimate.`;

  try {
    const response = await chatWithAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ], {
      temperature: 0.6,
      maxTokens: 2000
    });

    // Try to parse structured data from response
    return parseExpertEstimate(response, projectData);
  } catch (error) {
    console.error('Expert estimate error:', error);
    throw error;
  }
};

/**
 * Parse expert estimate response into structured format
 */
const parseExpertEstimate = (response, projectData) => {
  // Try to extract structured data
  const costMatch = response.match(/\$?(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*[-–—]\s*\$?(\d{1,3}(?:,\d{3})*(?:k|K)?)/);
  const timelineMatch = response.match(/(\d+)\s*[-–—]?\s*(\d+)?\s*weeks?/i);
  
  let minCost = 15000;
  let maxCost = 35000;
  let weeks = 8;

  if (costMatch) {
    const parseCost = (str) => {
      const num = parseInt(str.replace(/[,$kK]/g, ''));
      return str.toLowerCase().includes('k') ? num * 1000 : num;
    };
    minCost = parseCost(costMatch[1]);
    maxCost = parseCost(costMatch[2] || costMatch[1]);
  }

  if (timelineMatch) {
    weeks = parseInt(timelineMatch[1]);
    if (timelineMatch[2]) {
      weeks = Math.round((parseInt(timelineMatch[1]) + parseInt(timelineMatch[2])) / 2);
    }
  }

  // Extract tech stack recommendations
  const stackMatch = response.match(/tech stack[:\n]+([^\n]+(?:\n[^\n]+){0,5})/i);
  const recommendedStack = stackMatch 
    ? stackMatch[1].split(/[,•\n-]/).map(s => s.trim()).filter(s => s.length > 0).slice(0, 8)
    : ['React', 'Node.js', 'PostgreSQL', 'Cloud hosting'];

  // Extract alternative solutions
  const altMatch = response.match(/alternative[^:]*:?\s*([^\n]+(?:\n[^\n]+){0,3})/i);
  const alternatives = altMatch 
    ? altMatch[1].split(/[•\n-]/).map(s => s.trim()).filter(s => s.length > 10).slice(0, 3)
    : [];

  // Extract key learnings/enablement
  const learningMatch = response.match(/(?:what you need to know|key learnings|important to understand)[:\n]+([^\n]+(?:\n[^\n]+){0,3})/i);
  const keyLearnings = learningMatch 
    ? learningMatch[1].split(/[•\n-]/).map(s => s.trim()).filter(s => s.length > 10).slice(0, 3)
    : [];

  return {
    estimatedCost: {
      min: minCost,
      max: maxCost,
      currency: 'USD'
    },
    estimatedTimeline: {
      weeks: weeks,
      range: `${Math.round(weeks * 0.8)}-${Math.round(weeks * 1.2)} weeks`
    },
    recommendedStack: recommendedStack,
    recommendedApproach: extractSection(response, 'approach', 'recommended approach'),
    alternatives: alternatives.length > 0 ? alternatives : ['Consider starting with MVP to validate approach', 'Explore no-code/low-code options for faster initial deployment'],
    keyLearnings: keyLearnings.length > 0 ? keyLearnings : ['Start with core features and iterate', 'Plan for maintenance and updates'],
    realisticExpectations: extractSection(response, 'expectations', 'realistic expectations'),
    nextSteps: [
      'Review this estimate and recommendations',
      'Schedule a discovery call to refine approach',
      'Consider starting with a proof of concept (optional)',
      'Proceed with phased implementation'
    ],
    fullAnalysis: response,
    confidence: 'high'
  };
};

const extractSection = (text, ...keywords) => {
  for (const keyword of keywords) {
    const regex = new RegExp(`${keyword}[:\n]+([^\n]+(?:\n[^\n]+){0,5})`, 'i');
    const match = text.match(regex);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
};

/**
 * Chat with Project Advisor - conversational expert advisor
 */
export const chatWithProjectAdvisor = async (messages, intakeData = {}, context = {}) => {
  const { caseStudies = '', quickAutomations = '', conversationContext = {} } = context;
  
  const systemPrompt = `You are an expert, pragmatic, action-oriented problem solver working for a technology consultancy. You embody multiple expert perspectives:

**Your Expertise:**
- CEO/Founder: Business strategy, ROI, growth, market positioning
- Investor: Risk assessment, scalability, exit potential, capital efficiency
- Teacher/Enablement: Education, knowledge transfer, empowering clients to make informed decisions
- CTO: Technical architecture, scalability, security, tech stack selection
- Senior Developer: Implementation reality, development practices, code quality
- Social/Business: Team dynamics, change management, adoption strategies

**Your Mission:**
Help small to midsize businesses define realistic, budget-appropriate solutions that actually work for them. You're heavy on enablement - teaching them what's possible, what's realistic, and empowering them to make good decisions.

**Your Approach:**
1. Understand their REAL business problem (not just what they think they need)
2. Ask about what's worked and what hasn't worked for them (if not already known)
3. Assess their readiness/appetite for change through conversation
4. Define realistic expectations for implementation (time, cost, complexity) - include "bloat time" for excellence
5. Recommend solutions that fit their budget AND their capabilities
6. Suggest relevant case studies and quick automations
7. Educate on industry standards based on their current understanding
8. Always defer specific pricing to discovery meeting - use broad ranges only

**Pricing Guidelines (BROAD RANGES ONLY - defer specifics to discovery meeting):**
- POCs (Proof of Concepts): Under $15k
- Implementations: 12-16 weeks (give or take 6-8 weeks), $15-35k
- Full custom builds: $35k+
- Always say: "Exact pricing will be determined in our discovery meeting based on your specific requirements"

**Timeline Guidelines:**
- Include "bloat time" for excellence in delivery (add 20-30% buffer for quality)
- Be realistic about implementation complexity
- Consider their team's capabilities and change readiness

**Intake Data Available:**
${intakeData ? JSON.stringify(intakeData, null, 2) : 'No intake data available - gather information through conversation'}

**Relevant Case Studies:**
${caseStudies || 'No specific case studies matched - use general examples'}

**Quick Automation Suggestions:**
${quickAutomations || 'No specific automations matched - suggest generic templates'}

**Conversation Context:**
${JSON.stringify(conversationContext, null, 2)}

**Key Principles:**
- Budget constraints are real - work within them, don't just say "you need more money"
- Implementation reality matters - consider their team, timeline, and capabilities
- Enablement over dependency - teach them, don't just sell them
- Multiple solutions exist - suggest alternatives if their initial idea isn't optimal
- Realistic expectations prevent disappointment - be honest about timelines and challenges
- Always assess understanding before educating - don't assume they know industry standards
- Change readiness matters - assess appetite for change and tailor recommendations
- Reference case studies naturally when relevant
- Suggest quick automations that can provide immediate value

**Conversation Style:**
- Be conversational and friendly, not robotic
- Ask follow-up questions to understand what's worked/hasn't worked
- Assess change readiness through natural questions
- Educate based on their current understanding level
- Reference case studies and quick automations naturally in conversation
- Use broad pricing ranges, always defer specifics to discovery meeting

Keep responses concise (2-4 sentences typically), educational, and empowering. Help them make the right decision, not just get a quote.`;

  const messagesWithSystem = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];

  return await chatWithAI(messagesWithSystem, {
    temperature: 0.7,
    maxTokens: 500
  });
};

/**
 * Get structured output from AI (for project estimates, tech recommendations, etc.)
 */
export const getStructuredAIResponse = async (prompt, schema, options = {}) => {
  const systemPrompt = `You are a helpful AI assistant. Respond with valid JSON that matches this schema: ${JSON.stringify(schema)}. Only return the JSON, no additional text.`;
  
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt }
  ];

  try {
    const response = await chatWithAI(messages, {
      ...options,
      temperature: 0.3, // Lower temperature for more consistent structured output
      maxTokens: 2000
    });

    // Try to parse JSON from response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse structured response:', parseError);
    }

    return { error: 'Failed to parse structured response', raw: response };
  } catch (error) {
    console.error('Structured AI response error:', error);
    throw error;
  }
};

/**
 * Stream AI response (for real-time chat)
 */
export const streamAIResponse = async (messages, onChunk, options = {}) => {
  // This would require Server-Sent Events or WebSocket
  // For now, simulate streaming with chunks
  try {
    const response = await chatWithAI(messages, { ...options, stream: false });
    const words = response.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      onChunk(words.slice(0, i + 1).join(' '));
    }
  } catch (error) {
    console.error('Stream error:', error);
    throw error;
  }
};

