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

export function useMetroData() {
  const [data, setData] = useState({})
  const [lineStatus, setLineStatus] = useState(null)
  const [refreshing, setRefreshing] = useState(true)

  async function loadWaitTimes(cancelled) {
    setRefreshing(true)

    try {
      await getToken()
    } catch (e) {
      console.error("Error getting token:", e)
      setRefreshing(false)
      return
    }

    if (cancelled.current) return

    const lineIds = Object.keys(LINE_NAMES)

    await Promise.all(
      lineIds.map(lineId =>
        fetchWaitTimes(LINE_NAMES[lineId])
          .then(res => {
            if (!cancelled.current) setData(prev => ({ ...prev, [lineId]: dedup(res.resposta || []) }))
          })
          .catch(e => console.error(`Error ${lineId}:`, e))
      ),
    )

    if (!cancelled.current) setRefreshing(false)
  }

  async function loadLineStatus(cancelled) {
    try {
      await getToken()
      const res = await fetchLineStatus()
      if (!cancelled.current) setLineStatus(res.resposta || null)
    } catch (e) {
      console.error("Error line status:", e)
    }
  }

  useEffect(() => {
    const cancelled = { current: false }
    let waitTimer, statusTimer

    async function waitLoop() {
      await loadWaitTimes(cancelled)
      if (!cancelled.current) waitTimer = setTimeout(waitLoop, 15000)
    }

    async function statusLoop() {
      await loadLineStatus(cancelled)
      if (!cancelled.current) statusTimer = setTimeout(statusLoop, 60000)
    }

    waitLoop()
    statusLoop()
    return () => { cancelled.current = true; clearTimeout(waitTimer); clearTimeout(statusTimer) }
  }, [])

  const refresh = () => {
    const cancelled = { current: false }
    loadData(cancelled)
  }

  return { data, lineStatus, loading: refreshing, refresh }
}
