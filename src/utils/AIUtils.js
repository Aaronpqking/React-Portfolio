/**
 * AI Utility Functions
 * Shared utilities for AI features
 */

/**
 * Simulate typing delay for realistic demo experience
 */
export const simulateTyping = async (text, callback, speed = 30) => {
  for (let i = 0; i < text.length; i++) {
    await new Promise(resolve => setTimeout(resolve, speed));
    callback(text.slice(0, i + 1));
  }
};

/**
 * Format AI response with markdown-like styling
 */
export const formatAIResponse = (text) => {
  // Convert markdown-style formatting to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br />');
};

/**
 * Extract structured data from AI response
 */
export const extractStructuredData = (text, schema) => {
  try {
    // Try to find JSON in the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('Error extracting structured data:', error);
    return null;
  }
};

/**
 * Validate API key presence
 */
export const hasAPIKey = (service = 'openai') => {
  const key = service === 'openai' 
    ? process.env.REACT_APP_OPENAI_API_KEY
    : process.env.REACT_APP_ANTHROPIC_API_KEY;
  return !!key;
};

/**
 * Debounce function for API calls
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Generate unique session ID
 */
export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Save to local storage with expiration
 */
export const saveToStorage = (key, data, expirationHours = 24) => {
  const item = {
    data,
    timestamp: Date.now(),
    expiration: expirationHours * 60 * 60 * 1000
  };
  localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Load from local storage with expiration check
 */
export const loadFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    const now = Date.now();
    
    if (now - parsed.timestamp > parsed.expiration) {
      localStorage.removeItem(key);
      return null;
    }
    
    return parsed.data;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return null;
  }
};

/**
 * Track AI feature usage
 */
export const trackAIUsage = (feature, action, metadata = {}) => {
  console.log('ai_tool_used', {
    feature,
    action,
    ...metadata,
    timestamp: new Date().toISOString()
  });
  
  // Here you would send to your analytics service
  // Example: analytics.track('ai_tool_used', { feature, action, ...metadata });
};

