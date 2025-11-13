/**
 * Case Study Service - Provides relevant case studies and quick automation suggestions
 */
import { CASE_STUDIES } from '../data/caseStudies/index.js';

/**
 * Get relevant case studies based on solutions, pain points, and industry
 */
export const getRelevantCaseStudies = (intakeData = {}) => {
  const { solutions = [], painPoints = [], industry = '', message = '' } = intakeData;
  
  const allText = [
    ...solutions,
    ...painPoints,
    industry,
    message
  ].join(' ').toLowerCase();

  const relevant = CASE_STUDIES.filter(cs => {
    // Match by solution type
    const solutionMatch = solutions.some(sol => {
      if (sol === 'ai-automation') {
        return cs.tags?.some(tag => ['ai', 'automation', 'rag', 'agent'].includes(tag.toLowerCase()));
      }
      if (sol === 'custom-development') {
        return cs.stack?.some(tech => ['react', 'next.js', 'node'].includes(tech.toLowerCase()));
      }
      if (sol === 'system-integration') {
        return cs.tags?.some(tag => ['integration', 'api', 'workflow'].includes(tag.toLowerCase()));
      }
      return false;
    });

    // Match by pain points
    const painMatch = painPoints.some(pp => {
      const ppLower = pp.toLowerCase();
      return cs.problem.toLowerCase().includes(ppLower) || 
             cs.tags?.some(tag => ppLower.includes(tag.toLowerCase()));
    });

    // Match by keywords in message
    const messageMatch = cs.tags?.some(tag => allText.includes(tag.toLowerCase())) ||
                        cs.problem.toLowerCase().split(' ').some(word => 
                          allText.includes(word) && word.length > 4
                        );

    return solutionMatch || painMatch || messageMatch;
  });

  return relevant.length > 0 ? relevant : CASE_STUDIES.slice(0, 2); // Fallback to first 2
};

/**
 * Get quick automation suggestions based on case studies and generic templates
 */
export const getQuickAutomations = (intakeData = {}) => {
  const caseStudies = getRelevantCaseStudies(intakeData);
  const suggestions = [];

  // Map case studies to quick wins
  caseStudies.forEach(cs => {
    if (cs.slug === 'digital-events-ops-agent') {
      suggestions.push({
        type: 'case-study',
        title: 'Operations Dashboard & Data Visualization',
        description: 'Unified dashboard that converts unstructured data into structured insights',
        source: 'Digital Events Case Study',
        link: '/case-studies/digital-events-ops-agent',
        quickWin: 'Dashboard automation, data visualization, SLA tracking'
      });
    }
    if (cs.slug === 'grant-ai') {
      suggestions.push({
        type: 'case-study',
        title: 'Document Processing & Workflow Automation',
        description: 'AI-powered document analysis and workflow automation',
        source: 'Grant AI Case Study',
        link: '/case-studies/grant-ai',
        quickWin: 'Document processing, workflow automation, AI agents'
      });
    }
    if (cs.slug === 'eleanor-ai-assistant') {
      suggestions.push({
        type: 'case-study',
        title: 'Email & Calendar Automation',
        description: 'Intelligent email management and calendar optimization',
        source: 'Eleanor AI Case Study',
        link: '/case-studies/eleanor-ai-assistant',
        quickWin: 'Email automation, calendar management, productivity tools'
      });
    }
  });

  // Add generic quick automation templates
  const genericAutomations = [
    {
      type: 'generic',
      title: 'Email Parsing & Routing',
      description: 'Automatically parse incoming emails and route to appropriate team members or systems',
      quickWin: 'Reduces manual email handling by 60-80%'
    },
    {
      type: 'generic',
      title: 'Data Synchronization',
      description: 'Sync data between multiple systems (CRM, databases, spreadsheets) automatically',
      quickWin: 'Eliminates duplicate data entry, ensures consistency'
    },
    {
      type: 'generic',
      title: 'Automated Report Generation',
      description: 'Generate and distribute reports on schedule without manual intervention',
      quickWin: 'Saves 5-10 hours per week on report creation'
    },
    {
      type: 'generic',
      title: 'Workflow Notifications',
      description: 'Automated notifications for status changes, deadlines, and important events',
      quickWin: 'Improves response time and reduces missed deadlines'
    }
  ];

  // Add generic automations that aren't already covered by case studies
  const caseStudyQuickWins = suggestions.map(s => s.quickWin.toLowerCase());
  genericAutomations.forEach(gen => {
    const isDuplicate = caseStudyQuickWins.some(csqw => 
      gen.quickWin.toLowerCase().includes(csqw) || csqw.includes(gen.quickWin.toLowerCase())
    );
    if (!isDuplicate) {
      suggestions.push(gen);
    }
  });

  return suggestions.slice(0, 5); // Return top 5 suggestions
};

/**
 * Format case studies for AI prompt
 */
export const formatCaseStudiesForPrompt = (caseStudies) => {
  return caseStudies.map(cs => 
    `- ${cs.title}: ${cs.problem.substring(0, 150)}... Solution: ${cs.solution.substring(0, 100)}... Tags: ${cs.tags?.join(', ') || 'N/A'}`
  ).join('\n');
};

/**
 * Format quick automations for AI prompt
 */
export const formatQuickAutomationsForPrompt = (automations) => {
  return automations.map(aut => 
    `- ${aut.title}: ${aut.description} (${aut.quickWin})${aut.link ? ` [See case study: ${aut.link}]` : ''}`
  ).join('\n');
};



