/**
 * Intake Service - Manages lead intake data collection from chat
 */

/**
 * Extract information from conversation messages
 */
export const extractIntakeData = (messages) => {
  const intakeData = {
    name: '',
    email: '',
    company: '',
    phone: '',
    interest: 'general',
    message: '',
    solutions: [],
    painPoints: [],
    budget: '',
    timeline: '',
    source: 'ai_chat'
  };

  const conversationText = messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n')
    .toLowerCase();

  // Extract name patterns
  const namePatterns = [
    /(?:my name is|i'm|i am|call me|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /(?:name:?\s*)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i
  ];
  for (const pattern of namePatterns) {
    const match = conversationText.match(pattern);
    if (match && !intakeData.name) {
      intakeData.name = match[1].trim();
      break;
    }
  }

  // Extract email
  const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const emailMatch = conversationText.match(emailPattern);
  if (emailMatch) {
    intakeData.email = emailMatch[1];
  }

  // Extract phone
  const phonePatterns = [
    /(?:phone|call|contact).*?(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/i,
    /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/
  ];
  for (const pattern of phonePatterns) {
    const match = conversationText.match(pattern);
    if (match) {
      intakeData.phone = match[1].replace(/[-.\s]/g, '');
      break;
    }
  }

  // Extract company
  const companyPatterns = [
    /(?:company|business|organization|firm|work for|at)\s+([A-Z][a-zA-Z\s&]+)/i,
    /(?:i work at|we are|we're)\s+([A-Z][a-zA-Z\s&]+)/i
  ];
  for (const pattern of companyPatterns) {
    const match = conversationText.match(pattern);
    if (match && match[1].length < 50) {
      intakeData.company = match[1].trim();
      break;
    }
  }

  // Extract interest/solutions discussed
  const solutionKeywords = {
    'ai-automation': ['ai', 'automation', 'workflow', 'agent', 'rag', 'llm'],
    'custom-development': ['custom', 'development', 'application', 'app', 'build', 'software'],
    'system-integration': ['integration', 'api', 'connect', 'sync', 'integrate'],
    'consulting': ['consulting', 'advice', 'guidance', 'architecture', 'review']
  };

  for (const [interest, keywords] of Object.entries(solutionKeywords)) {
    if (keywords.some(keyword => conversationText.includes(keyword))) {
      if (!intakeData.solutions.includes(interest)) {
        intakeData.solutions.push(interest);
      }
    }
  }

  // Extract budget
  const budgetPatterns = [
    /(?:budget|spend|cost|price).*?(\$?\d{1,3}(?:,\d{3})*(?:k|thousand)?)/i,
    /(\$?\d{1,3}(?:,\d{3})*(?:k|thousand)?).*?(?:budget|spend|cost)/
  ];
  for (const pattern of budgetPatterns) {
    const match = conversationText.match(pattern);
    if (match) {
      intakeData.budget = match[1];
      break;
    }
  }

  // Extract timeline
  const timelinePatterns = [
    /(?:timeline|when|need|asap|urgent|soon|month|week)/i
  ];
  if (timelinePatterns.some(p => p.test(conversationText))) {
    if (conversationText.includes('urgent') || conversationText.includes('asap')) {
      intakeData.timeline = 'urgent';
    } else if (conversationText.includes('month')) {
      intakeData.timeline = 'normal';
    } else {
      intakeData.timeline = 'flexible';
    }
  }

  // Extract pain points
  const painKeywords = ['problem', 'issue', 'challenge', 'struggling', 'difficult', 'pain', 'bottleneck'];
  const sentences = conversationText.split(/[.!?]/);
  sentences.forEach(sentence => {
    if (painKeywords.some(keyword => sentence.includes(keyword))) {
      const painPoint = sentence.trim();
      if (painPoint.length > 10 && painPoint.length < 200) {
        intakeData.painPoints.push(painPoint);
      }
    }
  });

  // Set primary interest
  if (intakeData.solutions.length > 0) {
    intakeData.interest = intakeData.solutions[0];
  }

  // Compile message from conversation
  intakeData.message = messages
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join('\n\n')
    .substring(0, 2000);

  return intakeData;
};

/**
 * Check if enough information is gathered for intake
 */
export const hasEnoughIntakeData = (intakeData) => {
  // Minimum required: name and email OR company and email
  const hasContactInfo = (intakeData.name && intakeData.email) || 
                         (intakeData.company && intakeData.email);
  
  // Should have at least some context about needs
  const hasContext = intakeData.message.length > 50 || 
                     intakeData.solutions.length > 0 ||
                     intakeData.painPoints.length > 0;

  return hasContactInfo && hasContext;
};

/**
 * Save intake data (equivalent to form submission)
 */
export const saveIntakeData = async (intakeData) => {
  try {
    // Analytics tracking
    console.log('lead_capture_submit', {
      source: 'ai_chat_intake',
      ...intakeData
    });

    // TODO: Replace with your actual API endpoint
    // const response = await fetch('/api/leads', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(intakeData)
    // });

    // For now, also save to localStorage as backup
    const existingLeads = JSON.parse(localStorage.getItem('ai_intake_leads') || '[]');
    existingLeads.push({
      ...intakeData,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('ai_intake_leads', JSON.stringify(existingLeads.slice(-50))); // Keep last 50

    return { success: true, data: intakeData };
  } catch (error) {
    console.error('Error saving intake data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate calendar link for appointment
 */
export const generateCalendarLink = (intakeData) => {
  const subject = encodeURIComponent(`Discovery Call - ${intakeData.name || intakeData.company || 'New Lead'}`);
  const details = encodeURIComponent(
    `Discovery call with ${intakeData.name || 'lead'}\n\n` +
    `Company: ${intakeData.company || 'Not provided'}\n` +
    `Email: ${intakeData.email}\n` +
    `Phone: ${intakeData.phone || 'Not provided'}\n\n` +
    `Interest: ${intakeData.interest}\n` +
    `Solutions discussed: ${intakeData.solutions.join(', ') || 'General inquiry'}\n\n` +
    `Context:\n${intakeData.message.substring(0, 500)}`
  );
  
  // Google Calendar link
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1); // Tomorrow
  startDate.setHours(10, 0, 0, 0); // 10 AM
  
  const endDate = new Date(startDate);
  endDate.setHours(11, 0, 0, 0); // 11 AM
  
  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${subject}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}`;
};

/**
 * Load latest intake data from localStorage
 */
export const loadLatestIntakeData = () => {
  try {
    const storedLeads = JSON.parse(localStorage.getItem('ai_intake_leads') || '[]');
    if (storedLeads.length > 0) {
      // Return most recent lead (last in array)
      return storedLeads[storedLeads.length - 1];
    }
    return null;
  } catch (error) {
    console.error('Error loading intake data:', error);
    return null;
  }
};

/**
 * Check if intake data exists
 */
export const hasIntakeData = () => {
  try {
    const storedLeads = JSON.parse(localStorage.getItem('ai_intake_leads') || '[]');
    return storedLeads.length > 0;
  } catch (error) {
    return false;
  }
};

