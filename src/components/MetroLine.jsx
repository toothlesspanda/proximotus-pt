function roundedPath(points, radius = 700) {
  if (points.length < 2) return ""
  if (points.length === 2)
    return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`

  let d = `M${points[0].x},${points[0].y}`

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
      d += ` L${curr.x},${curr.y}`
      continue
    }

    const r = Math.min(curr.r ?? radius, len1 / 2, len2 / 2)

    const startX = curr.x - (dx1 / len1) * r
    const startY = curr.y - (dy1 / len1) * r
    const endX = curr.x + (dx2 / len2) * r
    const endY = curr.y + (dy2 / len2) * r

    const sweep = cross > 0 ? 1 : 0
    d += ` L${startX},${startY} A${r},${r} 0 0 ${sweep} ${endX},${endY}`
  }

  const last = points[points.length - 1]
  d += ` L${last.x},${last.y}`
  return d
}

export default function MetroLine({ lineId, line }) {
  const d = roundedPath(line.path)

  return (
    <g data-line={lineId}>
      <path
        d={d}
        stroke={line.color}
        className="line-path line-path-border"
      />
      <path
        d={d}
        stroke={line.color}
        className="line-path"
      />
    </g>
  )
}
