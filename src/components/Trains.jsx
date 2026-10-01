import { lines } from "../data/lines"
import { DESTINATIONS, TRACK_OFFSET } from "../constants"
import { isAtStation, offsetPoints, projectOntoTrack } from "../utils"

// Precompute offset tracks for each line and direction
const trackPaths = {}
for (const [lineId, line] of Object.entries(lines)) {
  trackPaths[lineId] = {
    a: offsetPoints(line.path, TRACK_OFFSET),
    b: offsetPoints([...line.path].reverse(), TRACK_OFFSET),
  }
}

function getTrainPositions(lineId, entries) {
  if (!entries || entries.length === 0) return []

  const line = lines[lineId]
  const stations = line.stations
  const dest = DESTINATIONS[lineId]
  const trains = []

  for (const dir of ["a", "b"]) {
    const destId = dest[dir].id
    const isForward = dir === "a"
    const ordered = isForward ? stations : [...stations].reverse()
    const track = trackPaths[lineId][dir]

    for (let i = 0; i < ordered.length; i++) {
      const station = ordered[i]
      const entry = entries.find(
        (e) => e.stop_id === station.stopId && String(e.destino) === String(destId)
      )
      if (!entry) continue

      const arrivals = [
        { time: entry.tempoChegada1, trainId: entry.comboio },
        { time: entry.tempoChegada2, trainId: entry.comboio2 },
        { time: entry.tempoChegada3, trainId: entry.comboio3 },
      ]

      for (let order = 0; order < arrivals.length; order++) {
        const { time: arrivalTime, trainId } = arrivals[order]
        if (arrivalTime == null || !trainId) continue

        let centerPos = null
        let atStation = false

        if (isAtStation(arrivalTime)) {
          centerPos = { x: station.x, y: station.y }
          atStation = true
        } else if (typeof arrivalTime === "number" || (typeof arrivalTime === "string" && arrivalTime !== "--")) {
          const secs = parseInt(arrivalTime, 10)
          if (!isNaN(secs) && secs > 0 && secs <= 120 && i > 0) {
            const prev = ordered[i - 1]
            const ratio = Math.max(0, 1 - secs / 120)
            centerPos = {
              x: prev.x + (station.x - prev.x) * ratio,
              y: prev.y + (station.y - prev.y) * ratio,
            }
          }
        }

        if (centerPos) {
          const pos = projectOntoTrack(centerPos, track)
          trains.push({ ...pos, lineId, trainId, atStation, order })
        }
      }
    }
  }

  const seen = new Set()
  return trains.filter((t) => {
    if (seen.has(t.trainId)) return false
    seen.add(t.trainId)
    return true
  })
}

export default function Trains({ metroData, visibleLines }) {
  const allTrains = []

  for (const lineId of Object.keys(lines)) {
    if (!visibleLines.has(lineId)) continue
    const positions = getTrainPositions(lineId, metroData[lineId])
    allTrains.push(...positions)
  }

  return (
    <g>
      {allTrains.map((train) => {
        const scale = train.order === 0 ? 1 : train.order === 1 ? 0.65 : 0.45
        const opacity = train.order === 0 ? 1 : train.order === 1 ? 0.6 : 0.35
        const baseW = train.atStation ? 350 : 300
        const baseH = train.atStation ? 210 : 190
        const trainW = baseW * scale
        const trainH = baseH * scale
        const color = lines[train.lineId].color
        const stopped = train.atStation && train.order === 0
        return (
          <g key={train.trainId} className={`train-marker${stopped ? " train-marker--stopped" : ""}`} style={{ color }} opacity={opacity} transform={`translate(${train.x},${train.y}) rotate(${train.angle})`}>
            <rect
              x={-trainW / 2}
              y={-trainH / 2}
              width={trainW}
              height={trainH}
              rx={20 * scale}
              className="train-body"
            />
            <polygon
              points={`${50 * scale},0 ${-25 * scale},${-35 * scale} ${-25 * scale},${35 * scale}`}
              className="train-arrow"
            />
          </g>
        )
      })}
    </g>
  )
}
