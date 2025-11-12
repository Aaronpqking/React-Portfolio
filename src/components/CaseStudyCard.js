import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function CaseStudyCard({ s }) {
  const demo = s.links?.find(l => /demo|loom/i.test(l.label));
  const [iframeError, setIframeError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Try iframe first if we have a demo URL
  const useIframe = demo && !iframeError;

  // Timeout to detect if iframe is blocked
  useEffect(() => {
    if (useIframe) {
      const timer = setTimeout(() => {
        if (!iframeLoaded) {
          setIframeError(true);
        }
      }, 5000); // 5 second timeout
      return () => clearTimeout(timer);
    }
  }, [useIframe, iframeLoaded]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  const handlePreviewClick = (e) => {
    if (demo && e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
      window.open(demo.href, '_blank', 'noopener,noreferrer');
      console.log('cs_demo_click', s.slug);
    }
  };

  return (
    <article className="card h-100">
      {useIframe ? (
        <div 
          className="card-img-top position-relative"
          style={{ 
            height: '200px', 
            overflow: 'hidden',
            backgroundColor: '#f8f9fa',
            cursor: 'pointer'
          }}
          onClick={handlePreviewClick}
        >
          <iframe
            src={demo.href}
            title={`${s.title} preview`}
            style={{
              width: '200%',
              height: '200%',
              border: 'none',
              transform: 'scale(0.5)',
              transformOrigin: 'top left',
              pointerEvents: 'none'
            }}
            onLoad={handleIframeLoad}
            onError={() => setIframeError(true)}
            sandbox="allow-same-origin allow-scripts"
            loading="lazy"
          />
          {!iframeLoaded && (
            <div 
              className="position-absolute top-50 start-50 translate-middle"
              style={{ zIndex: 1 }}
            >
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div 
            className="position-absolute bottom-0 start-0 end-0 p-2 text-center"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
              color: 'white',
              fontSize: '0.75rem',
              pointerEvents: 'none'
            }}
          >
            Click to view live site
          </div>
        </div>
      ) : s.cardImage && !imageError ? (
        <div 
          style={{ cursor: demo ? 'pointer' : 'default' }}
          onClick={demo ? handlePreviewClick : undefined}
        >
          <img
            src={s.cardImage}
            alt={s.title}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      ) : (
        <div 
          className="card-img-top bg-light d-flex align-items-center justify-content-center"
          style={{ height: '200px', cursor: demo ? 'pointer' : 'default' }}
          onClick={demo ? handlePreviewClick : undefined}
        >
          <span className="text-muted small">
            {demo ? 'Click to view live site' : 'Preview unavailable'}
          </span>
        </div>
      )}
      <div className="card-body">
        <h3 className="h6 mb-1">{s.title}</h3>
        <div className="text-muted small mb-2">{s.client || s.industry}</div>
        <div className="mb-2">
          {(s.stack || []).slice(0, 6).map(t => (
            <span key={t} className="badge text-bg-light me-1">{t}</span>
          ))}
        </div>
        <div className="d-flex gap-3">
          {demo && (
            <a
              href={demo.href}
              onClick={() => console.log('cs_demo_click', s.slug)}
              className="link-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Demo
            </a>
          )}
          <Link to={`/case-studies/${s.slug}`} className="link-secondary">
            Case study
          </Link>
        </div>
      </div>
    </article>
  );
}

