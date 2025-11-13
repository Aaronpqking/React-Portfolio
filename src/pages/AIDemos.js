import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './AIDemos.css';

const aiTools = [
  {
    id: 'chat',
    title: 'AI Chat Assistant',
    icon: '💬',
    description: 'Natural conversation intake specialist. Gathers lead information and schedules discovery calls.',
    link: '/ai-chat',
    status: 'active',
    category: 'real-ai'
  },
  {
    id: 'estimator',
    title: 'Project Estimator',
    icon: '📊',
    description: 'Get instant AI-powered estimates for your project including cost, timeline, and approach.',
    link: '/ai-estimator',
    status: 'active',
    category: 'real-ai'
  },
  {
    id: 'workflow',
    title: 'Workflow Analyzer',
    icon: '⚙️',
    description: 'Analyze your workflows and get optimization suggestions, automation opportunities, and efficiency improvements.',
    link: '/ai-workflow-analyzer',
    status: 'active',
    category: 'demo'
  },
  {
    id: 'sop',
    title: 'SOP Generator',
    icon: '📋',
    description: 'Answer questions and upload documents. AI generates comprehensive Standard Operating Procedures with gap analysis.',
    link: '/ai-sop-generator',
    status: 'active',
    category: 'demo'
  },
  {
    id: 'email',
    title: 'Smart Drip Campaign Builder',
    icon: '✉️',
    description: 'Generate a complete 5-part automated email sequence (Days 0, 2, 4, 7, 10) that nurtures leads through your sales funnel.',
    link: '/ai-email-generator',
    status: 'active',
    category: 'demo'
  },
  {
    id: 'property-summary',
    title: 'Property Summary Generator',
    icon: '🏡',
    description: 'Generate professional property summary PDFs from MLS listings or property details. Perfect for real estate agents and property managers.',
    link: '/ai-property-summary',
    status: 'active',
    category: 'demo'
  },
  {
    id: 'proposal',
    title: 'Proposal Generator',
    icon: '📄',
    description: 'Create professional project proposals quickly. Input project details and get comprehensive proposal drafts.',
    link: '/ai-proposal-generator',
    status: 'active',
    category: 'demo'
  }
];

export default function AIDemos() {
  return (
    <>
      <Helmet>
        <title>AI Tools & Demos</title>
        <meta name="description" content="Try our AI-powered tools: chat assistant, project estimator, workflow analyzer, SOP generator, and more." />
      </Helmet>
      <Container className="ai-demos-page py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">AI Tools & Demos</h1>
          <p className="lead text-muted">
            Experience our AI capabilities firsthand. Try our tools for project estimation, workflow analysis, 
            document generation, and more.
          </p>
        </div>

        <Row className="g-4 mb-5">
          {aiTools.map(tool => (
            <Col md={6} lg={4} key={tool.id}>
              <Card className="h-100 ai-tool-card border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="ai-tool-icon mb-3">{tool.icon}</div>
                  <Card.Title className="h5 mb-3">{tool.title}</Card.Title>
                  <Card.Text className="text-muted small mb-3">{tool.description}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className={`badge ${tool.category === 'real-ai' ? 'bg-primary' : 'bg-secondary'}`}>
                      {tool.category === 'real-ai' ? 'Real AI' : 'Demo'}
                    </span>
                    <Button
                      as={Link}
                      to={tool.link}
                      variant="primary"
                      size="sm"
                    >
                      Try It
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="bg-light">
              <Card.Body className="p-4 text-center">
                <h3 className="h5 mb-3">Want to See These in Action?</h3>
                <p className="text-muted mb-3">
                  These AI tools demonstrate our capabilities. Ready to implement similar solutions for your business?
                </p>
                <Button
                  as={Link}
                  to="/ai-chat"
                  variant="primary"
                  size="lg"
                >
                  Start a Conversation
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}



