import { lines } from "../data/lines"
import { DESTINATIONS } from "../constants"
import { isAtStation, formatTime } from "../utils"

function getEntries(data, lineId, stopId, dir) {
  const entries = data[lineId]
  const dest = DESTINATIONS[lineId]
  if (!entries || !dest) return []
  const entry = entries.find(
    (e) => e.stop_id === stopId && String(e.destino) === String(dest[dir].id)
  )
  if (!entry) return []
  const results = []
  if (entry.tempoChegada1 != null) results.push({ time: entry.tempoChegada1, comboio: entry.comboio })
  if (entry.tempoChegada2 != null) results.push({ time: entry.tempoChegada2, comboio: entry.comboio2 })
  return results
}

const ROW_H = 70
const PAD_Y = 40
const STACK_GAP = 20

function collapsedHeight(dirs) {
  return dirs.length === 1 ? 100 : 170
}

function expandedHeight(dirs) {
  const rows = dirs.reduce((sum, d) => sum + ROW_H + Math.min(d.entries.length, 3) * ROW_H, 0)
  return rows + PAD_Y * 2
}

export default function StationTimes({ metroData, expandedStation, onToggleExpand }) {
  const allStations = []

  for (const [lineId, line] of Object.entries(lines)) {
    const dest = DESTINATIONS[lineId]
    if (!dest) continue
    for (const station of line.stations) {
      const isTerminalA = station.terminal && station.stopId === dest.a.label
      const isTerminalB = station.terminal && station.stopId === dest.b.label
      let aEntries = isTerminalA ? [] : getEntries(metroData, lineId, station.stopId, "a")
      let bEntries = isTerminalB ? [] : getEntries(metroData, lineId, station.stopId, "b")
      if (isTerminalA && aEntries.length === 0) {
        const fallback = getEntries(metroData, lineId, station.stopId, "a")
        if (bEntries.length === 0 && fallback.length > 0) bEntries = fallback
      }
      if (isTerminalB && bEntries.length === 0) {
        const fallback = getEntries(metroData, lineId, station.stopId, "b")
        if (aEntries.length === 0 && fallback.length > 0) aEntries = fallback
      }
      if (aEntries.length === 0 && bEntries.length === 0) continue
      allStations.push({ station, lineId, line, aEntries, bEntries, dest, isTerminalA, isTerminalB })
    }
  }

  const badges = allStations
    .map((item) => {
      const { station, lineId, dest, aEntries, bEntries, isTerminalA, isTerminalB } = item
      const dirs = [
        !isTerminalB && { key: "b", label: dest.b.label, entries: bEntries },
        !isTerminalA && { key: "a", label: dest.a.label, entries: aEntries },
      ].filter(Boolean)
      const hasAny = dirs.some(dir => {
        const first = dir.entries[0]
        return first && (isAtStation(first.time) || formatTime(first.time) != null)
      })
      if (!hasAny) return null
      const key = `${lineId}:${station.stopId}`
      const height = expandedStation === key ? expandedHeight(dirs) : collapsedHeight(dirs)
      return { ...item, key, dirs, height }
    })
    .filter(Boolean)

  // Interchange stations share the same coordinates across lines: stack their badges
  const stackedBottom = new Map()
  for (const badge of badges) {
    const pos = `${badge.station.x},${badge.station.y}`
    const baseY = badge.station.y - (badge.dirs.length === 1 ? 50 : 85)
    const prevBottom = stackedBottom.get(pos)
    badge.badgeY = prevBottom == null ? baseY : prevBottom + STACK_GAP
    stackedBottom.set(pos, badge.badgeY + badge.height)
  }

  return (
    <g className="station-times-layer">
      {badges.map(({ station, line, aEntries, bEntries, dest, isTerminalA, isTerminalB, key, dirs, badgeY }) => {
        const isExpanded = expandedStation === key
        const badgeX = station.x

        return (
          <g key={key} onClick={() => onToggleExpand(isExpanded ? null : key)} style={{ cursor: "pointer" }}>
            {!isExpanded && (
              <g>
                <rect
                  x={badgeX - 200}
                  y={badgeY}
                  width={400}
                  height={dirs.length === 1 ? 100 : 170}
                  rx={16}
                  className="badge-bg"
                />
                {dirs.map((d, di) => {
                  const t = d.entries[0] ? formatTime(d.entries[0].time) : null
                  const at = d.entries[0] && isAtStation(d.entries[0].time)
                  const arrow = d.key === "a" ? "→" : "←"
                  const y = badgeY + 70 + di * 70
                  return (
                    <g key={d.key}>
                      <text x={badgeX - 180} y={y} className="badge-label">
                        {arrow}{d.label}
                      </text>
                      <text x={badgeX - 20} y={y} className={`badge-value${at ? " badge-value--stopped" : ""}`}>
                        {at ? "stop" : t ?? "—"}
                      </text>

                    </g>
                  )
                })}
                <text
                  x={badgeX + 150}
                  y={badgeY + (dirs.length === 1 ? 70 : 105)}
                  className="badge-toggle"
                >
                  +
                </text>
              </g>
            )}

            {isExpanded && (() => {
              const rowH = ROW_H
              const padY = PAD_Y
              const badgeW = 420

              const renderRow = (e, i, baseY) => {
                const at = isAtStation(e.time)
                const y = baseY + (i + 1) * rowH
                const secondary = i > 0
                return (
                  <g key={i} opacity={secondary ? 0.45 : 1}>
                    <text x={badgeX - badgeW / 2 + 30} y={y} className="badge-dim">
                      {e.comboio}
                    </text>
                    <text x={badgeX + badgeW / 2 - 30} y={y} className={`badge-value${at ? " badge-value--stopped" : ""}`} textAnchor="end" fontSize={secondary ? 38 : undefined}>
                      {at ? "stop" : formatTime(e.time) ?? "—"}
                    </text>
                  </g>
                )
              }

              let curY = badgeY + padY
              const sections = dirs.map((d) => {
                const count = Math.min(d.entries.length, 3)
                const sectionY = curY
                curY += rowH + count * rowH
                return { d, count, sectionY }
              })
              const totalH = curY - badgeY + padY

              return (
                <g>
                  <rect
                    x={badgeX - badgeW / 2}
                    y={badgeY}
                    width={badgeW}
                    height={totalH}
                    rx={16}
                    className="badge-bg badge-bg--expanded"
                    stroke={line.color}
                    strokeWidth={6}
                  />
                  {sections.map(({ d, count, sectionY }, si) => {
                    const arrow = d.key === "a" ? "→" : "←"
                    return (
                      <g key={d.key}>
                        {si > 0 && (
                          <line
                            x1={badgeX - badgeW / 2 + 20} y1={sectionY - 10}
                            x2={badgeX + badgeW / 2 - 20} y2={sectionY - 10}
                            className="badge-separator"
                          />
                        )}
                        <text x={badgeX - badgeW / 2 + 30} y={sectionY + rowH} className="badge-dir" fill={line.color}>
                          {arrow}{d.label}
                        </text>
                        {d.entries.slice(0, 2).map((e, i) => renderRow(e, i, sectionY + rowH))}
                      </g>
                    )
                  })}
                  <text
                    x={badgeX + badgeW / 2 - 40}
                    y={badgeY + padY + rowH - 10}
                    className="badge-toggle"
                  >
                    −
                  </text>
                </g>
              )
            })()}
          </g>
        )
      })}
    </g>
  )
}
