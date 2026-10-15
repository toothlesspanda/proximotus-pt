import { useState, useMemo, useEffect } from "react"
import { findAllRoutes, estimateTotal, getWaitTime, getAllStations } from "../routeFinder"

const allStations = getAllStations()

function formatMins(secs) {
  const m = Math.round(secs / 60)
  return m <= 1 ? "~1 min" : `~${m} min`
}

function resolveStopId(name) {
  const match = allStations.find(s => s.name === name)
  return match ? match.stopId : ""
}

export default function TripPlanner({ nearestStation, data }) {
  const [originInput, setOriginInput] = useState("")
  const [originStopId, setOriginStopId] = useState("")
  const [destInput, setDestInput] = useState("")
  const [destStopId, setDestStopId] = useState("")

  useEffect(() => {
    if (nearestStation?.station) {
      setOriginInput(nearestStation.station.name)
      setOriginStopId(nearestStation.station.stopId)
    }
  }, [nearestStation])

  const routes = useMemo(() => {
    if (!originStopId || !destStopId || originStopId === destStopId) return []
    return findAllRoutes(originStopId, destStopId)
  }, [originStopId, destStopId])

  return (
    <div className="trip-planner">
      <div className="trip-field">
        <span className="trip-label">De</span>
        <input
          list="trip-origins"
          placeholder="Estacao de partida..."
          value={originInput}
          onChange={e => {
            setOriginInput(e.target.value)
            setOriginStopId(resolveStopId(e.target.value))
          }}
        />
        <datalist id="trip-origins">
          {allStations
            .filter(s => s.stopId !== destStopId)
            .map(s => (
              <option key={s.stopId} value={s.name} />
            ))}
        </datalist>
      </div>
      <div className="trip-field">
        <span className="trip-label">Para</span>
        <input
          list="trip-stations"
          placeholder="Escolher destino..."
          value={destInput}
          onChange={e => {
            setDestInput(e.target.value)
            setDestStopId(resolveStopId(e.target.value))
          }}
        />
        <datalist id="trip-stations">
          {allStations
            .filter(s => s.stopId !== originStopId)
            .map(s => (
              <option key={s.stopId} value={s.name} />
            ))}
        </datalist>
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
