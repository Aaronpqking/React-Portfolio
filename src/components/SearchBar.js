import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function SearchBar({ value, onChange }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localValue, setLocalValue] = useState(value || '');
  const debounceTimer = useRef(null);

  // Initialize from URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setLocalValue(urlSearch);
    onChange(urlSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Debounce the onChange and URL update
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onChange(newValue);
      
      // Update URL
      const params = new URLSearchParams(searchParams);
      if (newValue) {
        params.set('search', newValue);
      } else {
        params.delete('search');
      }
      setSearchParams(params);
      
      // Analytics
      if (newValue) {
        console.log('cs_search', newValue);
      }
    }, 300);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    setSearchParams(params);
  };

  return (
    <div className="mb-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search case studies..."
          value={localValue}
          onChange={handleChange}
          aria-label="Search case studies"
        />
        {localValue && (
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

