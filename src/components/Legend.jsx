import { lines } from "../data/lines"

export default function Legend({ visibleLines, onToggleLine }) {
  return (
    <div className="legend">
      {Object.entries(lines).map(([lineId, line]) => (
        <button
          key={lineId}
          className={`legend-item ${visibleLines.has(lineId) ? "" : "legend-item--hidden"}`}
          onClick={() => onToggleLine(lineId)}
        >
          <div className="legend-dot" style={{ background: line.color }} />
          {line.label}
        </button>
      ))}
    </div>
  )
}
