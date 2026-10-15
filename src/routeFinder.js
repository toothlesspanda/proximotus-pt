import { lines, interchanges } from "./data/lines"
import { DESTINATIONS } from "./constants"

const AVG_TRAVEL_SECS = 120 // ~2 min between stations
const TRANSFER_SECS = 180   // ~3 min to transfer

function getStationLines(stopId) {
  return Object.keys(lines).filter(
    lineId => lines[lineId].stations.some(s => s.stopId === stopId)
  )
}

function getInterchangeStop(lineA, lineB) {
  for (const [a, b] of interchanges) {
    if (a[0] === lineA && b[0] === lineB) return a[1]
    if (b[0] === lineA && a[0] === lineB) return a[1]
  }
  return null
}

function getDirection(lineId, fromStopId, toStopId) {
  const stations = lines[lineId].stations
  const fromIdx = stations.findIndex(s => s.stopId === fromStopId)
  const toIdx = stations.findIndex(s => s.stopId === toStopId)
  return toIdx > fromIdx ? "a" : "b"
}

function getStationsBetween(lineId, fromStopId, toStopId) {
  const stations = lines[lineId].stations
  const fromIdx = stations.findIndex(s => s.stopId === fromStopId)
  const toIdx = stations.findIndex(s => s.stopId === toStopId)
  if (fromIdx === -1 || toIdx === -1) return null
  return fromIdx <= toIdx
    ? stations.slice(fromIdx, toIdx + 1)
    : stations.slice(toIdx, fromIdx + 1).reverse()
}

function buildSegment(lineId, fromStopId, toStopId) {
  const between = getStationsBetween(lineId, fromStopId, toStopId)
  if (!between || between.length < 2) return null

  const line = lines[lineId]
  const dir = getDirection(lineId, fromStopId, toStopId)
  const dest = DESTINATIONS[lineId][dir]
  const destStation = dest ? line.stations.find(s => s.stopId === dest.label) : null

  return {
    lineId,
    color: line.color,
    label: line.label,
    stops: between.map(s => s.stopId),
    stationNames: between.map(s => s.name),
    direction: dir,
    destName: destStation?.name || null,
    travelSecs: (between.length - 1) * AVG_TRAVEL_SECS,
  }
}

export function findAllRoutes(originStopId, destStopId) {
  if (originStopId === destStopId) return []

  const originLines = getStationLines(originStopId)
  const destLines = getStationLines(destStopId)
  if (originLines.length === 0 || destLines.length === 0) return []

  const seen = new Set()
  const routes = []

  function addRoute(segments) {
    const filtered = segments.filter(Boolean)
    if (filtered.length === 0) return
    const key = filtered.map(s => `${s.lineId}:${s.stops[0]}-${s.stops[s.stops.length - 1]}`).join("|")
    if (seen.has(key)) return
    seen.add(key)
    routes.push(filtered)
  }

  // Direct (0 transfers)
  for (const line of originLines) {
    if (destLines.includes(line)) {
      const seg = buildSegment(line, originStopId, destStopId)
      if (seg) addRoute([seg])
    }
  }

  // 1 transfer
  for (const oLine of originLines) {
    for (const dLine of destLines) {
      if (oLine === dLine) continue
      const ic = getInterchangeStop(oLine, dLine)
      if (!ic || ic === originStopId || ic === destStopId) continue
      const seg1 = buildSegment(oLine, originStopId, ic)
      const seg2 = buildSegment(dLine, ic, destStopId)
      if (seg1 && seg2) addRoute([seg1, seg2])
    }
  }

  // 2 transfers
  for (const oLine of originLines) {
    for (const dLine of destLines) {
      if (oLine === dLine) continue
      for (const midLine of Object.keys(lines)) {
        if (midLine === oLine || midLine === dLine) continue
        const ic1 = getInterchangeStop(oLine, midLine)
        const ic2 = getInterchangeStop(midLine, dLine)
        if (!ic1 || !ic2 || ic1 === ic2) continue
        if (ic1 === originStopId || ic2 === destStopId) continue
        const seg1 = buildSegment(oLine, originStopId, ic1)
        const seg2 = buildSegment(midLine, ic1, ic2)
        const seg3 = buildSegment(dLine, ic2, destStopId)
        if (seg1 && seg2 && seg3) addRoute([seg1, seg2, seg3])
      }
    }
  }

  return routes.sort((a, b) => estimateTotal(a, null) - estimateTotal(b, null))
}

export function findRoute(originStopId, destStopId) {
  const routes = findAllRoutes(originStopId, destStopId)
  return routes.length > 0 ? routes[0] : null
}

export function estimateTotal(steps, waitSecs) {
  let total = waitSecs || 0
  for (let i = 0; i < steps.length; i++) {
    total += steps[i].travelSecs
    if (i > 0) total += TRANSFER_SECS
  }
  return total
}

export function getWaitTime(data, lineId, stopId, direction) {
  if (!data || !data[lineId] || !direction) return null
  const dest = DESTINATIONS[lineId][direction]
  if (!dest) return null
  const entry = data[lineId].find(
    e => e.stop_id === stopId && String(e.destino) === String(dest.id)
  )
  if (!entry) return null
  const t = entry.tempoChegada1
  if (t === "--" || t === 0 || t === "0") return 0
  const secs = typeof t === "number" ? t : parseInt(t, 10)
  return isNaN(secs) ? null : secs
}

export function getAllStations() {
  const seen = new Set()
  const result = []
  for (const line of Object.values(lines)) {
    for (const s of line.stations) {
      if (!seen.has(s.stopId)) {
        seen.add(s.stopId)
        result.push({ stopId: s.stopId, name: s.name })
      }
    }
  }
  return result.sort((a, b) => a.name.localeCompare(b.name, "pt"))
}
