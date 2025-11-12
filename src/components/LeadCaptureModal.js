import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

export default function LeadCaptureModal({ show, onHide, triggerSource = 'general' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    interest: 'general'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Analytics tracking
      console.log('lead_capture_submit', {
        source: triggerSource,
        name: formData.name,
        email: formData.email,
        company: formData.company,
        interest: formData.interest
      });

      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/leads', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...formData, source: triggerSource })
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubmitStatus('success');
      setTimeout(() => {
        setFormData({ name: '', email: '', company: '', phone: '', message: '', interest: 'general' });
        setErrors({});
        onHide();
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Lead capture error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
          <h3 className="mb-2">Let's Discuss Your Project</h3>
          <p className="text-muted small mb-0">Tell us about your needs and we'll get back to you within 24 hours</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        {submitStatus === 'success' && (
          <Alert variant="success" className="mb-3">
            <strong>Thank you!</strong> We've received your inquiry and will contact you soon.
          </Alert>
        )}
        {submitStatus === 'error' && (
          <Alert variant="danger" className="mb-3">
            <strong>Oops!</strong> Something went wrong. Please try again or email us directly.
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Group controlId="formName">
                <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  isInvalid={!!errors.name}
                  required
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Group controlId="formEmail">
                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  isInvalid={!!errors.email}
                  required
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Group controlId="formCompany">
                <Form.Label>Company</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your Company"
                />
              </Form.Group>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                />
              </Form.Group>
            </div>
          </div>
          <Form.Group className="mb-3" controlId="formInterest">
            <Form.Label>I'm interested in</Form.Label>
            <Form.Select name="interest" value={formData.interest} onChange={handleChange}>
              <option value="general">General Inquiry</option>
              <option value="ai-automation">AI & Automation Solutions</option>
              <option value="custom-development">Custom Development</option>
              <option value="consulting">Technical Consulting</option>
              <option value="integration">System Integration</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMessage">
            <Form.Label>Tell us about your project <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your needs, goals, timeline, and any specific requirements..."
              isInvalid={!!errors.message}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="fw-semibold"
            >
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
            </Button>
            <p className="text-muted small text-center mt-2 mb-0">
              We respect your privacy. Your information will never be shared.
            </p>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

