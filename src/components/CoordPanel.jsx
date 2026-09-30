import { useState } from "react"
import { lines } from "../data/lines"

export default function CoordPanel() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="info-panel">
      <button
        className="info-panel-toggle"
        onClick={() => setExpanded((e) => !e)}
      >
        <span className={`info-panel-arrow ${expanded ? "info-panel-arrow--open" : ""}`}>&#9650;</span>
        {expanded ? "Estações" : "Próximo comboio"}
      </button>

      {expanded ? (
        <div className="coord-panel">
          {Object.entries(lines).map(([lineId, line]) => (
            <div key={lineId} className="coord-line">
              <h3 style={{ color: line.color }}>{line.label}</h3>
              <table>
                <thead>
                  <tr><th>Estação</th><th>Próximo comboio</th></tr>
                </thead>
                <tbody>
                  {line.stations.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td className="coord-num">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <div className="info-summary">
          {Object.entries(lines).map(([lineId, line]) => (
            <div key={lineId} className="info-summary-item">
              <span className="info-summary-dot" style={{ background: line.color }} />
              <span className="info-summary-label">{line.label}</span>
              <span className="info-summary-value">—</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
