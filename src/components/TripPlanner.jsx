import { useState, useMemo, useEffect } from "react"
import { findAllRoutes, estimateTotal, getWaitTime, getAllStations } from "../routeFinder"
import Autocomplete from "./Autocomplete"

const allStations = getAllStations()

function formatMins(secs) {
  const m = Math.round(secs / 60)
  return m <= 1 ? "~1 min" : `~${m} min`
}

export default function TripPlanner({ nearestStation, data }) {
  const [originName, setOriginName] = useState("")
  const [originStopId, setOriginStopId] = useState("")
  const [destName, setDestName] = useState("")
  const [destStopId, setDestStopId] = useState("")

  useEffect(() => {
    if (nearestStation?.station) {
      setOriginName(nearestStation.station.name)
      setOriginStopId(nearestStation.station.stopId)
    }
  }, [nearestStation])

  const originOptions = useMemo(() =>
    allStations
      .filter(s => s.stopId !== destStopId)
      .map(s => ({ label: s.name, value: s.stopId })),
    [destStopId]
  )

  const destOptions = useMemo(() =>
    allStations
      .filter(s => s.stopId !== originStopId)
      .map(s => ({ label: s.name, value: s.stopId })),
    [originStopId]
  )

  const routes = useMemo(() => {
    if (!originStopId || !destStopId || originStopId === destStopId) return []
    return findAllRoutes(originStopId, destStopId)
  }, [originStopId, destStopId])

  return (
    <div className="trip-planner">
      <div className="trip-field">
        <span className="trip-label">De</span>
        <Autocomplete
          options={originOptions}
          value={originName}
          placeholder="Estacao de partida..."
          onChange={(name, stopId) => { setOriginName(name); setOriginStopId(stopId) }}
        />
      </div>
      <div className="trip-field">
        <span className="trip-label">Para</span>
        <Autocomplete
          options={destOptions}
          value={destName}
          placeholder="Escolher destino..."
          onChange={(name, stopId) => { setDestName(name); setDestStopId(stopId) }}
        />
      </div>

      {routes.length > 0 && (
        <div className="trip-routes">
          {routes.map((route, ri) => {
            const firstStep = route[0]
            const waitSecs = getWaitTime(data, firstStep.lineId, firstStep.stops[0], firstStep.direction)
            const totalSecs = estimateTotal(route, waitSecs)
            const transfers = route.length - 1

            return (
              <div key={ri} className={`trip-route${ri === 0 ? " trip-route--best" : ""}`}>
                <div className="trip-route-header">
                  <span className="trip-route-time">{formatMins(totalSecs)}</span>
                  <span className="trip-route-info">
                    {transfers === 0 ? "directo" : `${transfers} transbordo${transfers > 1 ? "s" : ""}`}
                  </span>
                </div>
                <div className="trip-route-lines">
                  {route.map((step, i) => (
                    <div key={i} className="trip-step">
                      <div className="trip-line-bar" style={{ background: step.color }} />
                      <div className="trip-step-info">
                        <span className="trip-step-stations">
                          {step.stationNames[0]} → {step.stationNames[step.stationNames.length - 1]}
                        </span>
                        <span className="trip-step-meta">
                          {step.label} · {step.stops.length - 1} {step.stops.length - 1 === 1 ? "estacao" : "estacoes"}
                          {i === 0 && waitSecs != null && (
                            <> · {waitSecs === 0 ? "comboio na estacao" : `proximo em ${formatMins(waitSecs)}`}</>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
