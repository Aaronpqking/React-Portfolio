import { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getBySlug, CASE_STUDIES } from '../data/caseStudies';
import MediaGallery from '../components/MediaGallery';
import MetricBadge from '../components/MetricBadge';

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const s = getBySlug(slug);

  useEffect(() => {
    if (!s) {
      navigate('/case-studies', { replace: true });
      return;
    }
    console.log('cs_detail_view', slug);
  }, [s, slug, navigate]);

  const relatedStudies = useMemo(() => {
    if (!s) return [];
    return CASE_STUDIES
      .filter(cs => cs.slug !== slug)
      .filter(cs => {
        // Find related by shared tags or industry
        const sharedTags = (s.tags || []).filter(t => (cs.tags || []).includes(t));
        return sharedTags.length > 0 || cs.industry === s.industry;
      })
      .slice(0, 2);
  }, [s, slug]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = s ? `${s.title} - Case Study` : '';
  const shareText = s ? s.problem : '';

  const handleShare = (platform) => {
    let url = '';
    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    }
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      console.log('cs_share', platform, slug);
    }
  };

  const handleBookCall = () => {
    // Google Calendar link - user can replace with their actual calendar link
    const calendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Intro+Call+with+Aaron+King&dates=20250101T120000Z/20250101T130000Z';
    // Alternative: Calendly link
    // const calendlyUrl = 'https://calendly.com/REPLACE';
    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
    console.log('cta_book_call', slug);
  };

  if (!s) {
    return null; // Will redirect in useEffect
  }

  const seoDescription = s?.seo?.description || s.problem || s.title;
  const pageTitle = `${s.title} — Case Study`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        {s.media && s.media.length > 0 && s.media[0].type === 'image' && (
          <meta property="og:image" content={s.media[0].src} />
        )}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": s.title,
            "description": seoDescription,
            "author": {
              "@type": "Person",
              "name": "Aaron King"
            },
            "datePublished": s.timeframe || "2025"
          })}
        </script>
      </Helmet>
      <main className="container py-4">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/case-studies">Case Studies</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {s.title}
            </li>
          </ol>
        </nav>

        <Link to="/case-studies" className="small d-block mb-3">
          ← Back to Case Studies
        </Link>

        <header className="mb-4">
          <h1 className="h3">{s.title}</h1>
          <div className="text-muted small mb-2">
            {[s.industry, s.role, s.timeframe].filter(Boolean).join(' • ')}
          </div>
          {s.client && (
            <div className="text-muted small">Client: {s.client}</div>
          )}
        </header>

        <section className="mb-4">
          <h2 className="h6">Problem</h2>
          <p>{s.problem}</p>
        </section>

        <section className="mb-4">
          <h2 className="h6">Approach</h2>
          <ul>
            {s.approach.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="h6">Solution</h2>
          <p>{s.solution}</p>
        </section>

        <section className="mb-4">
          <h2 className="h6">Outcomes</h2>
          <div className="d-flex gap-2 flex-wrap">
            {s.outcomes.map(m => (
              <MetricBadge
                key={m.label}
                label={m.label}
                value={m.value}
                tooltip={m.tooltip}
              />
            ))}
          </div>
        </section>

        {s.highlights && s.highlights.length > 0 && (
          <section className="mb-4">
            <h2 className="h6">Highlights</h2>
            <ul>
              {s.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-4">
          <h2 className="h6">Stack</h2>
          <div className="d-flex gap-2 flex-wrap">
            {(s.stack || []).map(tech => (
              <span key={tech} className="badge bg-secondary">
                {tech}
              </span>
            ))}
          </div>
        </section>

        <MediaGallery items={s.media} />

        {s.testimonial && (
          <section className="mb-4">
            <h2 className="h6">Testimonial</h2>
            <blockquote className="blockquote">
              <p>"{s.testimonial.quote}"</p>
              <footer className="blockquote-footer">
                {s.testimonial.author}
                {s.testimonial.title && `, ${s.testimonial.title}`}
              </footer>
            </blockquote>
          </section>
        )}

        <section className="mt-4 mb-4">
          <h3 className="h6">Links & Resources</h3>
          <div className="d-flex gap-3 flex-wrap align-items-center mb-3">
            {s.links?.map(l => (
              <a
                key={l.href}
                className="btn btn-outline-primary btn-sm"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => console.log('cs_link_click', slug, l.label)}
              >
                {l.label}
              </a>
            ))}
            <button
              className="btn btn-primary btn-sm"
              onClick={handleBookCall}
            >
              Book intro call
            </button>
          </div>

          {/* Social Sharing */}
          <div className="d-flex gap-2 align-items-center">
            <span className="small text-muted">Share:</span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleShare('twitter')}
              aria-label="Share on Twitter"
            >
              Twitter
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleShare('linkedin')}
              aria-label="Share on LinkedIn"
            >
              LinkedIn
            </button>
          </div>
        </section>

        {/* Related Case Studies */}
        {relatedStudies.length > 0 && (
          <section className="mt-5 pt-4 border-top">
            <h2 className="h6 mb-3">Related Case Studies</h2>
            <div className="row g-3">
              {relatedStudies.map(cs => (
                <div className="col-12 col-md-6" key={cs.slug}>
                  <div className="card h-100">
                    <div className="card-body">
                      <h4 className="h6">{cs.title}</h4>
                      <p className="small text-muted mb-2">{cs.client || cs.industry}</p>
                      <Link
                        to={`/case-studies/${cs.slug}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View case study
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

