import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { chatWithAI, isAPIAvailable } from '../../services/aiService';
import { getDemoWorkflowAnalysis } from '../../services/demoService';
import { trackAIUsage } from '../../utils/AIUtils';
import './WorkflowAnalyzer.css';

export default function WorkflowAnalyzer() {
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('description'); // 'description' or 'questions'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workflowDescription.trim()) return;

    setError(null);
    setIsLoading(true);
    setAnalysis(null);

    try {
      const useRealAI = isAPIAvailable();
      trackAIUsage('workflow_analyzer', useRealAI ? 'api_call' : 'demo_mode');

      if (useRealAI) {
        const prompt = `Analyze this workflow and provide optimization suggestions:

${workflowDescription}

Provide:
1. Current issues and bottlenecks
2. Specific optimization recommendations with priority levels
3. Automation opportunities
4. Estimated time/cost savings

Format as structured analysis with clear sections.`;

        const response = await chatWithAI([
          {
            role: 'system',
            content: 'You are a workflow optimization expert. Analyze workflows and provide actionable recommendations for improvement, automation, and efficiency gains.'
          },
          { role: 'user', content: prompt }
        ], { maxTokens: 1500 });

        // Parse response into structured format
        const parsed = parseWorkflowAnalysis(response);
        setAnalysis(parsed);
      } else {
        const response = await getDemoWorkflowAnalysis(workflowDescription);
        setAnalysis(response);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze workflow. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseWorkflowAnalysis = (text) => {
    // Try to extract structured data from AI response
    const issues = [];
    const recommendations = [];
    const automation = [];

    // Simple parsing - in production, use more sophisticated parsing
    const lines = text.split('\n');
    let currentSection = null;

    lines.forEach(line => {
      if (line.toLowerCase().includes('issue') || line.toLowerCase().includes('problem') || line.toLowerCase().includes('bottleneck')) {
        currentSection = 'issues';
        if (line.trim().length > 10) issues.push(line.trim());
      } else if (line.toLowerCase().includes('recommendation') || line.toLowerCase().includes('suggestion') || line.toLowerCase().includes('improve')) {
        currentSection = 'recommendations';
        if (line.trim().length > 10) recommendations.push(line.trim());
      } else if (line.toLowerCase().includes('automation') || line.toLowerCase().includes('automate')) {
        currentSection = 'automation';
        if (line.trim().length > 10) automation.push(line.trim());
      } else if (currentSection && line.trim().startsWith('-') || line.trim().startsWith('•')) {
        const clean = line.replace(/^[-•]\s*/, '').trim();
        if (clean.length > 10) {
          if (currentSection === 'issues') issues.push(clean);
          else if (currentSection === 'recommendations') recommendations.push(clean);
          else if (currentSection === 'automation') automation.push(clean);
        }
      }
    });

    return {
      currentIssues: issues.length > 0 ? issues : ['Manual processes creating inefficiencies', 'Lack of automation in repetitive tasks'],
      recommendations: recommendations.length > 0 ? recommendations : [
        { priority: 'high', suggestion: 'Automate data entry processes', impact: 'Saves 10+ hours/week', effort: '2-3 weeks' },
        { priority: 'medium', suggestion: 'Implement workflow notifications', impact: 'Improves response time', effort: '1-2 weeks' }
      ],
      automationOpportunities: automation.length > 0 ? automation : ['Email parsing and routing', 'Automated task assignment', 'Scheduled report generation'],
      estimatedSavings: {
        time: '15-20 hours/week',
        cost: '$2,000-3,000/month'
      },
      rawAnalysis: text
    };
  };

  return (
    <Container className="workflow-analyzer py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">AI Workflow Analyzer</h1>
        <p className="lead text-muted">
          Describe your workflow and get AI-powered optimization suggestions, automation opportunities, and efficiency improvements.
        </p>
        {!isAPIAvailable() && (
          <Alert variant="info" className="d-inline-block">
            <small>Running in demo mode. For real analysis, configure API keys.</small>
          </Alert>
        )}
      </div>

      <Row>
        <Col lg={8} className="mx-auto">
          {!analysis ? (
            <Card>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Describe Your Workflow</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={8}
                      value={workflowDescription}
                      onChange={(e) => setWorkflowDescription(e.target.value)}
                      placeholder="Example: Our team receives customer inquiries via email. We manually review each email, categorize it, assign it to a team member, track responses in a spreadsheet, and send follow-up emails. This process takes about 2-3 hours daily and sometimes inquiries get missed..."
                      required
                    />
                    <Form.Text className="text-muted">
                      Describe your current process, steps involved, tools used, and any pain points you've noticed.
                    </Form.Text>
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
                      disabled={isLoading || !workflowDescription.trim()}
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Analyzing Workflow...
                        </>
                      ) : (
                        'Analyze Workflow'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Card className="analysis-result">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="h4 mb-3">Workflow Analysis Results</h2>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      setAnalysis(null);
                      setWorkflowDescription('');
                    }}
                  >
                    Analyze Another Workflow
                  </Button>
                </div>

                <div className="analysis-sections">
                  {analysis.currentIssues && analysis.currentIssues.length > 0 && (
                    <div className="analysis-section mb-4">
                      <h5 className="text-danger mb-3">Current Issues</h5>
                      <ul>
                        {analysis.currentIssues.map((issue, idx) => (
                          <li key={idx} className="mb-2">{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.recommendations && analysis.recommendations.length > 0 && (
                    <div className="analysis-section mb-4">
                      <h5 className="text-primary mb-3">Optimization Recommendations</h5>
                      {Array.isArray(analysis.recommendations) && analysis.recommendations[0]?.priority ? (
                        <div>
                          {analysis.recommendations.map((rec, idx) => (
                            <div key={idx} className="recommendation-item mb-3 p-3 border rounded">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <strong>{rec.suggestion || rec}</strong>
                                <span className={`badge ${rec.priority === 'high' ? 'bg-danger' : rec.priority === 'medium' ? 'bg-warning' : 'bg-info'}`}>
                                  {rec.priority || 'medium'}
                                </span>
                              </div>
                              {rec.impact && <div className="text-success small">Impact: {rec.impact}</div>}
                              {rec.effort && <div className="text-muted small">Effort: {rec.effort}</div>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ul>
                          {analysis.recommendations.map((rec, idx) => (
                            <li key={idx} className="mb-2">{rec}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {analysis.automationOpportunities && analysis.automationOpportunities.length > 0 && (
                    <div className="analysis-section mb-4">
                      <h5 className="text-success mb-3">Automation Opportunities</h5>
                      <ul>
                        {analysis.automationOpportunities.map((opp, idx) => (
                          <li key={idx} className="mb-2">{opp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.estimatedSavings && (
                    <Alert variant="success">
                      <h6 className="mb-2">Estimated Savings</h6>
                      <div>Time: <strong>{analysis.estimatedSavings.time}</strong></div>
                      <div>Cost: <strong>{analysis.estimatedSavings.cost}</strong></div>
                    </Alert>
                  )}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}




