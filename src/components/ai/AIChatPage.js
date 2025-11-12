import { useState, useRef, useEffect } from 'react';
import { Container, Button, Form, InputGroup, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { chatWithAI, isAPIAvailable } from '../../services/aiService';
import { getDemoChatResponse } from '../../services/demoService';
import { trackAIUsage } from '../../utils/AIUtils';
import './AIChatPage.css';

export default function AIChatPage() {
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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

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

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! 👋 I\'m your AI assistant. I can help you learn about our services, get project estimates, or answer questions. What would you like to know?'
      }
    ]);
  };

  return (
    <Container className="ai-chat-page py-5">
      <div className="mb-4">
        <Link to="/" className="text-muted text-decoration-none">
          ← Back to Home
        </Link>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div>
            <h1 className="h3 mb-1">AI Assistant</h1>
            <p className="text-muted mb-0">
              Ask me anything about our services, pricing, or get project estimates
              {!isAPIAvailable() && (
                <span className="badge bg-secondary ms-2">Demo Mode</span>
              )}
            </p>
          </div>
          <Button variant="outline-secondary" size="sm" onClick={handleClear}>
            Clear Chat
          </Button>
        </div>
      </div>

      <Card className="chat-container">
        <Card.Body className="chat-messages-container">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message-full ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}
            >
              <div className="message-avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content-full">
                <div className="message-text">{msg.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-full message-assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content-full">
                <div className="typing-indicator-full">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </Card.Body>
        <Card.Footer className="chat-input-container">
          <Form onSubmit={handleSend}>
            <InputGroup size="lg">
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
    </Container>
  );
}

