import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col, ProgressBar } from 'react-bootstrap';
import { chatWithAI, isAPIAvailable } from '../../services/aiService';
import { trackAIUsage } from '../../utils/AIUtils';
import './SOPGenerator.css';

const INTERVIEW_QUESTIONS = [
  { id: 1, question: 'What is the name of this process or procedure?', field: 'processName' },
  { id: 2, question: 'Who performs this process? (Role/Department)', field: 'performer' },
  { id: 3, question: 'What triggers this process? (When does it start?)', field: 'trigger' },
  { id: 4, question: 'What is the main goal or outcome of this process?', field: 'goal' },
  { id: 5, question: 'What are the main steps involved? (List them)', field: 'steps' },
  { id: 6, question: 'What tools or systems are used?', field: 'tools' },
  { id: 7, question: 'What are common issues or challenges?', field: 'challenges' },
  { id: 8, question: 'Are there any decision points or conditions?', field: 'decisions' },
  { id: 9, question: 'Who needs to be notified or involved?', field: 'stakeholders' },
  { id: 10, question: 'What documents or data are needed?', field: 'documents' }
];

export default function SOPGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sop, setSop] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnswer = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGenerateSOP();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
    // In production, you'd parse and extract text from these files
    trackAIUsage('sop_generator', 'file_upload', { fileCount: files.length });
  };

  const handleGenerateSOP = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const useRealAI = isAPIAvailable();
      trackAIUsage('sop_generator', useRealAI ? 'api_call' : 'demo_mode', answers);

      const context = `
Process Name: ${answers.processName || 'Not provided'}
Performed By: ${answers.performer || 'Not provided'}
Trigger: ${answers.trigger || 'Not provided'}
Goal: ${answers.goal || 'Not provided'}
Steps: ${answers.steps || 'Not provided'}
Tools: ${answers.tools || 'Not provided'}
Challenges: ${answers.challenges || 'Not provided'}
Decisions: ${answers.decisions || 'Not provided'}
Stakeholders: ${answers.stakeholders || 'Not provided'}
Documents: ${answers.documents || 'Not provided'}
${uploadedFiles.length > 0 ? `\nUploaded ${uploadedFiles.length} file(s) with additional context.` : ''}
`;

      if (useRealAI) {
        const prompt = `Generate a comprehensive Standard Operating Procedure (SOP) based on this information:

${context}

Create a professional SOP document with:
1. Title and Overview
2. Purpose and Scope
3. Roles and Responsibilities
4. Prerequisites/Requirements
5. Step-by-step procedure (detailed)
6. Decision points and conditions
7. Tools and resources needed
8. Common issues and troubleshooting
9. Quality checks/validation steps
10. Related procedures or references

Also identify:
- Any gaps in the information provided
- Suggested improvements or best practices
- Potential automation opportunities
- Areas that need clarification

Format the SOP professionally with clear sections and numbering.`;

        const response = await chatWithAI([
          {
            role: 'system',
            content: 'You are an expert at creating Standard Operating Procedures. Generate comprehensive, clear, and actionable SOPs. Identify gaps and suggest improvements.'
          },
          { role: 'user', content: prompt }
        ], { maxTokens: 2000 });

        setSop({
          content: response,
          gaps: extractGaps(response),
          suggestions: extractSuggestions(response)
        });
      } else {
        // Demo mode
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSop({
          content: generateDemoSOP(answers),
          gaps: ['Missing specific error handling procedures', 'No defined escalation path', 'Timeline expectations not specified'],
          suggestions: ['Add automated notifications for each step', 'Implement quality checkpoints', 'Create backup procedures for system failures']
        });
      }
    } catch (err) {
      console.error('SOP generation error:', err);
      setError('Failed to generate SOP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const extractGaps = (text) => {
    const gapKeywords = ['gap', 'missing', 'unclear', 'not specified', 'needs clarification', 'undefined'];
    const lines = text.split('\n');
    const gaps = [];
    
    lines.forEach(line => {
      if (gapKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
        gaps.push(line.trim());
      }
    });
    
    return gaps.length > 0 ? gaps : ['No major gaps identified'];
  };

  const extractSuggestions = (text) => {
    const suggestionKeywords = ['suggest', 'recommend', 'consider', 'improve', 'enhance', 'best practice'];
    const lines = text.split('\n');
    const suggestions = [];
    
    lines.forEach(line => {
      if (suggestionKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
        suggestions.push(line.trim());
      }
    });
    
    return suggestions.length > 0 ? suggestions.slice(0, 5) : ['Review and refine based on team feedback'];
  };

  const generateDemoSOP = (answers) => {
    return `# Standard Operating Procedure: ${answers.processName || 'Process'}

## 1. Purpose and Scope
This SOP defines the standard procedure for ${answers.processName || 'the process'} performed by ${answers.performer || 'the team'}.

**Goal:** ${answers.goal || 'To ensure consistent execution'}

## 2. Roles and Responsibilities
- **Primary Performer:** ${answers.performer || 'Assigned team member'}
- **Stakeholders:** ${answers.stakeholders || 'Relevant team members'}

## 3. Prerequisites
- Access to: ${answers.tools || 'Required systems'}
- Documents needed: ${answers.documents || 'Required documentation'}

## 4. Procedure Steps
${(answers.steps || 'Steps not provided').split('\n').map((step, i) => `${i + 1}. ${step}`).join('\n')}

## 5. Decision Points
${answers.decisions || 'No specific decision points identified'}

## 6. Tools and Resources
${answers.tools || 'Tools not specified'}

## 7. Common Issues and Troubleshooting
${answers.challenges || 'Challenges not specified'}

## 8. Quality Checks
- Verify all steps completed
- Confirm stakeholder notifications sent
- Validate final outcome matches goal

---
*This SOP was generated based on the information provided. Review and customize as needed.*`;
  };

  const progress = ((currentStep + 1) / INTERVIEW_QUESTIONS.length) * 100;

  if (sop) {
    return (
      <Container className="sop-generator py-5">
        <div className="text-center mb-4">
          <h1 className="display-5 fw-bold mb-3">SOP Generated</h1>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setSop(null);
              setCurrentStep(0);
              setAnswers({});
              setUploadedFiles([]);
            }}
          >
            Generate Another SOP
          </Button>
        </div>

        <Row>
          <Col lg={10} className="mx-auto">
            <Card>
              <Card.Body className="p-4">
                <div className="sop-content mb-4">
                  <pre className="sop-text">{sop.content}</pre>
                </div>

                {sop.gaps && sop.gaps.length > 0 && (
                  <Alert variant="warning" className="mb-3">
                    <h6>Identified Gaps</h6>
                    <ul className="mb-0">
                      {sop.gaps.map((gap, idx) => (
                        <li key={idx}>{gap}</li>
                      ))}
                    </ul>
                  </Alert>
                )}

                {sop.suggestions && sop.suggestions.length > 0 && (
                  <Alert variant="info" className="mb-3">
                    <h6>Suggestions for Improvement</h6>
                    <ul className="mb-0">
                      {sop.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </Alert>
                )}

                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigator.clipboard.writeText(sop.content);
                      alert('SOP copied to clipboard!');
                    }}
                  >
                    Copy SOP
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      const blob = new Blob([sop.content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `SOP_${answers.processName || 'Process'}.txt`;
                      a.click();
                    }}
                  >
                    Download SOP
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="sop-generator py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">AI SOP Generator</h1>
        <p className="lead text-muted">
          Answer a few questions and upload any relevant documents. We'll generate a comprehensive Standard Operating Procedure for you.
        </p>
        {!isAPIAvailable() && (
          <Alert variant="info" className="d-inline-block">
            <small>Running in demo mode. For real SOP generation, configure API keys.</small>
          </Alert>
        )}
      </div>

      <Row>
        <Col lg={8} className="mx-auto">
          <Card>
            <Card.Body className="p-4">
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="small text-muted">Question {currentStep + 1} of {INTERVIEW_QUESTIONS.length}</span>
                  <span className="small text-muted">{Math.round(progress)}% Complete</span>
                </div>
                <ProgressBar now={progress} className="mb-3" />
              </div>

              <Form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold h5">
                    {INTERVIEW_QUESTIONS[currentStep].question}
                  </Form.Label>
                  {INTERVIEW_QUESTIONS[currentStep].field === 'steps' ? (
                    <Form.Control
                      as="textarea"
                      rows={6}
                      value={answers[INTERVIEW_QUESTIONS[currentStep].field] || ''}
                      onChange={(e) => handleAnswer(INTERVIEW_QUESTIONS[currentStep].field, e.target.value)}
                      placeholder="Enter each step on a new line..."
                    />
                  ) : (
                    <Form.Control
                      type="text"
                      value={answers[INTERVIEW_QUESTIONS[currentStep].field] || ''}
                      onChange={(e) => handleAnswer(INTERVIEW_QUESTIONS[currentStep].field, e.target.value)}
                      placeholder="Your answer..."
                    />
                  )}
                </Form.Group>

                {currentStep === 5 && (
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Upload Supporting Documents (Optional)</Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    <Form.Text className="text-muted">
                      Upload any existing documentation, process flows, or related materials
                    </Form.Text>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted">Uploaded: {uploadedFiles.map(f => f.name).join(', ')}</small>
                      </div>
                    )}
                  </Form.Group>
                )}

                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                <div className="d-flex justify-content-between">
                  <Button
                    variant="outline-secondary"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                  >
                    ← Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Generating SOP...
                      </>
                    ) : currentStep === INTERVIEW_QUESTIONS.length - 1 ? (
                      'Generate SOP'
                    ) : (
                      'Next →'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}




