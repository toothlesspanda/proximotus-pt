export default function Grid({ viewBox, step = 500 }) {
  const startX = Math.floor(viewBox.x / step) * step
  const endX = Math.ceil((viewBox.x + viewBox.w) / step) * step
  const startY = Math.floor(viewBox.y / step) * step
  const endY = Math.ceil((viewBox.y + viewBox.h) / step) * step

  const elements = []

  for (let x = startX; x <= endX; x += step) {
    const major = x % (step * 2) === 0
    elements.push(
      <line key={`v${x}`} x1={x} y1={startY} x2={x} y2={endY}
        stroke="var(--color-border-light)" strokeWidth={major ? 12 : 6} opacity={major ? 0.5 : 0.2} />
    )
    if (major) {
      elements.push(
        <text key={`vl${x}`} x={x + 15} y={startY + 100} textAnchor="start"
          fill="var(--color-text-muted)" fontSize={80} opacity={0.6}>{x}</text>
      )
    }
  }

  for (let y = startY; y <= endY; y += step) {
    const major = y % (step * 2) === 0
    elements.push(
      <line key={`h${y}`} x1={startX} y1={y} x2={endX} y2={y}
        stroke="var(--color-border-light)" strokeWidth={major ? 12 : 6} opacity={major ? 0.5 : 0.2} />
    )
    if (major) {
      elements.push(
        <text key={`hl${y}`} x={startX + 20} y={y - 15} textAnchor="start"
          fill="var(--color-text-muted)" fontSize={80} opacity={0.6}>{y}</text>
      )
    }
  }

  return <g className="grid">{elements}</g>
}
