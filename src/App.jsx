import { useState } from "react"
import { lines } from "./data/lines"
import MetroMap from "./components/MetroMap"
import Legend from "./components/Legend"
import CoordPanel from "./components/CoordPanel"

export default function App() {
  const [visibleLines, setVisibleLines] = useState(
    new Set(Object.keys(lines)),
  )

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

  return (
    <>
      <header>
        <h1>Proximotus</h1>
        <Legend visibleLines={visibleLines} onToggleLine={toggleLine} />
      </header>
      <MetroMap visibleLines={visibleLines} />
      <CoordPanel />
    </>
  )
}
