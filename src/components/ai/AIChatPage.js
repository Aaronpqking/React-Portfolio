import { useState, useRef, useEffect } from 'react';
import { Container, Button, Form, InputGroup, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { chatWithIntakeSpecialist, isAPIAvailable } from '../../services/aiService';
import { getDemoChatResponse } from '../../services/demoService';
import { extractIntakeData, hasEnoughIntakeData, saveIntakeData, generateCalendarLink } from '../../services/intakeService';
import { trackAIUsage } from '../../utils/AIUtils';
import './AIChatPage.css';

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! 👋 I\'m your AI intake specialist. I\'m here to learn about your business needs and see how we can help. What brings you here today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [intakeData, setIntakeData] = useState({});
  const [showScheduleOption, setShowScheduleOption] = useState(false);
  const [intakeSaved, setIntakeSaved] = useState(false);
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

      // Extract intake data from conversation
      const extractedData = extractIntakeData(newMessages);
      setIntakeData(extractedData);

      if (useRealAI) {
        trackAIUsage('chat', 'api_call', { message: userMessage });
        response = await chatWithIntakeSpecialist(newMessages, extractedData);
      } else {
        trackAIUsage('chat', 'demo_mode', { message: userMessage });
        response = await getDemoChatResponse(userMessage);
      }

      const updatedMessages = [...newMessages, { role: 'assistant', content: response }];
      setMessages(updatedMessages);

      // Check if we have enough data and offer to schedule
      const hasEnough = hasEnoughIntakeData(extractedData);
      if (hasEnough && !showScheduleOption && !intakeSaved) {
        setShowScheduleOption(true);
        // Auto-save intake data
        const saveResult = await saveIntakeData(extractedData);
        if (saveResult.success) {
          setIntakeSaved(true);
        }
      }
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

  const handleScheduleCall = () => {
    const calendarLink = generateCalendarLink(intakeData);
    window.open(calendarLink, '_blank', 'noopener,noreferrer');
    trackAIUsage('chat', 'schedule_call', intakeData);
    setShowScheduleOption(false);
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
            <h1 className="h3 mb-1">AI Intake Specialist</h1>
            <p className="text-muted mb-0">
              I'll learn about your business needs and help schedule a discovery call. No forms needed - just chat!
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
          {showScheduleOption && (
            <Alert variant="success" className="mb-0 mt-3">
              <div className="mb-2">
                <strong>Perfect! I have enough information to help you.</strong>
              </div>
              <div className="small mb-3">
                I've gathered:
                {intakeData.name && <div>• Name: {intakeData.name}</div>}
                {intakeData.email && <div>• Email: {intakeData.email}</div>}
                {intakeData.company && <div>• Company: {intakeData.company}</div>}
                {intakeData.solutions.length > 0 && <div>• Interests: {intakeData.solutions.join(', ')}</div>}
              </div>
              <div className="mb-2">
                Would you like to schedule a discovery call to discuss your needs in detail?
              </div>
              <Button
                variant="success"
                onClick={handleScheduleCall}
                className="me-2"
              >
                Schedule Discovery Call
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowScheduleOption(false)}
              >
                Continue Chatting
              </Button>
            </Alert>
          )}
          {intakeSaved && !showScheduleOption && (
            <Alert variant="info" className="mb-0 mt-3">
              <small>Your information has been saved. We'll be in touch soon!</small>
            </Alert>
          )}
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

