import { useEffect, useRef, useState } from "react"
import { lines, interchanges } from "../data/lines"
import { useMapControls } from "../hooks/useMapControls"
import MetroLine from "./MetroLine"
import Station from "./Station"
import Interchange from "./Interchange"
import Grid from "./Grid"

export default function MetroMap({ visibleLines }) {
  const [shortLabels, setShortLabels] = useState(false)
  const { viewBox, containerRef, handlers, onWheel, zoomIn, zoomOut, zoomReset } = useMapControls()
  const wheelRef = useRef(onWheel)
  wheelRef.current = onWheel

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e) => wheelRef.current(e)
    el.addEventListener("wheel", handler, { passive: false })
    return () => el.removeEventListener("wheel", handler)
  }, [containerRef])

  const interchangeIds = new Set(interchanges.flat())
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
          {Object.entries(lines).map(
            ([lineId, line]) =>
              visibleLines.has(lineId) && (
                <MetroLine key={lineId} lineId={lineId} line={line} />
              ),
          )}
          {Object.entries(lines).map(
            ([lineId, line]) =>
              visibleLines.has(lineId) &&
              line.stations.map((station, i) => (
                <Station
                  key={station.id}
                  station={station}
                  lineId={lineId}
                  color={line.color}
                  index={i}
                  defaultSide={line.labelSide}
                  hideLabel={interchangeIds.has(station.id)}
                  shortLabels={shortLabels}
                />
              )),
          )}
          {interchanges.map(([id1, id2]) => (
            <Interchange key={`${id1}-${id2}`} ids={[id1, id2]} shortLabels={shortLabels} />
          ))}
        </g>
      </svg>
      <div className="controls">
        <button onClick={zoomIn} title="Zoom in">+</button>
        <button onClick={zoomOut} title="Zoom out">&minus;</button>
        <button onClick={zoomReset} title="Reset">&#8634;</button>
        <button onClick={() => setShortLabels(s => !s)} title="Toggle labels">{shortLabels ? "Aa" : "A"}</button>
      </div>
    </div>
  )
}
