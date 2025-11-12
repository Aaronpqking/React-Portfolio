import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function FilterBar({ facets, value, onChange }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const toggle = (key, v) => {
    const cur = new Set(value[key]);
    cur.has(v) ? cur.delete(v) : cur.add(v);
    const newFilters = { ...value, [key]: [...cur] };
    onChange(newFilters);

    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (cur.has(v)) {
      const existing = params.getAll(key);
      params.delete(key);
      existing.forEach(item => {
        if (item !== v) params.append(key, item);
      });
    } else {
      params.append(key, v);
    }
    setSearchParams(params);
  };

  const clearAll = () => {
    const cleared = { industries: [], stacks: [], tags: [] };
    onChange(cleared);
    setSearchParams({});
  };

  const activeCount = useMemo(() => {
    return value.industries.length + value.stacks.length + value.tags.length;
  }, [value]);

  const Chip = ({ label, active, onClick }) => (
    <button
      className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline-secondary'} me-2 mb-2`}
      onClick={onClick}
      aria-label={`Filter by ${label}`}
      type="button"
    >
      {label}
    </button>
  );

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h6 mb-0">Filters</h2>
        {activeCount > 0 && (
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary">{activeCount} active</span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={clearAll}
              type="button"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      {['industries', 'stacks', 'tags'].map(k => (
        <div key={k} className="mb-2">
          <div className="small text-muted text-uppercase mb-1">{k}</div>
          <div className="d-flex flex-wrap">
            {(facets[k] || []).map(v => (
              <Chip
                key={v}
                label={v}
                active={value[k].includes(v)}
                onClick={() => toggle(k, v)}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

