import { TRACK_OFFSET } from "../constants"
import { offsetPoints } from "../utils"

function roundedPath(points, radius = 700) {
  if (points.length < 2) return ""
  if (points.length === 2)
    return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`

  let pathData = `M${points[0].x},${points[0].y}`

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const next = points[i + 1]

    const dx1 = curr.x - prev.x
    const dy1 = curr.y - prev.y
    const dx2 = next.x - curr.x
    const dy2 = next.y - curr.y

    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)

    const cross = dx1 * dy2 - dy1 * dx2
    if (Math.abs(cross) < 0.01) {
      pathData += ` L${curr.x},${curr.y}`
      continue
    }

    const cornerR = Math.min(curr.r ?? radius, len1 / 2, len2 / 2)

    const startX = curr.x - (dx1 / len1) * cornerR
    const startY = curr.y - (dy1 / len1) * cornerR
    const endX = curr.x + (dx2 / len2) * cornerR
    const endY = curr.y + (dy2 / len2) * cornerR

    const sweep = cross > 0 ? 1 : 0
    pathData += ` L${startX},${startY} A${cornerR},${cornerR} 0 0 ${sweep} ${endX},${endY}`
  }

  const last = points[points.length - 1]
  pathData += ` L${last.x},${last.y}`
  return pathData
}

function pathLength(points) {
  let len = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    len += Math.sqrt(dx * dx + dy * dy)
  }
  return len
}

function arrowAt(points, end, size = 120, pullBack = 100) {
  const p0 = end ? points[points.length - 1] : points[0]
  const p1 = end ? points[points.length - 2] : points[1]
  const dx = end ? (p0.x - p1.x) : (p1.x - p0.x)
  const dy = end ? (p0.y - p1.y) : (p1.y - p0.y)
  const len = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / len
  const uy = dy / len
  const px = -uy
  const py = ux

  const base = end
    ? { x: p0.x - ux * pullBack, y: p0.y - uy * pullBack }
    : { x: p0.x, y: p0.y }
  const tip = { x: base.x + ux * size, y: base.y + uy * size }
  const left = { x: base.x + px * size * 0.7, y: base.y + py * size * 0.7 }
  const right = { x: base.x - px * size * 0.7, y: base.y - py * size * 0.7 }

  return `M${tip.x},${tip.y} L${left.x},${left.y} L${right.x},${right.y} Z`
}

export default function MetroLine({ lineId, line }) {
  const forwardPoints = offsetPoints(line.path, TRACK_OFFSET)
  const reversePoints = offsetPoints([...line.path].reverse(), TRACK_OFFSET)

  const dForward = roundedPath(forwardPoints)
  const dReverse = roundedPath(reversePoints)
  const dCenter = roundedPath(line.path)

  const arrowFwdEnd = arrowAt(forwardPoints, true)
  const arrowFwdStart = arrowAt(forwardPoints, false)
  const arrowRevEnd = arrowAt(reversePoints, true)
  const arrowRevStart = arrowAt(reversePoints, false)

  const idFwd = `track-${lineId}-fwd`
  const idRev = `track-${lineId}-rev`
  const len = pathLength(line.path)
  const spacing = 800
  const count = Math.max(1, Math.floor(len / spacing))

  return (
    <g data-line={lineId}>
      <path d={dCenter} stroke={line.color} className="line-path line-path-border" />
      <path id={idFwd} d={dForward} stroke={line.color} className="line-path line-track" strokeLinecap="butt" />
      <path id={idRev} d={dReverse} stroke={line.color} className="line-path line-track" strokeLinecap="butt" />
      <path d={arrowFwdStart} className="line-track-arrow" />
      <path d={arrowFwdEnd} className="line-track-arrow" />
      <path d={arrowRevStart} className="line-track-arrow" />
      <path d={arrowRevEnd} className="line-track-arrow" />
      {Array.from({ length: count }, (_, i) => {
        const pct = ((i + 0.5) / count) * 100
        return (
          <text key={`fwd-${i}`} className="track-arrows" dy="-20" style={{ color: line.color }}>
            <textPath href={`#${idFwd}`} startOffset={`${pct}%`}>›</textPath>
          </text>
        )
      })}
      {Array.from({ length: count }, (_, i) => {
        const pct = ((i + 0.5) / count) * 100
        return (
          <text key={`rev-${i}`} className="track-arrows" dy="-20" style={{ color: line.color }}>
            <textPath href={`#${idRev}`} startOffset={`${pct}%`}>›</textPath>
          </text>
        )
      })}
    </g>
  )
}
