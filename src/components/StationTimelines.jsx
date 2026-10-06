import { useState } from "react"
import { lines } from "../data/lines"
import { DESTINATIONS, PAGE_SIZE } from "../constants"
import { isAtStation, formatTime, shortName } from "../utils"

function getStationEntry(data, lineId, stopId, dir, isTerminal) {
  const entries = data[lineId]
  const dest = DESTINATIONS[lineId]
  if (!entries || !dest) return null
  const entry = entries.find((e) => e.stop_id === stopId && String(e.destino) === String(dest[dir].id))
  if (entry) return entry
  if (isTerminal) {
    const otherDir = dir === "a" ? "b" : "a"
    return entries.find((e) => e.stop_id === stopId && String(e.destino) === String(dest[otherDir].id)) || null
  }
  return null
}

function getStoppedStations(data, lineId) {
  const entries = data[lineId]
  if (!entries || entries.length === 0) return "—"
  const line = lines[lineId]
  const stopped = []
  const seen = new Set()
  for (const e of entries) {
    if (isAtStation(e.tempoChegada1)) {
      const station = line.stations.find((s) => s.stopId === e.stop_id)
      const name = station ? station.name : e.stop_id
      if (!seen.has(name)) {
        seen.add(name)
        stopped.push(name)
      }
    }
  }
  return stopped.length > 0 ? stopped.join(", ") : "—"
}

function renderIndicator(entry) {
  if (!entry) return <td className="coord-indicator" />
  const tempo = entry.tempoChegada1
  const atStn = isAtStation(tempo)
  const secs = typeof tempo === "number" ? tempo : parseInt(tempo, 10)
  const near = !atStn && !isNaN(secs) && secs <= 60
  if (atStn) return <td className="coord-indicator"><span className="coord-train coord-train--stopped">■</span></td>
  if (near) return <td className="coord-indicator"><span className="coord-train coord-train--near">■</span></td>
  return <td className="coord-indicator" />
}

function renderTimeCell(t, isPrimary, comboio) {
  if (t == null) return <td className={`coord-num${isPrimary ? " coord-primary" : " coord-secondary"}`}>—</td>
  const atStn = isAtStation(t)
  const cls = `coord-num${isPrimary ? " coord-primary" : " coord-secondary"}${atStn ? " coord-here" : ""}`
  const label = comboio ? <span className="coord-train-id">{comboio}</span> : null
  if (atStn) return <td className={cls}>{label}stop</td>
  return <td className={cls}>{label}{formatTime(t) ?? "—"}</td>
}

function terminalName(lineId, dir) {
  const label = DESTINATIONS[lineId][dir].label
  const station = lines[lineId].stations.find(s => s.stopId === label)
  return station ? shortName(station.name) : label
}

function renderLineTable(data, lineId, stations) {
  return (
    <table>
      <thead>
        <tr>
          <th>Estação</th>
          <th className="coord-indicator" />
          <th className="coord-num coord-primary">↓{terminalName(lineId, "a")}</th>
          <th className="coord-num coord-secondary">2o</th>
          <th className="coord-indicator" />
          <th className="coord-num coord-primary">↑{terminalName(lineId, "b")}</th>
          <th className="coord-num coord-secondary">2o</th>
        </tr>
      </thead>
      <tbody>
        {stations.map((s) => {
          const isTerminalA = s.terminal && s.stopId === DESTINATIONS[lineId].a.label
          const isTerminalB = s.terminal && s.stopId === DESTINATIONS[lineId].b.label
          const eA = isTerminalA ? null : getStationEntry(data, lineId, s.stopId, "a", isTerminalB)
          const eB = isTerminalB ? null : getStationEntry(data, lineId, s.stopId, "b", isTerminalA)
          return (
            <tr key={s.stopId}>
              <td className="coord-station" title={s.name}>{shortName(s.name)}</td>
              {renderIndicator(eA)}
              {renderTimeCell(isTerminalA ? undefined : eA?.tempoChegada1, true, eA?.comboio)}
              {renderTimeCell(isTerminalA ? undefined : eA?.tempoChegada2, false, eA?.comboio2)}
              {renderIndicator(eB)}
              {renderTimeCell(isTerminalB ? undefined : eB?.tempoChegada1, true, eB?.comboio)}
              {renderTimeCell(isTerminalB ? undefined : eB?.tempoChegada2, false, eB?.comboio2)}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default function StationTimelines({ data, lineStatus, loading, expanded, visibleLines }) {
  const [pages, setPages] = useState({ vermelha: 0, verde: 0, amarela: 0, azul: 0 })
  const [showSecondary, setShowSecondary] = useState(false)

  if (!expanded) {
    return (
      <div className="info-summary">
        {Object.entries(lines).map(([lineId, line]) => (
          <div key={lineId} className="info-summary-item">
            <span className="info-summary-dot" style={{ background: line.color }} />
            <span className="info-summary-label">{line.label}</span>
            <span className="info-summary-value">{loading ? "..." : getStoppedStations(data, lineId)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="coord-legend">
        <span><span className="coord-train coord-train--stopped" /> na estação</span>
        <span><span className="coord-train coord-train--near" /> &lt;1 min</span>
        <span className="coord-legend-stop">stop = parado</span>
        <button className="coord-secondary-toggle" onClick={() => setShowSecondary(s => !s)}>
          {showSecondary ? "−" : "+"} 2º/3º
        </button>
      </div>
      <div className={`coord-lines-stack${showSecondary ? " show-secondary" : ""}`}>
        {Object.entries(lines).sort(([a], [b]) => {
          const aVis = visibleLines?.has(a) ? 0 : 1
          const bVis = visibleLines?.has(b) ? 0 : 1
          return aVis - bVis
        }).map(([lineId, line]) => {
          const page = pages[lineId]
          const totalPages = Math.ceil(line.stations.length / PAGE_SIZE)
          const visible = line.stations.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
          return (
            <div key={lineId} className="coord-line">
              <div className="coord-line-header">
                <h3 style={{ color: line.color }}>
                  {line.label}
                  {lineStatus && (
                    <span className={`line-status-tag${lineStatus[lineId]?.trim() !== "Ok" ? " line-status-tag--warn" : ""}`}>
                      {lineStatus[lineId]?.trim() || "—"}
                    </span>
                  )}
                </h3>
                {totalPages > 1 && (
                  <div className="coord-pager">
                    <button
                      disabled={page === 0}
                      onClick={() => setPages(p => ({ ...p, [lineId]: p[lineId] - 1 }))}
                    >&#8249;</button>
                    <span>{page + 1}/{totalPages}</span>
                    <button
                      disabled={page >= totalPages - 1}
                      onClick={() => setPages(p => ({ ...p, [lineId]: p[lineId] + 1 }))}
                    >&#8250;</button>
                  </div>
                )}
              </div>
              {renderLineTable(data, lineId, visible)}
            </div>
          )
        })}
      </div>
    </>
  )
}
