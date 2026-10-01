import { useState, useEffect } from "react"
import { lines } from "../data/lines"
import StationTimelines from "./StationTimelines"

export default function BottomPanel({ data, loading, onRefresh, visibleLines, onToggleLine, nearestStation, onLocate, onResetLocation, locating }) {
  const [expanded, setExpanded] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  useEffect(() => {
    if (nearestStation) setExpanded(true)
  }, [nearestStation])

  return (
    <div className="info-panel">
      <div className="info-panel-header">
        <div className="info-panel-title">
          <button
            className="info-panel-toggle"
            onClick={() => setExpanded((e) => !e)}
          >
            <span className={`info-panel-arrow ${expanded ? "info-panel-arrow--open" : ""}`}>&#9650;</span>
            Próximos comboios
          </button>
          <button className={`refresh-btn${loading ? " refresh-btn--loading" : ""}`} onClick={onRefresh} title="Atualizar">&#8635;</button>
        </div>
        <div className="info-panel-right">
          <div className="legend">
            {Object.entries(lines).map(([lineId, line]) => (
              <button
                key={lineId}
                className={`legend-item ${visibleLines.has(lineId) ? "" : "legend-item--hidden"}`}
                onClick={() => onToggleLine(lineId)}
              >
                <div className="legend-dot" style={{ background: line.color }} />
              </button>
            ))}
          </div>
          <button
            className={`about-btn${nearestStation ? " about-btn--active" : ""}${locating ? " locating" : ""}`}
            onClick={() => nearestStation ? onResetLocation() : onLocate()}
            title={nearestStation ? "Limpar localização" : "A minha localização"}
          >
            {locating ? "..." : <svg viewBox="-24 -34 48 68" width="16" height="16"><path d="M0-30c-11 0-20 9-20 20C-20 1 0 30 0 30S20 1 20-10C20-21 11-30 0-30z" fill="currentColor" /><circle cx="0" cy="-10" r="8" fill="var(--color-surface)" /></svg>}
          </button>
          <button className={`about-btn${showAbout ? " about-btn--active" : ""}`} onClick={() => setShowAbout(a => !a)} title="Sobre">?</button>
        </div>
      </div>

      <StationTimelines data={data} loading={loading} expanded={expanded} />

      {showAbout && (
        <div className="about-panel">
          <h3>Proximotus</h3>
          <p>Mapa interativo em tempo real do Metro de Lisboa.</p>
          <p>Projeto open source — mostra a posição estimada dos comboios e tempos de espera em cada estação, utilizando dados da API pública do Metropolitano de Lisboa.</p>
          <div className="about-links">
            <a href="https://api.metrolisboa.pt" target="_blank" rel="noopener noreferrer">API Metro de Lisboa</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
          <p className="about-disclaimer">Este projeto não é afiliado ao Metropolitano de Lisboa. Os dados são fornecidos pela API pública e podem não refletir a situação exata em tempo real.</p>
        </div>
      )}
    </div>
  )
}
