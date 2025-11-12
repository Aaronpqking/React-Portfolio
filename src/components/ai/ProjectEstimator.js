import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { getStructuredAIResponse, isAPIAvailable } from '../../services/aiService';
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
        const prompt = `Estimate a ${formData.projectType} project with the following details:
- Features: ${formData.features.join(', ') || 'Standard features'}
- Additional requirements: ${formData.customFeatures || 'None'}
- Budget range: ${formData.budget}
- Timeline preference: ${formData.timeline}
- Description: ${formData.description || 'Not provided'}

Provide a detailed estimate including:
1. Estimated cost range (min, max, currency)
2. Estimated timeline in weeks
3. Recommended approach/phased plan
4. Next steps
5. Confidence level`;

        const schema = {
          estimatedCost: { min: 'number', max: 'number', currency: 'string' },
          estimatedTimeline: { weeks: 'number', range: 'string' },
          recommendedApproach: 'string',
          nextSteps: 'array',
          confidence: 'string'
        };

        const response = await getStructuredAIResponse(prompt, schema);
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
        <h1 className="display-5 fw-bold mb-3">AI Project Estimator</h1>
        <p className="lead text-muted">
          Get an instant estimate for your project. Tell us about your needs and we'll provide
          a detailed cost and timeline estimate.
        </p>
        {!isAPIAvailable() && (
          <Alert variant="info" className="d-inline-block">
            <small>Running in demo mode. For real estimates, configure API keys.</small>
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
                  <h2 className="h4 mb-3">Your Project Estimate</h2>
                </div>

                <div className="estimate-details">
                  <div className="estimate-item mb-4">
                    <h5 className="text-muted small text-uppercase mb-2">Estimated Cost</h5>
                    <div className="display-6 fw-bold text-primary">
                      ${estimate.estimatedCost?.min?.toLocaleString()} - ${estimate.estimatedCost?.max?.toLocaleString()}
                    </div>
                    <small className="text-muted">{estimate.estimatedCost?.currency || 'USD'}</small>
                  </div>

                  <div className="estimate-item mb-4">
                    <h5 className="text-muted small text-uppercase mb-2">Estimated Timeline</h5>
                    <div className="h3 fw-bold">
                      {estimate.estimatedTimeline?.weeks} weeks
                    </div>
                    <small className="text-muted">{estimate.estimatedTimeline?.range}</small>
                  </div>

                  {estimate.recommendedApproach && (
                    <div className="estimate-item mb-4">
                      <h5 className="text-muted small text-uppercase mb-2">Recommended Approach</h5>
                      <p>{estimate.recommendedApproach}</p>
                    </div>
                  )}

                  {estimate.nextSteps && estimate.nextSteps.length > 0 && (
                    <div className="estimate-item mb-4">
                      <h5 className="text-muted small text-uppercase mb-2">Next Steps</h5>
                      <ul>
                        {estimate.nextSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {estimate.confidence && (
                    <Alert variant="info" className="mb-3">
                      <strong>Confidence Level:</strong> {estimate.confidence}
                    </Alert>
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

