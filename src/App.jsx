import { useState, useEffect, useCallback } from "react"
import { lines } from "./data/lines"
import { useMetroData } from "./hooks/useMetroData"
import { useGeolocation } from "./hooks/useGeolocation"
import MetroMap from "./components/MetroMap"
import BottomPanel from "./components/BottomPanel"

const THEMES = ["dark", "light", "high-contrast"]

export default function App() {
  const [visibleLines, setVisibleLines] = useState(
    new Set(Object.keys(lines)),
  )
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark")
  const { data, loading, refresh } = useMetroData()
  const geo = useGeolocation()
  const [zoomToPointFn, setZoomToPointFn] = useState(null)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const cycleTheme = () => {
    setTheme(t => THEMES[(THEMES.indexOf(t) + 1) % THEMES.length])
  }

  const toggleLine = (lineId) => {
    setVisibleLines((prev) => {
      const next = new Set(prev)
      if (next.has(lineId)) {
        next.delete(lineId)
      } else {
        next.add(lineId)
      }
      return next
    })
  }

  const handleLocate = useCallback(() => {
    geo.locate()
  }, [geo.locate])

  useEffect(() => {
    if (!geo.nearest) return
    const { station, lines: matchedLines } = geo.nearest
    if (zoomToPointFn) {
      zoomToPointFn(station.x, station.y)
    }
    setVisibleLines(matchedLines)
  }, [geo.nearest, zoomToPointFn])

  const handleResetLocation = useCallback(() => {
    geo.clear()
    setVisibleLines(new Set(Object.keys(lines)))
  }, [geo.clear])

  const hasData = Object.keys(data).length > 0

  return (
    <>
      {!hasData && (
        <div className="loading-toast">
          <div className="loading-spinner" />
          <span>A carregar...</span>
        </div>
      )}
      <MetroMap
        visibleLines={visibleLines}
        metroData={data}
        theme={theme}
        onCycleTheme={cycleTheme}
        nearestStation={geo.nearest}
        setZoomToPointFn={setZoomToPointFn}
      />
      <BottomPanel data={data} loading={loading} onRefresh={refresh} visibleLines={visibleLines} onToggleLine={toggleLine} nearestStation={geo.nearest} onLocate={handleLocate} onResetLocation={handleResetLocation} locating={geo.locating} geoError={geo.error} />
    </>
  )
}
