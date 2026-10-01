import { useState, useCallback, useEffect } from "react"
import { lines } from "../data/lines"

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371e3
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const half =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(half), Math.sqrt(1 - half))
}

function findNearestStation(lat, lon) {
  let best = null
  let bestDist = Infinity
  const matchedLines = new Set()

  for (const [lineId, line] of Object.entries(lines)) {
    for (const station of line.stations) {
      if (station.lat == null || station.lon == null) continue
      const dist = haversine(lat, lon, station.lat, station.lon)
      if (dist < bestDist) {
        bestDist = dist
        best = { ...station, lineId }
      }
    }
  }

  if (best) {
    for (const [lineId, line] of Object.entries(lines)) {
      for (const station of line.stations) {
        if (station.stopId === best.stopId) {
          matchedLines.add(lineId)
        }
      }
    }
  }

  return best ? { station: best, distance: bestDist, lines: matchedLines } : null
}

const GEO_KEY = "geo_granted"

export function useGeolocation() {
  const [position, setPosition] = useState(null)
  const [nearest, setNearest] = useState(null)
  const [error, setError] = useState(null)
  const [locating, setLocating] = useState(false)

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada")
      return
    }

    setLocating(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        localStorage.setItem(GEO_KEY, "true")
        setPosition({ lat: latitude, lon: longitude })
        const result = findNearestStation(latitude, longitude)
        setNearest(result)
        setLocating(false)
      },
      (err) => {
        localStorage.removeItem(GEO_KEY)
        setError(err.message)
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }, [])

  const simulate = useCallback((lat, lon) => {
    setPosition({ lat, lon })
    const result = findNearestStation(lat, lon)
    setNearest(result)
    setError(null)
  }, [])

  const clear = useCallback(() => {
    setPosition(null)
    setNearest(null)
    setError(null)
  }, [])

  // Auto-locate on mount if previously granted
  useEffect(() => {
    if (localStorage.getItem(GEO_KEY) === "true") {
      locate()
    }
  }, [locate])

  return { position, nearest, error, locating, locate, simulate, clear }
}
