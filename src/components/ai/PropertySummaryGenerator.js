import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { chatWithAI, isAPIAvailable } from '../../services/aiService';
import { trackAIUsage } from '../../utils/AIUtils';
import './PropertySummaryGenerator.css';

export default function PropertySummaryGenerator() {
  const [inputType, setInputType] = useState('mls-simple'); // 'mls', 'mls-simple', or 'manual'
  const [formData, setFormData] = useState({
    mlsUrl: '',
    mlsSimple: '',
    address: '',
    price: '',
    beds: '',
    baths: '',
    squareFeet: '',
    description: '',
    propertyType: 'residential',
    photoUrls: ''
  });
  const [generatedSummary, setGeneratedSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (inputType === 'mls' && !formData.mlsUrl.trim()) {
      setError('Please enter an MLS URL');
      return;
    }
    
    if (inputType === 'mls-simple' && !formData.mlsSimple.trim()) {
      setError('Please enter an MLS URL');
      return;
    }
    
    if (inputType === 'manual') {
      if (!formData.address.trim() && !formData.description.trim()) {
        setError('Please enter at least an address or property description');
        return;
      }
    }

    setError(null);
    setIsLoading(true);
    setGeneratedSummary(null);

    try {
      const useRealAI = isAPIAvailable();
      trackAIUsage('property_summary_generator', useRealAI ? 'api_call' : 'demo_mode');

      const mlsUrl = inputType === 'mls' ? formData.mlsUrl : (inputType === 'mls-simple' ? formData.mlsSimple : '');
      const photoUrls = formData.photoUrls ? formData.photoUrls.split('\n').filter(url => url.trim()).join(', ') : '';
      
      const propertyInfo = inputType === 'mls' || inputType === 'mls-simple'
        ? `MLS URL: ${mlsUrl}${photoUrls ? `\nPhoto URLs: ${photoUrls}` : ''}`
        : `Address: ${formData.address || 'Not provided'}
Price: ${formData.price || 'Not provided'}
Bedrooms: ${formData.beds || 'Not provided'}
Bathrooms: ${formData.baths || 'Not provided'}
Square Feet: ${formData.squareFeet || 'Not provided'}
Property Type: ${formData.propertyType}
Description: ${formData.description || 'Not provided'}
${photoUrls ? `Photo URLs: ${photoUrls}` : ''}`;

      const prompt = `You are creating a professional property summary for real estate. Generate a comprehensive HTML-formatted property summary that will be displayed to potential buyers.

Property Information:
${propertyInfo}

The property summary should include:

1. PROPERTY OVERVIEW
   - Address and location highlights
   - Key property statistics (beds, baths, square footage, price)
   - Property type and style

2. KEY FEATURES & AMENITIES
   - Notable features and upgrades
   - Special amenities (pool, garage, etc.)
   - Unique selling points

3. NEIGHBORHOOD INFORMATION
   - Location benefits
   - Nearby amenities (schools, shopping, parks, etc.)
   - Neighborhood characteristics

4. INVESTMENT HIGHLIGHTS
   - Value proposition
   - Market positioning
   - Potential for appreciation or rental income (if applicable)

Format the summary as HTML with:
- Proper HTML structure (use <div>, <p>, <h2>, <h3>, <strong>, <ul>, <li>, <img> tags)
- Clean, professional styling suitable for buyer presentation
- Use inline styles for formatting
- Make it visually appealing and easy to read
- Professional real estate marketing tone
- Include property photos if URLs are provided (use <img> tags with proper styling, max-width: 100%, border-radius: 8px)
- Create a photo gallery section if multiple photos are available
- Make photos responsive and visually appealing

${photoUrls ? 'IMPORTANT: Include the provided photo URLs in the summary. Display them in a professional gallery format.' : ''}

Generate the complete HTML property summary ready to display.`;

      if (useRealAI) {
        const response = await chatWithAI([
          {
            role: 'system',
            content: 'You are an expert real estate marketing professional. Generate professional, comprehensive property summaries that highlight key features and appeal to potential buyers.'
          },
          { role: 'user', content: prompt }
        ], { maxTokens: 2000 });

        const parsed = parsePropertySummary(response);
        setGeneratedSummary(parsed);
      } else {
        // Demo mode - generate sample summary
        const demoData = inputType === 'mls-simple' 
          ? { ...formData, address: '123 Main Street, Anytown, ST 12345', price: '$450,000', beds: '3', baths: '2', squareFeet: '1,800' }
          : formData;
        const demoSummary = generateDemoPropertySummary(demoData, inputType);
        setGeneratedSummary(demoSummary);
      }
    } catch (err) {
      console.error('Property summary generation error:', err);
      setError('Failed to generate property summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const parsePropertySummary = (text) => {
    // Remove markdown code blocks if present
    let body = text.replace(/^```html\n?/i, '').replace(/^```\n?/, '').replace(/```$/i, '').trim();
    
    // If body doesn't contain HTML tags, wrap it in a div with basic styling
    if (!body.includes('<') || !body.includes('>')) {
      // Convert markdown-style formatting to HTML
      body = body
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.+)$/gm, '<p>$1</p>');
      
      body = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">${body}</div>`;
    }

    return {
      body: body,
      propertyInfo: formData
    };
  };

  const generateDemoPropertySummary = (data, inputType) => {
    const address = data.address || '123 Main Street, Anytown, ST 12345';
    const price = data.price || '$450,000';
    const beds = data.beds || '3';
    const baths = data.baths || '2';
    const sqft = data.squareFeet || '1,800';
    const photoUrls = data.photoUrls ? data.photoUrls.split('\n').filter(url => url.trim()) : [];
    const hasPhotos = photoUrls.length > 0;
    
    // Use placeholder images if no photos provided
    const photos = hasPhotos ? photoUrls : [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ];
    
    return {
      body: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="margin: 0 0 10px 0; font-size: 2rem;">Property Summary</h1>
    <p style="margin: 0; font-size: 1.2rem; opacity: 0.95;">${address}</p>
  </div>
  
  <div style="background: white; padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
    <h2 style="color: #667eea; margin-top: 0; margin-bottom: 15px; font-size: 1.5rem;">Property Photos</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
      ${photos.slice(0, 6).map(photoUrl => `
        <img src="${photoUrl}" alt="Property photo" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0; cursor: pointer;" onclick="window.open('${photoUrl}', '_blank')" />
      `).join('')}
    </div>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #e2e8f0;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
      <div style="text-align: center;">
        <div style="font-size: 2rem; font-weight: bold; color: #667eea;">${price}</div>
        <div style="font-size: 0.9rem; color: #64748b; margin-top: 5px;">List Price</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 2rem; font-weight: bold; color: #667eea;">${beds}</div>
        <div style="font-size: 0.9rem; color: #64748b; margin-top: 5px;">Bedrooms</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 2rem; font-weight: bold; color: #667eea;">${baths}</div>
        <div style="font-size: 0.9rem; color: #64748b; margin-top: 5px;">Bathrooms</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 2rem; font-weight: bold; color: #667eea;">${sqft}</div>
        <div style="font-size: 0.9rem; color: #64748b; margin-top: 5px;">Square Feet</div>
      </div>
    </div>
    
    <h2 style="color: #667eea; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Property Overview</h2>
    <p>This beautiful ${data.propertyType || 'residential'} property offers an exceptional opportunity for buyers seeking a well-maintained home in a desirable location. The property features ${beds} spacious bedrooms and ${baths} modern bathrooms, providing comfortable living space for families or professionals.</p>
    <p>Located at ${address}, this property is perfectly positioned to take advantage of local amenities, excellent schools, and convenient access to major transportation routes.</p>
    
    <h2 style="color: #667eea; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Key Features & Amenities</h2>
    <ul style="margin: 15px 0; padding-left: 25px; line-height: 2;">
      <li>Recently updated kitchen with modern appliances</li>
      <li>Spacious living areas with natural light</li>
      <li>Well-maintained landscaping and outdoor space</li>
      <li>Energy-efficient features and systems</li>
      <li>Ample storage throughout the property</li>
      <li>Updated bathrooms with contemporary finishes</li>
      <li>Hardwood flooring in main living areas</li>
      <li>Central heating and air conditioning</li>
    </ul>
    
    <h2 style="color: #667eea; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Neighborhood Information</h2>
    <p>This property is located in a well-established neighborhood known for its friendly community atmosphere and convenient location. The area offers:</p>
    <ul style="margin: 15px 0; padding-left: 25px; line-height: 2;">
      <li>Top-rated schools within walking distance</li>
      <li>Easy access to shopping centers and restaurants</li>
      <li>Nearby parks and recreational facilities</li>
      <li>Convenient public transportation options</li>
      <li>Low crime rates and safe community environment</li>
      <li>Growing property values and strong market demand</li>
    </ul>
    
    <h2 style="color: #667eea; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Investment Highlights</h2>
    <p>This property represents an excellent investment opportunity with strong potential for appreciation. Key investment factors include:</p>
    <ul style="margin: 15px 0; padding-left: 25px; line-height: 2;">
      <li>Competitive pricing in a desirable market area</li>
      <li>Strong rental income potential if used as an investment property</li>
      <li>Well-maintained condition reducing immediate repair costs</li>
      <li>Location benefits supporting long-term value growth</li>
      <li>Favorable market conditions for both buyers and investors</li>
    </ul>
    
    <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin-top: 30px; border-radius: 4px;">
      <p style="margin: 0; font-weight: 600; color: #667eea;">Ready to Schedule a Viewing?</p>
      <p style="margin: 10px 0 0 0;">Contact us today to arrange a private showing and learn more about this exceptional property opportunity.</p>
    </div>
  </div>
</div>`,
      propertyInfo: data
    };
  };

  return (
    <Container className="property-summary-generator py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">Property Summary Generator</h1>
        <p className="lead text-muted">
          Generate professional property summary PDFs from MLS listings or property details. Perfect for real estate agents and property managers.
        </p>
        {!isAPIAvailable() && (
          <Alert variant="info" className="d-inline-block">
            <small>Running in demo mode. For real property summary generation, configure API keys.</small>
          </Alert>
        )}
      </div>

      <Row>
        <Col lg={10} className="mx-auto">
          {!generatedSummary ? (
            <Card>
              <Card.Body className="p-4">
                <Tabs
                  activeKey={inputType}
                  onSelect={(k) => {
                    setInputType(k);
                    setError(null);
                  }}
                  className="mb-4"
                >
                  <Tab eventKey="mls-simple" title="Just MLS URL">
                    <Form onSubmit={handleGenerate}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">MLS Listing URL <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="url"
                          name="mlsSimple"
                          value={formData.mlsSimple}
                          onChange={handleChange}
                          placeholder="https://www.mls.com/listings/12345"
                        />
                        <Form.Text className="text-muted">
                          Enter the MLS listing URL. The system will extract property information and photos automatically.
                        </Form.Text>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Additional Photo URLs (Optional)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="photoUrls"
                          value={formData.photoUrls}
                          onChange={handleChange}
                          placeholder="Enter one photo URL per line (optional - photos will be extracted from MLS if available)"
                        />
                        <Form.Text className="text-muted">
                          Add additional property photos, one URL per line. Photos from MLS will be included automatically.
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
                          disabled={isLoading || !formData.mlsSimple.trim()}
                        >
                          {isLoading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Generating Property Summary...
                            </>
                          ) : (
                            'Generate Property Summary'
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Tab>
                  <Tab eventKey="manual" title="Manual Entry">
                    <Form onSubmit={handleGenerate}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Property Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              placeholder="123 Main Street, City, State ZIP"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">List Price</Form.Label>
                            <Form.Control
                              type="text"
                              name="price"
                              value={formData.price}
                              onChange={handleChange}
                              placeholder="$450,000"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Bedrooms</Form.Label>
                            <Form.Control
                              type="number"
                              name="beds"
                              value={formData.beds}
                              onChange={handleChange}
                              placeholder="3"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Bathrooms</Form.Label>
                            <Form.Control
                              type="number"
                              name="baths"
                              value={formData.baths}
                              onChange={handleChange}
                              placeholder="2"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Square Feet</Form.Label>
                            <Form.Control
                              type="text"
                              name="squareFeet"
                              value={formData.squareFeet}
                              onChange={handleChange}
                              placeholder="1,800"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Property Type</Form.Label>
                        <Form.Select
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleChange}
                        >
                          <option value="residential">Residential</option>
                          <option value="condo">Condo</option>
                          <option value="townhouse">Townhouse</option>
                          <option value="commercial">Commercial</option>
                          <option value="land">Land</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Property Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Enter any additional property details, features, or notes..."
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Property Photo URLs (Optional)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="photoUrls"
                          value={formData.photoUrls}
                          onChange={handleChange}
                          placeholder="Enter one photo URL per line (e.g., https://example.com/photo1.jpg)"
                        />
                        <Form.Text className="text-muted">
                          Add property photos, one URL per line. Photos will be included in the summary.
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
                          disabled={isLoading || (!formData.address.trim() && !formData.description.trim())}
                        >
                          {isLoading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Generating Property Summary...
                            </>
                          ) : (
                            'Generate Property Summary'
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Tab>
                  <Tab eventKey="mls" title="MLS URL (Advanced)">
                    <Form onSubmit={handleGenerate}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">MLS Listing URL <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="url"
                          name="mlsUrl"
                          value={formData.mlsUrl}
                          onChange={handleChange}
                          placeholder="https://www.mls.com/listings/12345"
                        />
                        <Form.Text className="text-muted">
                          Enter the URL of the MLS listing to automatically extract property information and photos
                        </Form.Text>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Additional Photo URLs (Optional)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="photoUrls"
                          value={formData.photoUrls}
                          onChange={handleChange}
                          placeholder="Enter one photo URL per line (optional - photos will be extracted from MLS if available)"
                        />
                        <Form.Text className="text-muted">
                          Add additional property photos, one URL per line. Photos from MLS will be included automatically.
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
                          disabled={isLoading || !formData.mlsUrl.trim()}
                        >
                          {isLoading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Generating Property Summary...
                            </>
                          ) : (
                            'Generate Property Summary'
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          ) : (
            <Card className="property-summary-result">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="h4 mb-3">Generated Property Summary</h2>
                  <p className="text-muted small">
                    Professional property summary ready for buyer presentation
                  </p>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      setGeneratedSummary(null);
                      setFormData({
                        mlsUrl: '',
                        mlsSimple: '',
                        address: '',
                        price: '',
                        beds: '',
                        baths: '',
                        squareFeet: '',
                        description: '',
                        propertyType: 'residential',
                        photoUrls: ''
                      });
                    }}
                  >
                    Generate Another
                  </Button>
                </div>

                <Card className="mb-3">
                  <Card.Header>
                    <strong>Property Summary Preview</strong>
                  </Card.Header>
                  <Card.Body>
                    <div 
                      className="property-summary-html"
                      dangerouslySetInnerHTML={{ __html: generatedSummary.body }}
                    />
                    <div className="d-flex gap-2 mt-3">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedSummary.body);
                          alert('Property summary HTML copied to clipboard!');
                        }}
                      >
                        Copy HTML
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
                                <title>Property Summary</title>
                                <meta charset="utf-8">
                              </head>
                              <body style="margin: 0; padding: 20px; background: #f5f5f5;">
                                ${generatedSummary.body}
                              </body>
                            </html>
                          `);
                        }}
                      >
                        View Full Summary
                      </Button>
                    </div>
                  </Card.Body>
                </Card>

                <Alert variant="info">
                  <h6>What's Next?</h6>
                  <p className="mb-2">
                    This property summary can be used to:
                  </p>
                  <ul className="mb-0">
                    <li>Share with potential buyers via email</li>
                    <li>Include in marketing materials and presentations</li>
                    <li>Export as PDF for printed materials</li>
                    <li>Post on social media and listing platforms</li>
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

