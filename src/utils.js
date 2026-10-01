export function isAtStation(t) {
  return t === "--" || t === 0 || t === "0"
}

export function formatTime(t) {
  if (!t || t === "--") return null
  const secs = typeof t === "number" ? t : parseInt(t, 10)
  if (isNaN(secs)) return null
  const min = Math.floor(secs / 60)
  const sec = secs % 60
  return `${min}:${String(sec).padStart(2, "0")}`
}

const SKIP_WORDS = new Set(["de", "do", "da", "dos", "das"])

export function shortName(name) {
  const parts = name.split(/[\s/]+/)
  if (parts.length <= 1) return name
  return parts[0] + " " + parts.slice(1).map(w =>
    SKIP_WORDS.has(w.toLowerCase()) ? w : w[0] + "."
  ).join(" ")
}

// Project a point onto a polyline, returning the closest position and the
// segment angle (in degrees). Used to snap train markers onto track paths.
export function projectOntoTrack(point, track) {
  let bestDist = Infinity
  let bestX = point.x
  let bestY = point.y
  let bestAngle = 0

  for (let i = 0; i < track.length - 1; i++) {
    const segStartX = track[i].x, segStartY = track[i].y
    const segEndX = track[i + 1].x, segEndY = track[i + 1].y
    const segDx = segEndX - segStartX, segDy = segEndY - segStartY
    const segLen = Math.sqrt(segDx * segDx + segDy * segDy)
    if (segLen === 0) continue

    // Parametric projection of point onto segment (0 = start, 1 = end)
    let param = ((point.x - segStartX) * segDx + (point.y - segStartY) * segDy) / (segLen * segLen)
    param = Math.max(0, Math.min(1, param))

    // Closest point on segment
    const projX = segStartX + param * segDx
    const projY = segStartY + param * segDy
    const dist = Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2)

    if (dist < bestDist) {
      bestDist = dist
      bestX = projX
      bestY = projY
      bestAngle = Math.atan2(segDy, segDx) * (180 / Math.PI)
    }
  }

  return { x: bestX, y: bestY, angle: bestAngle }
}

// Offset a polyline by a perpendicular distance (miter-join corners)
export function offsetPoints(points, offset) {
  const result = []
  for (let i = 0; i < points.length; i++) {
    let nx, ny

    if (i === 0) {
      const dx = points[1].x - points[0].x
      const dy = points[1].y - points[0].y
      const len = Math.sqrt(dx * dx + dy * dy)
      nx = -dy / len
      ny = dx / len
    } else if (i === points.length - 1) {
      const dx = points[i].x - points[i - 1].x
      const dy = points[i].y - points[i - 1].y
      const len = Math.sqrt(dx * dx + dy * dy)
      nx = -dy / len
      ny = dx / len
    } else {
      const dx1 = points[i].x - points[i - 1].x
      const dy1 = points[i].y - points[i - 1].y
      const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
      const n1x = -dy1 / len1
      const n1y = dx1 / len1

      const dx2 = points[i + 1].x - points[i].x
      const dy2 = points[i + 1].y - points[i].y
      const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
      const n2x = -dy2 / len2
      const n2y = dx2 / len2

      nx = n1x + n2x
      ny = n1y + n2y
      const nlen = Math.sqrt(nx * nx + ny * ny)

      if (nlen < 0.001) {
        nx = n1x
        ny = n1y
      } else {
        nx /= nlen
        ny /= nlen
        const dot = n1x * nx + n1y * ny
        if (Math.abs(dot) > 0.001) {
          nx /= dot
          ny /= dot
        }
      }
    }

    result.push({
      x: points[i].x + nx * offset,
      y: points[i].y + ny * offset,
    })
  }
  return result
}
