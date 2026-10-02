import { useState, useEffect } from "react"
import { lines } from "../data/lines"
import StationTimelines from "./StationTimelines"

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

export default function BottomPanel({ data, loading, onRefresh, visibleLines, onToggleLine, nearestStation, onLocate, onResetLocation, locating, geoError }) {
  const [expanded, setExpanded] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showGeoHelp, setShowGeoHelp] = useState(false)

  useEffect(() => {
    if (nearestStation) setExpanded(true)
  }, [nearestStation])

  useEffect(() => {
    if (geoError) setShowGeoHelp(true)
  }, [geoError])

  return (
    <div className="info-panel">
      <div className="info-panel-header">
        <div className="info-panel-title">
          <button className={`logo-btn${showAbout ? " about-btn--active" : ""}`} onClick={() => setShowAbout(a => !a)} title="Sobre">
            <img src="/logo.svg" alt="PM" width="24" height="24" />
          </button>
          <button
            className="info-panel-toggle"
            onClick={() => setExpanded((e) => !e)}
          >
            <span className={`info-panel-arrow ${expanded ? "info-panel-arrow--open" : ""}`}>&#9650;</span>
            Próximos comboios
          </button>
          <button className="refresh-btn" onClick={onRefresh} title="Atualizar"><span className={loading ? "refresh-icon refresh-icon--loading" : "refresh-icon"}>&#8635;</span></button>
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
            className={`about-btn${nearestStation ? " about-btn--active" : ""}${geoError ? " about-btn--error" : ""}${locating ? " locating" : ""}`}
            onClick={() => geoError ? setShowGeoHelp(true) : nearestStation ? onResetLocation() : onLocate()}
            title={nearestStation ? "Limpar localização" : "A minha localização"}
          >
            {locating ? "..." : geoError ? "!" : <svg viewBox="-24 -34 48 68" width="16" height="16"><path d="M0-30c-11 0-20 9-20 20C-20 1 0 30 0 30S20 1 20-10C20-21 11-30 0-30z" fill="currentColor" /><circle cx="0" cy="-10" r="8" fill="var(--color-surface)" /></svg>}
          </button>
        </div>
      </div>

      <div className="info-panel-body">
        <StationTimelines data={data} loading={loading} expanded={expanded} />
      </div>

      {showAbout && (
        <div className="about-panel">
          <img src="/logo-full.svg" alt="Proximotus" className="about-logo" />
          <p>Mapa interativo em tempo real do Metro de Lisboa.</p>
          <p>Projeto open source — mostra a posição estimada dos comboios e tempos de espera em cada estação, utilizando dados da API pública do Metropolitano de Lisboa.</p>
          <div className="about-links">
            <a href="https://api.metrolisboa.pt" target="_blank" rel="noopener noreferrer">API Metro de Lisboa</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
          <p className="about-disclaimer">Este projeto não é afiliado ao Metropolitano de Lisboa. Os dados são fornecidos pela API pública e podem não refletir a situação exata em tempo real.</p>
        </div>
      )}

      {showGeoHelp && (
        <div className="geo-help-overlay" onClick={() => setShowGeoHelp(false)}>
          <div className="geo-help-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Localização indisponível</h3>
            <p>{geoError}</p>
            {isIOS ? (
              <ol>
                <li>Abra <strong>Definições</strong> no seu dispositivo</li>
                <li>Vá a <strong>Privacidade e Segurança → Serviços de localização</strong></li>
                <li>Verifique que está <strong>ativado</strong></li>
                <li>Toque em <strong>Safari</strong> (ou o seu browser) e selecione <strong>Ao usar a app</strong></li>
                <li>Volte ao site e toque no <strong>"aA"</strong> na barra de endereço → <strong>Definições do site</strong> → ative <strong>Localização</strong></li>
              </ol>
            ) : (
              <ol>
                <li>Toque no <strong>cadeado/ícone</strong> na barra de endereço</li>
                <li>Selecione <strong>Permissões</strong> ou <strong>Definições do site</strong></li>
                <li>Ative a <strong>Localização</strong></li>
                <li>Se não funcionar, vá a <strong>Definições → Localização</strong> e verifique que está ativada</li>
              </ol>
            )}
            <div className="geo-help-actions">
              <button onClick={() => { setShowGeoHelp(false); onLocate() }}>Tentar novamente</button>
              <button onClick={() => setShowGeoHelp(false)} className="geo-help-dismiss">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
