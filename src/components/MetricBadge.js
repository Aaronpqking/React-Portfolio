import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function MetricBadge({ label, value, tooltip }) {
  const badge = (
    <span className="badge text-bg-light border me-2 mb-2">
      {label}: <strong className="ms-1">{value}</strong>
    </span>
  );

  if (tooltip) {
    return (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>{tooltip}</Tooltip>}
      >
        {badge}
      </OverlayTrigger>
    );
  }

  return badge;
}

