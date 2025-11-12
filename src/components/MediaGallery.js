import { useState } from 'react';

export default function MediaGallery({ items = [] }) {
  const [imageErrors, setImageErrors] = useState({});

  if (!items.length) return null;

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const convertLoomUrl = (url) => {
    if (!url) return url;
    // Convert Loom share URLs to embed URLs
    if (url.includes('loom.com/share/')) {
      return url.replace('loom.com/share/', 'loom.com/embed/');
    }
    return url;
  };

  return (
    <section className="mb-3">
      <h2 className="h6">Media</h2>
      <div className="row g-2">
        {items.map((m, i) => (
          <div className="col-12" key={i}>
            {m.type === 'image' ? (
              imageErrors[i] ? (
                <div className="img-fluid rounded bg-light d-flex align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                  <span className="text-muted">Image not available</span>
                </div>
              ) : (
                <img
                  className="img-fluid rounded"
                  src={m.src}
                  alt={m.alt}
                  loading="lazy"
                  onError={() => handleImageError(i)}
                />
              )
            ) : (
              <div className="ratio ratio-16x9">
                <iframe
                  src={convertLoomUrl(m.src)}
                  title={m.alt}
                  allowFullScreen
                  frameBorder="0"
                />
              </div>
            )}
            {m.caption && (
              <p className="small text-muted mt-1">{m.caption}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

