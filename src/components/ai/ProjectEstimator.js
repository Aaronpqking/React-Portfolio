import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col, Accordion } from 'react-bootstrap';
import { getExpertProjectEstimate, isAPIAvailable } from '../../services/aiService';
import { getDemoProjectEstimate } from '../../services/demoService';
import { trackAIUsage } from '../../utils/AIUtils';
import LeadCaptureModal from '../LeadCaptureModal';
import './ProjectEstimator.css';

const PROJECT_TYPES = [
  { value: 'ai-automation', label: 'AI & Automation' },
  { value: 'custom-development', label: 'Custom Development' },
  { value: 'system-integration', label: 'System Integration' },
  { value: 'consulting', label: 'Technical Consulting' }
];

const BUDGET_RANGES = [
  { value: 'low', label: 'Under $15,000' },
  { value: 'medium', label: '$15,000 - $35,000' },
  { value: 'high', label: '$35,000+' }
];

const TIMELINE_OPTIONS = [
  { value: 'urgent', label: 'As soon as possible' },
  { value: 'normal', label: '1-2 months' },
  { value: 'flexible', label: 'Flexible timeline' }
];

export default function ProjectEstimator() {
  const [formData, setFormData] = useState({
    projectType: '',
    features: [],
    customFeatures: '',
    budget: '',
    timeline: '',
    description: ''
  });
  const [estimate, setEstimate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [hasSeenEstimate, setHasSeenEstimate] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setEstimate(null);

    try {
      const useRealAI = isAPIAvailable();
      trackAIUsage('project_estimator', useRealAI ? 'api_call' : 'demo_mode', {
        projectType: formData.projectType
      });

      if (useRealAI) {
        const response = await getExpertProjectEstimate(formData);
        setEstimate(response);
      } else {
        const response = await getDemoProjectEstimate(formData);
        setEstimate(response);
      }

      setHasSeenEstimate(true);
      // Show lead capture modal after estimate
      setTimeout(() => {
        setShowLeadModal(true);
      }, 1000);
    } catch (err) {
      console.error('Estimation error:', err);
      setError('Failed to generate estimate. Please try again or contact us directly.');
    } finally {
      setIsLoading(false);
    }
  };

  const commonFeatures = {
    'ai-automation': [
      'Workflow automation',
      'Data processing',
      'Document analysis',
      'Email automation',
      'Report generation'
    ],
    'custom-development': [
      'User authentication',
      'Database integration',
      'API development',
      'Admin dashboard',
      'Mobile responsive'
    ],
    'system-integration': [
      'API connections',
      'Data synchronization',
      'Webhook setup',
      'Error handling',
      'Monitoring & logging'
    ],
    'consulting': [
      'Architecture review',
      'Tech stack selection',
      'Code review',
      'Team training',
      'Documentation'
    ]
  };

  return (
    <Container className="project-estimator py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">Expert Project Advisor</h1>
        <p className="lead text-muted">
          Get expert guidance from our multi-perspective advisor (CEO, CTO, Investor, Teacher). 
          We'll help you define realistic solutions that work within your budget and capabilities.
        </p>
        <p className="text-muted small">
          Heavy on enablement - we'll teach you what's possible, what's realistic, and help you make informed decisions.
        </p>
        {!isAPIAvailable() && (
          <Alert variant="info" className="d-inline-block">
            <small>Running in demo mode. For expert analysis, configure API keys.</small>
          </Alert>
        )}
      </div>

      <Row>
        <Col lg={8} className="mx-auto">
          {!estimate ? (
            <Card>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Project Type <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select project type</option>
                      {PROJECT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {formData.projectType && (
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Features</Form.Label>
                      <div className="feature-checkboxes">
                        {commonFeatures[formData.projectType]?.map(feature => (
                          <Form.Check
                            key={feature}
                            type="checkbox"
                            id={`feature-${feature}`}
                            label={feature}
                            checked={formData.features.includes(feature)}
                            onChange={() => handleFeatureToggle(feature)}
                          />
                        ))}
                      </div>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="customFeatures"
                        value={formData.customFeatures}
                        onChange={handleChange}
                        placeholder="Additional features or requirements..."
                        className="mt-2"
                      />
                    </Form.Group>
                  )}

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Budget Range</Form.Label>
                        <Form.Select
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                        >
                          <option value="">Select budget range</option>
                          {BUDGET_RANGES.map(range => (
                            <option key={range.value} value={range.value}>
                              {range.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Timeline</Form.Label>
                        <Form.Select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                        >
                          <option value="">Select timeline</option>
                          {TIMELINE_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Project Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your project goals, challenges, and any specific requirements..."
                    />
                  </Form.Group>

                  {error && (
                    <Alert variant="danger" className="mb-3">
                      {error}
                    </Alert>
                  )}

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isLoading || !formData.projectType}
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Generating Estimate...
                        </>
                      ) : (
                        'Get Estimate'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Card className="estimate-result">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="h4 mb-2">Expert Analysis & Estimate</h2>
                  <p className="text-muted small mb-0">Multi-perspective guidance from CEO, CTO, Investor, and Enablement experts</p>
                </div>

                <div className="estimate-details">
                  <Row className="mb-4">
                    <Col md={6}>
                      <div className="estimate-item">
                        <h5 className="text-muted small text-uppercase mb-2">Estimated Cost</h5>
                        <div className="display-6 fw-bold text-primary">
                          ${estimate.estimatedCost?.min?.toLocaleString()} - ${estimate.estimatedCost?.max?.toLocaleString()}
                        </div>
                        <small className="text-muted">{estimate.estimatedCost?.currency || 'USD'}</small>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="estimate-item">
                        <h5 className="text-muted small text-uppercase mb-2">Estimated Timeline</h5>
                        <div className="h3 fw-bold">
                          {estimate.estimatedTimeline?.weeks} weeks
                        </div>
                        <small className="text-muted">{estimate.estimatedTimeline?.range}</small>
                      </div>
                    </Col>
                  </Row>

                  {estimate.recommendedStack && estimate.recommendedStack.length > 0 && (
                    <div className="estimate-item mb-4">
                      <h5 className="text-primary mb-3">
                        <span className="me-2">💻</span>Recommended Tech Stack
                      </h5>
                      <p className="text-muted small mb-2">Budget and capability-appropriate technologies:</p>
                      <div className="d-flex flex-wrap gap-2">
                        {estimate.recommendedStack.map((tech, idx) => (
                          <span key={idx} className="badge bg-primary">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {estimate.recommendedApproach && (
                    <div className="estimate-item mb-4">
                      <h5 className="text-primary mb-3">
                        <span className="me-2">📋</span>Recommended Approach
                      </h5>
                      <p className="mb-0">{estimate.recommendedApproach}</p>
                    </div>
                  )}

                  {estimate.alternatives && estimate.alternatives.length > 0 && (
                    <Alert variant="info" className="mb-4">
                      <h6 className="mb-2">
                        <strong>💡 Alternative Solutions to Consider</strong>
                      </h6>
                      <ul className="mb-0">
                        {estimate.alternatives.map((alt, idx) => (
                          <li key={idx}>{alt}</li>
                        ))}
                      </ul>
                    </Alert>
                  )}

                  {estimate.keyLearnings && estimate.keyLearnings.length > 0 && (
                    <Alert variant="success" className="mb-4">
                      <h6 className="mb-2">
                        <strong>🎓 Key Learnings (Enablement)</strong>
                      </h6>
                      <p className="small mb-2">What you need to know to make informed decisions:</p>
                      <ul className="mb-0">
                        {estimate.keyLearnings.map((learning, idx) => (
                          <li key={idx}>{learning}</li>
                        ))}
                      </ul>
                    </Alert>
                  )}

                  {estimate.realisticExpectations && (
                    <Alert variant="warning" className="mb-4">
                      <h6 className="mb-2">
                        <strong>⚖️ Realistic Expectations</strong>
                      </h6>
                      <p className="mb-0">{estimate.realisticExpectations}</p>
                    </Alert>
                  )}

                  {estimate.fullAnalysis && (
                    <Accordion className="mb-4">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>View Full Expert Analysis</Accordion.Header>
                        <Accordion.Body>
                          <pre className="expert-analysis-text">{estimate.fullAnalysis}</pre>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  )}

                  {estimate.nextSteps && estimate.nextSteps.length > 0 && (
                    <div className="estimate-item mb-4">
                      <h5 className="text-primary mb-3">
                        <span className="me-2">➡️</span>Next Steps
                      </h5>
                      <ul>
                        {estimate.nextSteps.map((step, idx) => (
                          <li key={idx} className="mb-2">{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="d-grid gap-2 mt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setShowLeadModal(true)}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setEstimate(null);
                      setFormData({
                        projectType: '',
                        features: [],
                        customFeatures: '',
                        budget: '',
                        timeline: '',
                        description: ''
                      });
                    }}
                  >
                    Start New Estimate
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <LeadCaptureModal
        show={showLeadModal}
        onHide={() => setShowLeadModal(false)}
        triggerSource="project_estimator"
      />
    </Container>
  );
}

