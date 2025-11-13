import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { chatWithAI, isAPIAvailable } from '../../services/aiService';
import { trackAIUsage } from '../../utils/AIUtils';
import './EmailResponseGenerator.css';

export default function EmailResponseGenerator() {
  const [formData, setFormData] = useState({
    customerExample: '',
    leadType: 'purchase',
    industry: 'insurance'
  });
  const [generatedSequence, setGeneratedSequence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedDays, setExpandedDays] = useState({ day0: true });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.customerExample.trim()) {
      setError('Please enter an example of a typical customer or inquiry');
      return;
    }

    setError(null);
    setIsLoading(true);
    setGeneratedSequence(null);

    try {
      const useRealAI = isAPIAvailable();
      trackAIUsage('smart_drip_campaign_builder', useRealAI ? 'api_call' : 'demo_mode');

      const prompt = `You are creating a Smart Drip Campaign Builder that generates a complete 5-part automated email sequence. Generate HTML-formatted emails for a drip campaign.

Lead Information:
- Customer example: "${formData.customerExample}"
- Lead type: ${formData.leadType === 'purchase' ? 'recent purchase' : 'customer inquiry/lead'}
- Industry: ${formData.industry}

Generate a complete 5-part email sequence with the following structure:

DAY 0 (Immediate): Educational Content
- Subject: Educational topic related to the industry/lead type
- Content: Explain how the process works, build understanding
- Example: "How quotes are built" (insurance), "Understanding the home buying process" (real estate), "What to expect" (general)

DAY 2: Checklist/Guide
- Subject: Helpful checklist or guide
- Content: Provide a practical checklist or step-by-step guide
- Example: "Switching checklist" (insurance), "Home buying checklist" (real estate), "Next steps guide" (general)

DAY 4: Testimonial + CTA
- Subject: Social proof and call-to-action
- Content: Include a customer testimonial or success story, then strong CTA
- Example: "See how others succeeded" + "Book your call today"

DAY 7: FAQ + Review/Reminder
- Subject: Answer common questions
- Content: Address FAQs, review key points, gentle reminder
- Example: "Answers to your questions" + "Still interested?"

DAY 10: Final Reminder
- Subject: Last chance or final reminder
- Content: Final call-to-action, sense of urgency, book call
- Example: "Last chance to get started" or "Final reminder"

Format each email as HTML with:
- Proper HTML structure (use <div>, <p>, <h2>, <h3>, <strong>, <ul>, <li> tags)
- Clean, professional styling
- Clear subject lines
- Engaging, personalized content
- Strong CTAs

Return a JSON object with this structure:
{
  "day0": { "subject": "...", "body": "<html>..." },
  "day2": { "subject": "...", "body": "<html>..." },
  "day4": { "subject": "...", "body": "<html>..." },
  "day7": { "subject": "...", "body": "<html>..." },
  "day10": { "subject": "...", "body": "<html>..." }
}`;

      if (useRealAI) {
        const response = await chatWithAI([
          {
            role: 'system',
            content: 'You are an expert at creating automated drip email campaigns. Generate professional, engaging email sequences that nurture leads through a sales funnel with educational content, checklists, testimonials, FAQs, and strong CTAs.'
          },
          { role: 'user', content: prompt }
        ], { maxTokens: 3000 });

        const parsed = parseDripSequenceResponse(response);
        setGeneratedSequence(parsed);
      } else {
        // Demo mode - generate sample sequence
        const demoSequence = generateDemoDripSequence(formData);
        setGeneratedSequence(demoSequence);
      }
    } catch (err) {
      console.error('Drip sequence generation error:', err);
      setError('Failed to generate drip sequence. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseDripSequenceResponse = (text) => {
    // Try to parse JSON first
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Ensure all emails have HTML formatting
        Object.keys(parsed).forEach(day => {
          if (parsed[day].body && !parsed[day].body.includes('<')) {
            parsed[day].body = formatTextAsHTML(parsed[day].body);
          }
        });
        return parsed;
      }
    } catch (e) {
      console.log('Failed to parse JSON, using fallback');
    }
    
    // Fallback: parse text format
    const days = ['day0', 'day2', 'day4', 'day7', 'day10'];
    const sequence = {};
    
    days.forEach(day => {
      const dayNum = day.replace('day', '');
      const regex = new RegExp(`day\\s*${dayNum}[:\\.]?\\s*([\\s\\S]*?)(?=day\\s*${parseInt(dayNum) + 2}|$)`, 'i');
      const match = text.match(regex);
      if (match) {
        const content = match[1].trim();
        const subjectMatch = content.match(/subject:?\s*(.+?)(?:\n|$)/i);
        const subject = subjectMatch ? subjectMatch[1].trim() : `Day ${dayNum} Email`;
        let body = content.replace(/subject:?.+?(?:\n|$)/i, '').trim();
        if (!body.includes('<')) {
          body = formatTextAsHTML(body);
        }
        sequence[day] = { subject, body };
      }
    });
    
    // If we didn't get all emails, use demo
    if (Object.keys(sequence).length < 5) {
      return generateDemoDripSequence(formData);
    }
    
    return sequence;
  };

  const formatTextAsHTML = (text) => {
    let html = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>');
    
    return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">${html}</div>`;
  };

  const generateDemoDripSequence = (data) => {
    const leadType = data.leadType === 'purchase' ? 'recent purchase' : 'inquiry';
    const industry = data.industry || 'insurance';
    
    const getIndustryContent = (day) => {
      if (industry === 'insurance') {
        return {
          day0: { subject: 'How Insurance Quotes Are Built', content: 'Understanding how insurance quotes work helps you make informed decisions. Here\'s what factors into your quote...' },
          day2: { subject: 'Your Insurance Switching Checklist', content: 'Ready to make the switch? Use this checklist to ensure a smooth transition...' },
          day4: { subject: 'See How Others Saved Money', content: 'Customer testimonial: "I saved $500/year by switching. The process was easy!"' },
          day7: { subject: 'Answers to Your Insurance Questions', content: 'Common questions about coverage, deductibles, and switching providers...' },
          day10: { subject: 'Last Chance: Get Your Quote Today', content: 'Don\'t miss out on potential savings. Book your call now to get started.' }
        }[day];
      } else if (industry === 'real-estate') {
        return {
          day0: { subject: 'Understanding the Home Buying Process', content: 'Buying a home is exciting! Here\'s what to expect in the process...' },
          day2: { subject: 'Your Home Buying Checklist', content: 'Use this checklist to stay organized during your home search...' },
          day4: { subject: 'Success Stories from Happy Homeowners', content: 'See how we helped families find their dream homes...' },
          day7: { subject: 'Common Home Buying Questions Answered', content: 'FAQs about financing, inspections, and closing...' },
          day10: { subject: 'Ready to Start Your Home Search?', content: 'Let\'s schedule a call to discuss your needs and find the perfect home.' }
        }[day];
      } else {
        return {
          day0: { subject: 'Understanding the Process', content: 'Here\'s how our process works and what you can expect...' },
          day2: { subject: 'Your Next Steps Guide', content: 'Follow this guide to move forward with confidence...' },
          day4: { subject: 'See How Others Succeeded', content: 'Customer success stories and testimonials...' },
          day7: { subject: 'Answers to Your Questions', content: 'Common questions and helpful answers...' },
          day10: { subject: 'Ready to Get Started?', content: 'Book your call today to take the next step.' }
        }[day];
      }
    };

    const createEmailBody = (day, content) => {
      const dayNum = day.replace('day', '');
      return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
    <strong style="color: #667eea;">Day ${dayNum} Email</strong>
  </div>
  
  <p>Hi [Customer Name],</p>
  
  <p>${content.content}</p>
  
  ${day === 'day4' ? '<p style="background: #e8f5e9; padding: 15px; border-radius: 4px; border-left: 4px solid #4caf50;"><em>"I saved money and the process was so easy!" - Sarah M.</em></p>' : ''}
  
  ${day === 'day10' ? '<div style="background: #fff3cd; padding: 20px; border-radius: 4px; border-left: 4px solid #ffc107; margin: 20px 0;"><strong>Ready to get started?</strong><br><a href="#" style="display: inline-block; margin-top: 10px; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 4px;">Book Your Call Now</a></div>' : ''}
  
  <p>If you have any questions, we're here to help!</p>
  
  <p>Best regards,<br><strong>Your Team</strong></p>
</div>`;
    };

    return {
      day0: {
        subject: getIndustryContent('day0').subject,
        body: createEmailBody('day0', getIndustryContent('day0'))
      },
      day2: {
        subject: getIndustryContent('day2').subject,
        body: createEmailBody('day2', getIndustryContent('day2'))
      },
      day4: {
        subject: getIndustryContent('day4').subject,
        body: createEmailBody('day4', getIndustryContent('day4'))
      },
      day7: {
        subject: getIndustryContent('day7').subject,
        body: createEmailBody('day7', getIndustryContent('day7'))
      },
      day10: {
        subject: getIndustryContent('day10').subject,
        body: createEmailBody('day10', getIndustryContent('day10'))
      }
    };
  };

  return (
    <Container className="email-generator py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">Smart Drip Campaign Builder</h1>
        <p className="lead text-muted">
          Generate a complete 5-part automated email sequence that nurtures leads through your sales funnel. Perfect for insurance, real estate, and other industries.
        </p>
        {!isAPIAvailable() && (
          <Alert variant="info" className="d-inline-block">
            <small>Running in demo mode. For real email generation, configure API keys.</small>
          </Alert>
        )}
      </div>

      <Row>
        <Col lg={10} className="mx-auto">
          {!generatedSequence ? (
            <Card>
              <Card.Body className="p-4">
                <Form onSubmit={handleGenerate}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Lead Type <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="leadType"
                      value={formData.leadType}
                      onChange={handleChange}
                    >
                      <option value="purchase">Recent Purchase</option>
                      <option value="inquiry">Customer Inquiry / Lead</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Select whether this is a customer who made a purchase or a lead/inquiry
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Industry <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                    >
                      <option value="insurance">Insurance</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="general">General</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Select the industry to customize email content
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Example Customer or Inquiry <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="customerExample"
                      value={formData.customerExample}
                      onChange={handleChange}
                      placeholder="e.g., A customer who just purchased auto insurance, A lead who inquired about home insurance, A client looking to switch providers..."
                      required
                    />
                    <Form.Text className="text-muted">
                      {`Describe a typical customer ${formData.leadType === 'purchase' ? 'purchase' : 'inquiry'} or provide a short example`}
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
                      disabled={isLoading || !formData.customerExample.trim()}
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Generating Drip Sequence...
                        </>
                      ) : (
                        'Generate 5-Part Drip Sequence'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Card className="email-result">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="h4 mb-3">Generated 5-Part Drip Sequence</h2>
                  <p className="text-muted small">
                    Complete automated email sequence with timeline: Day 0, Day 2, Day 4, Day 7, and Day 10
                  </p>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      setGeneratedSequence(null);
                      setExpandedDays({ day0: true });
                      setFormData({
                        customerExample: '',
                        leadType: 'purchase',
                        industry: 'insurance'
                      });
                    }}
                  >
                    Generate Another
                  </Button>
                </div>

                <div className="drip-sequence-timeline mb-4">
                  {['day0', 'day2', 'day4', 'day7', 'day10'].map((day) => {
                    const dayNum = day.replace('day', '');
                    const email = generatedSequence[day];
                    const expanded = expandedDays[day] || false;
                    
                    return (
                      <Card key={day} className="mb-3 drip-email-card">
                        <Card.Header 
                          className="drip-email-header"
                          onClick={() => setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }))}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>Day {dayNum}</strong>
                              <span className="ms-2 text-muted small">{email?.subject || 'Email'}</span>
                            </div>
                            <span className="badge bg-primary">Day {dayNum}</span>
                          </div>
                        </Card.Header>
                        {expanded && email && (
                          <Card.Body>
                            <div className="mb-3">
                              <strong>Subject:</strong>
                              <div className="email-subject">{email.subject}</div>
                            </div>
                            <div>
                              <strong>Body:</strong>
                              <div 
                                className="email-body-html"
                                dangerouslySetInnerHTML={{ __html: email.body }}
                              />
                            </div>
                            <div className="d-flex gap-2 mt-3">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                  const htmlContent = `Subject: ${email.subject}\n\n${email.body}`;
                                  navigator.clipboard.writeText(htmlContent);
                                  alert('Email HTML copied to clipboard!');
                                }}
                              >
                                Copy This Email
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => {
                                  const newWindow = window.open();
                                  newWindow.document.write(`
                                    <!DOCTYPE html>
                                    <html>
                                      <head>
                                        <title>${email.subject}</title>
                                        <meta charset="utf-8">
                                      </head>
                                      <body style="margin: 0; padding: 20px; background: #f5f5f5;">
                                        ${email.body}
                                      </body>
                                    </html>
                                  `);
                                }}
                              >
                                View Full Email
                              </Button>
                            </div>
                          </Card.Body>
                        )}
                      </Card>
                    );
                  })}
                </div>

                <div className="d-flex gap-2 mb-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      const fullSequence = Object.entries(generatedSequence)
                        .map(([day, email]) => `\n=== Day ${day.replace('day', '')} ===\nSubject: ${email.subject}\n\n${email.body}`)
                        .join('\n\n');
                      navigator.clipboard.writeText(fullSequence);
                      alert('Full sequence copied to clipboard!');
                    }}
                  >
                    Copy Full Sequence
                  </Button>
                </div>

                <Alert variant="info">
                  <h6>What's Next?</h6>
                  <p className="mb-2">
                    This 5-part drip sequence demonstrates how automated email campaigns work. We can create a complete system for your business that:
                  </p>
                  <ul className="mb-0">
                    <li>Automatically sends personalized follow-ups at optimal times</li>
                    <li>Nurtures leads through your sales funnel with educational content</li>
                    <li>Saves you hours of manual email work</li>
                    <li>Increases engagement and conversion rates by 25-40%</li>
                  </ul>
                </Alert>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

