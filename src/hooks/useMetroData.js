import { useState, useEffect } from "react"
import { getToken, fetchWaitTimes, fetchLineStatus } from "../services/metroApi"

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

const LINE_IDS = Object.keys(LINE_NAMES)

export function useMetroData() {
  const [data, setData] = useState({})
  const [lineStatus, setLineStatus] = useState(null)
  const [refreshing, setRefreshing] = useState(true)

  async function loadAll(cancelled) {
    setRefreshing(true)

    try { await getToken() } catch (e) { console.error("Error getting token:", e); return }
    if (cancelled.current) return

    try {
      const res = await fetchLineStatus()
      if (!cancelled.current) setLineStatus(res.resposta || null)
    } catch (e) { console.error("Error line status:", e) }

    for (const lineId of LINE_IDS) {
      if (cancelled.current) return
      try {
        const res = await fetchWaitTimes(LINE_NAMES[lineId])
        if (!cancelled.current) setData(prev => ({ ...prev, [lineId]: dedup(res.resposta || []) }))
      } catch (e) { console.error(`Error ${lineId}:`, e) }
    }

    if (!cancelled.current) setRefreshing(false)
  }

  useEffect(() => {
    const cancelled = { current: false }
    let timer
    async function loop() {
      await loadAll(cancelled)
      if (!cancelled.current) timer = setTimeout(loop, 15000)
    }
    loop()
    return () => { cancelled.current = true; clearTimeout(timer) }
  }, [])

  const refresh = () => {
    const cancelled = { current: false }
    loadAll(cancelled)
  }

  return { data, lineStatus, loading: refreshing, refresh }
}
