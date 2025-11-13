import { useState, useRef, useEffect } from 'react';
import { Container, Card, Form, Button, InputGroup, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { chatWithProjectAdvisor, isAPIAvailable } from '../../services/aiService';
import { getDemoProjectAdvisorResponse } from '../../services/demoService';
import { loadLatestIntakeData, hasIntakeData } from '../../services/intakeService';
import { getRelevantCaseStudies, getQuickAutomations, formatCaseStudiesForPrompt, formatQuickAutomationsForPrompt } from '../../services/caseStudyService';
import { trackAIUsage } from '../../utils/AIUtils';
import LeadCaptureModal from '../LeadCaptureModal';
import './ConversationalProjectAdvisor.css';

export default function ConversationalProjectAdvisor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [intakeData, setIntakeData] = useState(null);
  const [caseStudies, setCaseStudies] = useState([]);
  const [quickAutomations, setQuickAutomations] = useState([]);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [conversationContext, setConversationContext] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Load intake data on mount
    const loadedIntakeData = loadLatestIntakeData();
    if (loadedIntakeData) {
      setIntakeData(loadedIntakeData);
      // Get relevant case studies and quick automations
      const relevantCS = getRelevantCaseStudies(loadedIntakeData);
      const quickAutos = getQuickAutomations(loadedIntakeData);
      setCaseStudies(relevantCS);
      setQuickAutomations(quickAutos);
    }

    // Initialize conversation
    const welcomeMessage = loadedIntakeData
      ? `Hello! 👋 I see we've already chatted about ${loadedIntakeData.company || 'your business'}. I'm your Expert Project Advisor, here to help you define realistic solutions that work within your budget and capabilities.\n\nI'll ask you some questions to understand what's worked, what hasn't, and assess your readiness for change. Then I'll suggest relevant solutions and educate you on industry standards.\n\nLet's start: What's the main business problem you're trying to solve?`
      : `Hello! 👋 I'm your Expert Project Advisor. I work with small to midsize businesses to define realistic, budget-appropriate solutions.\n\nI'll help you understand:\n- What solutions fit your budget and capabilities\n- Industry standards for timelines and costs\n- What's worked (and what hasn't) for similar businesses\n- Your readiness for change\n- Quick automations you can implement\n\nLet's start: What's the main business problem you're trying to solve?`;

    setMessages([{ role: 'assistant', content: welcomeMessage }]);
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
    setError(null);

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    // Update conversation context
    const updatedContext = {
      ...conversationContext,
      lastUserMessage: userMessage,
      messageCount: newMessages.length
    };
    setConversationContext(updatedContext);

    try {
      const useRealAI = isAPIAvailable();
      trackAIUsage('project_advisor', useRealAI ? 'api_call' : 'demo_mode');

      // Prepare context for AI
      const caseStudiesText = caseStudies.length > 0 
        ? formatCaseStudiesForPrompt(caseStudies)
        : '';
      const quickAutomationsText = quickAutomations.length > 0
        ? formatQuickAutomationsForPrompt(quickAutomations)
        : '';

      if (useRealAI) {
        const response = await chatWithProjectAdvisor(
          newMessages,
          intakeData,
          {
            caseStudies: caseStudiesText,
            quickAutomations: quickAutomationsText,
            conversationContext: updatedContext
          }
        );
        setMessages([...newMessages, { role: 'assistant', content: response }]);
      } else {
        const response = await getDemoProjectAdvisorResponse(
          userMessage,
          intakeData,
          {
            caseStudies: caseStudiesText,
            quickAutomations: quickAutomationsText
          }
        );
        setMessages([...newMessages, { role: 'assistant', content: response }]);
      }
    } catch (err) {
      console.error('Advisor error:', err);
      setError('Failed to get response. Please try again.');
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again or contact us directly.'
        }
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInput('');
    setConversationContext({});
    const welcomeMessage = intakeData
      ? `Hello! 👋 I see we've already chatted about ${intakeData.company || 'your business'}. Let's start fresh.\n\nWhat's the main business problem you're trying to solve?`
      : `Hello! 👋 I'm your Expert Project Advisor. What's the main business problem you're trying to solve?`;
    setMessages([{ role: 'assistant', content: welcomeMessage }]);
  };

  return (
    <Container className="conversational-advisor py-5">
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold mb-2">Expert Project Advisor</h1>
        <p className="lead text-muted">
          Multi-perspective guidance from CEO, CTO, Investor, and Enablement experts
        </p>
        {intakeData && (
          <Alert variant="info" className="d-inline-block mt-3">
            <small>
              <strong>Using intake data:</strong> {intakeData.company || 'Your business'} - {intakeData.solutions?.join(', ') || 'General inquiry'}
            </small>
          </Alert>
        )}
        {!isAPIAvailable() && (
          <Alert variant="info" className="d-inline-block mt-2">
            <small>Running in demo mode. For expert analysis, configure API keys.</small>
          </Alert>
        )}
      </div>

      <Row>
        <Col lg={10} className="mx-auto">
          <Card className="advisor-chat">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Project Advisor</strong>
                {!isAPIAvailable() && (
                  <span className="badge bg-secondary ms-2" style={{ fontSize: '0.7rem' }}>Demo</span>
                )}
              </div>
              <Button
                variant="link"
                size="sm"
                onClick={handleClear}
                className="p-0"
              >
                Clear Chat
              </Button>
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
              {error && (
                <Alert variant="danger" className="mb-2" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}
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

          {/* Case Studies Suggestions */}
          {caseStudies.length > 0 && (
            <Card className="mt-4">
              <Card.Header>
                <strong>Relevant Case Studies</strong>
              </Card.Header>
              <Card.Body>
                <Row>
                  {caseStudies.map(cs => (
                    <Col md={4} key={cs.slug} className="mb-3">
                      <div className="case-study-suggestion">
                        <h6>{cs.title}</h6>
                        <p className="small text-muted mb-2">{cs.problem.substring(0, 100)}...</p>
                        <Button
                          as={Link}
                          to={`/case-studies/${cs.slug}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          View Case Study
                        </Button>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Quick Automations */}
          {quickAutomations.length > 0 && (
            <Card className="mt-4">
              <Card.Header>
                <strong>Quick Automation Suggestions</strong>
              </Card.Header>
              <Card.Body>
                <div className="quick-automations">
                  {quickAutomations.map((auto, idx) => (
                    <div key={idx} className="automation-badge mb-2">
                      <strong>{auto.title}</strong>
                      <span className="text-muted small ms-2">- {auto.quickWin}</span>
                      {auto.link && (
                        <Button
                          as={Link}
                          to={auto.link}
                          variant="link"
                          size="sm"
                          className="ms-2 p-0"
                        >
                          View example
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          <div className="text-center mt-4">
            <Button
              variant="primary"
              onClick={() => setShowLeadModal(true)}
            >
              Schedule Discovery Meeting
            </Button>
          </div>
        </Col>
      </Row>

      <LeadCaptureModal
        show={showLeadModal}
        onHide={() => setShowLeadModal(false)}
        triggerSource="project_advisor"
      />
    </Container>
  );
}



