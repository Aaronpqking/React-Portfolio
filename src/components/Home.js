import { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LeadCaptureModal from './LeadCaptureModal';

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [modalSource, setModalSource] = useState('hero');

  const handleOpenModal = (source) => {
    setModalSource(source);
    setShowModal(true);
    console.log('lead_capture_open', source);
  };

  const services = [
    {
      icon: '🤖',
      title: 'AI & Automation',
      description: 'Intelligent systems that streamline operations, reduce costs, and enhance decision-making.',
      features: ['RAG Systems', 'Agent Orchestration', 'Workflow Automation']
    },
    {
      icon: '💻',
      title: 'Custom Development',
      description: 'Scalable web applications built with modern architectures and best practices.',
      features: ['Full-Stack Solutions', 'Cloud-Native Apps', 'API Development']
    },
    {
      icon: '🔗',
      title: 'System Integration',
      description: 'Seamlessly connect your existing tools and platforms for unified workflows.',
      features: ['API Integration', 'Data Pipelines', 'Third-Party Connectors']
    },
    {
      icon: '📊',
      title: 'Technical Consulting',
      description: 'Strategic guidance on architecture, technology selection, and digital transformation.',
      features: ['Architecture Review', 'Tech Stack Selection', 'Team Mentoring']
    }
  ];

  return (
    <>
      <LeadCaptureModal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        triggerSource={modalSource}
      />
      
      {/* Hero Section */}
      <section className="consultancy-hero">
        <Container>
          <Row className="align-items-center min-vh-75 py-5">
            <Col lg={7}>
              <div className="hero-content">
                <h1 className="display-4 fw-bold mb-4">
                  Transform Your Business with
                  <span className="text-gradient"> AI-Powered Solutions</span>
                </h1>
                <p className="lead mb-4 hero-description">
                  We help small to midsize businesses leverage cutting-edge technology to automate workflows, 
                  integrate systems, and drive growth. From AI agents to custom platforms, we deliver solutions 
                  that scale.
                </p>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <Button 
                    size="lg" 
                    variant="primary"
                    onClick={() => handleOpenModal('hero-cta')}
                    className="px-4"
                  >
                    Get Started
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline-light"
                    as={Link}
                    to="/case-studies"
                    className="px-4"
                  >
                    View Our Work
                  </Button>
                </div>
                <div className="d-flex gap-4 hero-features small">
                  <div>
                    <strong className="text-white">24hr</strong> <span className="text-white-50">Response Time</span>
                  </div>
                  <div>
                    <strong className="text-white">Free</strong> <span className="text-white-50">Consultation</span>
                  </div>
                  <div>
                    <strong className="text-white">Small Business</strong> <span className="text-white-50">Focused</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={5} className="text-center">
              <div className="hero-visual">
                <div className="gradient-orb"></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="mb-5">
            <Col lg={8} className="mx-auto text-center">
              <h2 className="display-5 fw-bold mb-3">What We Offer</h2>
              <p className="lead services-subtitle">
                Comprehensive technology solutions tailored to your business needs
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {services.map((service, idx) => (
              <Col md={6} lg={3} key={idx}>
                <Card className="h-100 border-0 shadow-sm service-card">
                  <Card.Body className="p-4">
                    <div className="service-icon mb-3">{service.icon}</div>
                    <Card.Title className="h5 mb-3">{service.title}</Card.Title>
                    <Card.Text className="text-muted small mb-3">{service.description}</Card.Text>
                    <ul className="list-unstyled small">
                      {service.features.map((feature, i) => (
                        <li key={i} className="mb-2">
                          <span className="text-primary me-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Value Proposition */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2 className="display-5 fw-bold mb-4">
                Built for <span className="text-gradient">Small & Midsize Businesses</span>
              </h2>
              <p className="lead text-muted mb-4">
                We understand that SMBs need solutions that deliver value quickly without breaking the budget. 
                Our approach combines enterprise-grade technology with practical, cost-effective implementation.
              </p>
              <ul className="list-unstyled mb-4">
                <li className="mb-3 d-flex align-items-start">
                  <span className="text-primary me-3 fs-4">→</span>
                  <div>
                    <strong>Fast Time-to-Value</strong>
                    <p className="text-muted small mb-0">Rapid deployment with iterative improvements</p>
                  </div>
                </li>
                <li className="mb-3 d-flex align-items-start">
                  <span className="text-primary me-3 fs-4">→</span>
                  <div>
                    <strong>Scalable Architecture</strong>
                    <p className="text-muted small mb-0">Grow without expensive rewrites</p>
                  </div>
                </li>
                <li className="mb-3 d-flex align-items-start">
                  <span className="text-primary me-3 fs-4">→</span>
                  <div>
                    <strong>Transparent Pricing</strong>
                    <p className="text-muted small mb-0">No hidden fees, clear project scopes</p>
                  </div>
                </li>
              </ul>
              <Button 
                size="lg" 
                variant="primary"
                onClick={() => handleOpenModal('value-prop')}
              >
                Schedule a Consultation
              </Button>
            </Col>
            <Col lg={6}>
              <div className="stats-grid p-4">
                <div className="stat-item text-center p-4">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Projects Delivered</div>
                </div>
                <div className="stat-item text-center p-4">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Client Satisfaction</div>
                </div>
                <div className="stat-item text-center p-4">
                  <div className="stat-number">2-4</div>
                  <div className="stat-label">Weeks Avg. Delivery</div>
                </div>
                <div className="stat-item text-center p-4">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Support Available</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* AI Demos Section */}
      <section className="py-5">
        <Container>
          <Row className="mb-5">
            <Col lg={8} className="mx-auto text-center">
              <h2 className="display-5 fw-bold mb-3">Try Our AI Tools</h2>
              <p className="lead text-muted">
                Experience our AI capabilities firsthand. Get instant estimates, recommendations, and answers.
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col md={6} lg={4}>
              <Card className="h-100 border-0 shadow-sm ai-demo-card">
                <Card.Body className="p-4 text-center">
                  <div className="ai-icon mb-3">💬</div>
                  <Card.Title className="h5 mb-3">AI Chat Assistant</Card.Title>
                  <Card.Text className="text-muted small mb-3">
                    Ask questions about our services, pricing, timelines, and get instant answers powered by AI.
                  </Card.Text>
                  <Button 
                    as={Link} 
                    to="/ai-chat" 
                    variant="primary" 
                    className="w-100"
                  >
                    Try Chat Assistant
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="h-100 border-0 shadow-sm ai-demo-card">
                <Card.Body className="p-4 text-center">
                  <div className="ai-icon mb-3">📊</div>
                  <Card.Title className="h5 mb-3">Project Estimator</Card.Title>
                  <Card.Text className="text-muted small mb-3">
                    Get instant AI-powered estimates for your project including cost, timeline, and approach.
                  </Card.Text>
                  <Button 
                    as={Link} 
                    to="/ai-estimator" 
                    variant="primary" 
                    className="w-100"
                  >
                    Get Estimate
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="h-100 border-0 shadow-sm ai-demo-card">
                <Card.Body className="p-4 text-center">
                  <div className="ai-icon mb-3">🚀</div>
                  <Card.Title className="h5 mb-3">All AI Tools</Card.Title>
                  <Card.Text className="text-muted small mb-3">
                    Workflow analyzer, SOP generator, marketing drip tool, proposal generator, and more.
                  </Card.Text>
                  <Button 
                    as={Link}
                    to="/ai-demos"
                    variant="primary" 
                    className="w-100"
                  >
                    View All Tools
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2 className="display-5 fw-bold mb-3">Ready to Transform Your Business?</h2>
              <p className="lead mb-4 opacity-75">
                Let's discuss how we can help you automate workflows, integrate systems, and drive growth.
              </p>
              <Button 
                size="lg" 
                variant="light"
                onClick={() => handleOpenModal('bottom-cta')}
                className="px-5"
              >
                Get Started Today
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Home;
