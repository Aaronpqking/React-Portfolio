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

