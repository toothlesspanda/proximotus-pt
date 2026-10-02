import { useState, useEffect } from "react"
import { fetchWaitTimes, fetchLineStatus } from "../services/metroApi"

const LINE_NAMES = {
  vermelha: "Vermelha",
  verde: "Verde",
  amarela: "Amarela",
  azul: "Azul",
}

// Keep only the most recent entry per stop_id + destino (by timestamp)
function dedup(entries) {
  const best = {}
  for (const e of entries) {
    const key = `${e.stop_id}:${e.destino}`
    if (!best[key] || e.hora > best[key].hora) {
      best[key] = e
    }
  }
  return Object.values(best)
}

export function useMetroData() {
  const [data, setData] = useState({})
  const [lineStatus, setLineStatus] = useState(null)
  const [refreshing, setRefreshing] = useState(true)

  function loadData(cancelled, isManual) {
    setRefreshing(true)

    fetchLineStatus()
      .then(res => { if (!cancelled.current) setLineStatus(res.resposta || null) })
      .catch(e => console.error("Error line status:", e))

    const lineIds = Object.keys(LINE_NAMES)
    let chain = Promise.resolve()
    for (const lineId of lineIds) {
      chain = chain.then(() => {
        if (cancelled.current) return
        return fetchWaitTimes(LINE_NAMES[lineId])
          .then(res => {
            if (!cancelled.current) setData(prev => ({ ...prev, [lineId]: dedup(res.resposta || []) }))
          })
          .catch(e => console.error(`Error ${lineId}:`, e))
      })
    }
    chain.then(() => { if (!cancelled.current) setRefreshing(false) })
  }

  useEffect(() => {
    const cancelled = { current: false }
    loadData(cancelled, false)
    const interval = setInterval(() => loadData(cancelled, false), 5000)
    return () => { cancelled.current = true; clearInterval(interval) }
  }, [])

  const refresh = () => {
    const cancelled = { current: false }
    loadData(cancelled, true)
  }

  return { data, lineStatus, loading: refreshing, refresh }
}
