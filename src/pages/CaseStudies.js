import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from 'react-bootstrap';
import { CASE_STUDIES } from '../data/caseStudies';
import CaseStudyCard from '../components/CaseStudyCard';
import SearchBar from '../components/SearchBar';
import LeadCaptureModal from '../components/LeadCaptureModal';

export default function CaseStudies() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showModal, setShowModal] = useState(false);

  // Sync search with URL params (for browser back/forward)
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    console.log('cs_page_view');
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery) return CASE_STUDIES;
    
    const searchLower = searchQuery.toLowerCase();
    return CASE_STUDIES.filter(cs => 
      cs.title.toLowerCase().includes(searchLower) ||
      (cs.client && cs.client.toLowerCase().includes(searchLower)) ||
      cs.problem.toLowerCase().includes(searchLower) ||
      cs.solution.toLowerCase().includes(searchLower) ||
      (cs.tags && cs.tags.some(t => t.toLowerCase().includes(searchLower)))
    );
  }, [searchQuery]);

  return (
    <>
      <LeadCaptureModal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        triggerSource="case-studies-page"
      />
      <Helmet>
        <title>Case Studies & Demos</title>
        <meta name="description" content="Scannable case studies with KPIs, demos, and architecture notes." />
        <meta property="og:title" content="Case Studies & Demos" />
        <meta property="og:description" content="Scannable case studies with KPIs, demos, and architecture notes." />
        <meta property="og:type" content="website" />
      </Helmet>
      <main className="container py-4">
        <header className="mb-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h1 className="h3 mb-1">Case Studies & Demos</h1>
              <p className="text-muted">Outcomes, stack, and live demos.</p>
            </div>
            <Button 
              variant="primary"
              onClick={() => setShowModal(true)}
              className="d-none d-md-block"
            >
              Get Started
            </Button>
          </div>
        </header>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {filtered.length === 0 ? (
          <div className="alert alert-info" role="alert">
            <p className="mb-0">No case studies match your search. Try a different search term.</p>
          </div>
        ) : (
          <div className="row g-3 mt-2">
            {filtered.map(s => (
              <div className="col-12 col-md-4" key={s.slug}>
                <CaseStudyCard s={s} />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

