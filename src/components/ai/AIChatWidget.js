import { useState, useRef, useEffect } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { chatWithAI, isAPIAvailable } from '../../services/aiService';
import { getDemoChatResponse } from '../../services/demoService';
import { trackAIUsage } from '../../utils/AIUtils';
import './AIChatWidget.css';

export default function AIChatWidget({ onExpand }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! 👋 I\'m your AI assistant. I can help you learn about our services, get project estimates, or answer questions. What would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      let response;
      const useRealAI = isAPIAvailable();

      if (useRealAI) {
        trackAIUsage('chat', 'api_call', { message: userMessage });
        response = await chatWithAI([
          {
            role: 'system',
            content: 'You are a helpful AI assistant for a technology consultancy that helps small to midsize businesses with AI automation, custom development, system integration, and technical consulting. Be friendly, professional, and helpful. Keep responses concise but informative.'
          },
          ...newMessages.map(m => ({ role: m.role, content: m.content }))
        ]);
      } else {
        trackAIUsage('chat', 'demo_mode', { message: userMessage });
        response = await getDemoChatResponse(userMessage);
      }

      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again or contact us directly through the contact form.'
        }
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  if (!isOpen) {
    return (
      <div className="ai-chat-widget-closed">
        <Button
          variant="primary"
          className="chat-toggle-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI chat"
        >
          <span className="chat-icon">💬</span>
          <span className="chat-label">AI Assistant</span>
        </Button>
      </div>
    );
  }

  return (
    <Card className="ai-chat-widget">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <strong>AI Assistant</strong>
          {!isAPIAvailable() && (
            <span className="badge bg-secondary ms-2" style={{ fontSize: '0.7rem' }}>Demo</span>
          )}
        </div>
        <div>
          {onExpand && (
            <Button
              variant="link"
              size="sm"
              onClick={onExpand}
              className="p-0 me-2"
              title="Expand to full page"
            >
              ⛶
            </Button>
          )}
          <Button
            variant="link"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="p-0"
            aria-label="Close chat"
          >
            ✕
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}
          >
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message message-assistant">
            <div className="message-content">
              <span className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </Card.Body>
      <Card.Footer>
        <Form onSubmit={handleSend}>
          <InputGroup>
            <Form.Control
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button
              variant="primary"
              type="submit"
              disabled={!input.trim() || isLoading}
            >
              Send
            </Button>
          </InputGroup>
        </Form>
      </Card.Footer>
    </Card>
  );
}

