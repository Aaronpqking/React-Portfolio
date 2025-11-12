import { useState, useRef, useEffect } from 'react';
import { Button, Card, Form, InputGroup, Alert } from 'react-bootstrap';
import { chatWithIntakeSpecialist, isAPIAvailable } from '../../services/aiService';
import { getDemoChatResponse } from '../../services/demoService';
import { extractIntakeData, hasEnoughIntakeData, saveIntakeData, generateCalendarLink } from '../../services/intakeService';
import { trackAIUsage } from '../../utils/AIUtils';
import './AIChatWidget.css';

export default function AIChatWidget({ onExpand }) {
  const [isOpen, setIsOpen] = useState(false);
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
          <strong>AI Intake Specialist</strong>
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
        {showScheduleOption && (
          <Alert variant="success" className="mb-0 mt-3">
            <div className="small">
              <strong>Great! I have enough information.</strong> Would you like to schedule a discovery call?
            </div>
            <Button
              size="sm"
              variant="success"
              className="mt-2"
              onClick={handleScheduleCall}
            >
              Schedule Discovery Call
            </Button>
          </Alert>
        )}
        {intakeSaved && !showScheduleOption && (
          <Alert variant="info" className="mb-0 mt-3 small">
            Your information has been saved. We'll be in touch soon!
          </Alert>
        )}
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

