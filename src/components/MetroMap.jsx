import { useEffect, useRef, useState } from "react"
import { lines, interchanges } from "../data/lines"
import { useMapControls } from "../hooks/useMapControls"
import MetroLine from "./MetroLine"
import Station from "./Station"
import Interchange from "./Interchange"
import Trains from "./Trains"
import StationTimes from "./StationTimes"
import Grid from "./Grid"

const THEME_ICONS = { dark: "☽", light: "☀", "high-contrast": "◑" }

export default function MetroMap({ visibleLines, metroData, theme, onCycleTheme, nearestStation, setZoomToPointFn }) {
  const [shortLabels, setShortLabels] = useState(false)
  const [expandedStation, setExpandedStation] = useState(null)

  // Auto-expand nearest station badge when location is detected
  useEffect(() => {
    if (nearestStation) {
      setExpandedStation(`${nearestStation.station.lineId}:${nearestStation.station.stopId}`)
    }
  }, [nearestStation])
  const { viewBox, containerRef, handlers, onWheel, zoomIn, zoomOut, zoomReset, zoomToPoint } = useMapControls()
  const wheelRef = useRef(onWheel)
  wheelRef.current = onWheel

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e) => wheelRef.current(e)
    el.addEventListener("wheel", handler, { passive: false })
    return () => el.removeEventListener("wheel", handler)
  }, [containerRef])

  useEffect(() => {
    if (setZoomToPointFn) {
      setZoomToPointFn(() => zoomToPoint)
    }
  }, [setZoomToPointFn, zoomToPoint])

  const interchangeIds = new Set(interchanges.flat().map(([l, s]) => `${l}:${s}`))
  const vb = `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`

  return (
    <div
      ref={containerRef}
      className="map-container map-container--interactive"
      {...handlers}
    >
      <svg
        className="metro-map"
        viewBox={vb}
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          {/* <Grid viewBox={viewBox} /> */}
          {Object.entries(lines).map(([lineId, line]) => (
            <g key={lineId} opacity={visibleLines.has(lineId) ? 1 : 0.4}>
              <MetroLine lineId={lineId} line={line} />
              {line.stations.map((station, i) => (
                <Station
                  key={station.stopId}
                  station={station}
                  lineId={lineId}
                  color={line.color}
                  index={i}
                  defaultSide={line.labelSide}
                  hideLabel={interchangeIds.has(`${lineId}:${station.stopId}`)}
                  isNearest={nearestStation?.station.stopId === station.stopId}
                  shortLabels={shortLabels}
                  isExpanded={expandedStation === `${lineId}:${station.stopId}`}
                  onToggleExpand={(key) => setExpandedStation(expandedStation === key ? null : key)}
                />
              ))}
            </g>
          ))}
          {interchanges.map(([[l1, s1], [l2, s2]]) => (
            <Interchange key={`${l1}:${s1}-${l2}:${s2}`} pair={[[l1, s1], [l2, s2]]} shortLabels={shortLabels} />
          ))}
          <Trains metroData={metroData} visibleLines={visibleLines} />
          <StationTimes metroData={metroData} expandedStation={expandedStation} onToggleExpand={setExpandedStation} />
          {nearestStation && (
            <g className="location-marker" transform={`translate(${nearestStation.station.x},${nearestStation.station.y - 120}) scale(3)`}>
              <path d="M0-30c-11 0-20 9-20 20C-20 1 0 30 0 30S20 1 20-10C20-21 11-30 0-30z" className="location-dot" />
              <circle cx="0" cy="-10" r="8" className="location-dot-inner" />
            </g>
          )}
        </g>
      </svg>
      <div className="controls">
        <button onClick={zoomIn} title="Zoom in">+</button>
        <button onClick={zoomOut} title="Zoom out">&minus;</button>
        <button onClick={zoomReset} title="Centrar">&#8982;</button>
<button className={shortLabels ? "active" : ""} onClick={() => setShortLabels(s => !s)} title="Toggle labels">Aa</button>
        <button onClick={onCycleTheme} title={`Tema: ${theme}`}>{THEME_ICONS[theme]}</button>
      </div>
    </div>
  )
}
