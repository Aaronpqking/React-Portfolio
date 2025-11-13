import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { chatWithAI, isAPIAvailable } from '../../services/aiService';
import { getDemoProposalDraft } from '../../services/demoService';
import { trackAIUsage } from '../../utils/AIUtils';
import './ProposalGenerator.css';

export default function ProposalGenerator() {
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    problem: '',
    solution: '',
    requirements: '',
    timeline: '',
    budget: ''
  });
  const [proposal, setProposal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectName.trim() || !formData.problem.trim()) {
      setError('Please fill in at least Project Name and Problem Statement');
      return;
    }

    setError(null);
    setIsLoading(true);
    setProposal(null);

    try {
      const useRealAI = isAPIAvailable();
      trackAIUsage('proposal_generator', useRealAI ? 'api_call' : 'demo_mode');

      const prompt = `Generate a professional project proposal based on this information:

Project Name: ${formData.projectName}
Client: ${formData.clientName || 'Client'}
Problem Statement: ${formData.problem}
Proposed Solution: ${formData.solution || 'Custom solution based on requirements'}
Requirements: ${formData.requirements || 'To be determined'}
Timeline: ${formData.timeline || 'To be discussed'}
Budget: ${formData.budget || 'To be determined'}

Create a comprehensive proposal with:
1. Executive Summary
2. Problem Statement (detailed)
3. Proposed Solution (with approach and methodology)
4. Technical Approach (if applicable)
5. Timeline & Milestones
6. Deliverables
7. Investment/Pricing (professional language)
8. Next Steps
9. Why Choose Us (brief value proposition)

Make it professional, clear, and compelling. Use structured sections with clear headings.`;

      if (useRealAI) {
        const response = await chatWithAI([
          {
            role: 'system',
            content: 'You are an expert at creating professional project proposals. Generate comprehensive, compelling proposals that clearly communicate value and next steps.'
          },
          { role: 'user', content: prompt }
        ], { maxTokens: 2000 });

        setProposal({
          content: response,
          sections: extractSections(response)
        });
      } else {
        const response = await getDemoProposalDraft(formData);
        setProposal(response);
      }
    } catch (err) {
      console.error('Proposal generation error:', err);
      setError('Failed to generate proposal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const extractSections = (text) => {
    const sections = [];
    const lines = text.split('\n');
    let currentSection = null;

    lines.forEach(line => {
      if (line.match(/^#+\s+/)) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace(/^#+\s+/, '').trim(),
          content: ''
        };
      } else if (currentSection && line.trim()) {
        currentSection.content += line + '\n';
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections.length > 0 ? sections : null;
  };

  return (
    <Container className="proposal-generator py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">AI Proposal Generator</h1>
        <p className="lead text-muted">
          Generate professional project proposals quickly. Fill in the project details and get a comprehensive proposal draft.
        </p>
        {!isAPIAvailable() && (
          <Alert variant="info" className="d-inline-block">
            <small>Running in demo mode. For real proposal generation, configure API keys.</small>
          </Alert>
        )}
      </div>

      <Row>
        <Col lg={8} className="mx-auto">
          {!proposal ? (
            <Card>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Project Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="projectName"
                          value={formData.projectName}
                          onChange={handleChange}
                          placeholder="e.g., AI Automation System"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Client Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleChange}
                          placeholder="Client company name"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Problem Statement <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="problem"
                      value={formData.problem}
                      onChange={handleChange}
                      placeholder="Describe the problem or challenge the client is facing..."
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Proposed Solution</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="solution"
                      value={formData.solution}
                      onChange={handleChange}
                      placeholder="Describe your proposed solution or approach..."
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Requirements</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      placeholder="Key requirements, features, or specifications..."
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Timeline</Form.Label>
                        <Form.Control
                          type="text"
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          placeholder="e.g., 8-12 weeks"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Budget Range</Form.Label>
                        <Form.Control
                          type="text"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          placeholder="e.g., $25,000 - $35,000"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

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
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Generating Proposal...
                        </>
                      ) : (
                        'Generate Proposal'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Card className="proposal-result">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="h4 mb-3">Generated Proposal</h2>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => {
                        setProposal(null);
                        setFormData({
                          projectName: '',
                          clientName: '',
                          problem: '',
                          solution: '',
                          requirements: '',
                          timeline: '',
                          budget: ''
                        });
                      }}
                    >
                      Generate Another
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        const content = proposal.sections 
                          ? proposal.sections.map(s => `${s.title}\n${s.content}`).join('\n\n')
                          : proposal.content;
                        navigator.clipboard.writeText(content);
                        alert('Proposal copied to clipboard!');
                      }}
                    >
                      Copy Proposal
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        const content = proposal.sections 
                          ? proposal.sections.map(s => `${s.title}\n${s.content}`).join('\n\n')
                          : proposal.content;
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Proposal_${formData.projectName || 'Project'}.txt`;
                        a.click();
                      }}
                    >
                      Download
                    </Button>
                  </div>
                </div>

                {proposal.sections ? (
                  <div className="proposal-content">
                    {proposal.sections.map((section, idx) => (
                      <div key={idx} className="proposal-section mb-4">
                        <h5 className="mb-3">{section.title}</h5>
                        <div className="proposal-text">{section.content}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="proposal-content">
                    <pre className="proposal-text">{proposal.content}</pre>
                  </div>
                )}

                {proposal.nextSteps && proposal.nextSteps.length > 0 && (
                  <Alert variant="success" className="mt-4">
                    <h6>Next Steps</h6>
                    <ul className="mb-0">
                      {proposal.nextSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </Alert>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}




