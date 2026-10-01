export default function Station({ station, lineId, color, index, onHover, hideLabel, defaultSide, shortLabels, isExpanded, onToggleExpand, isNearest }) {
  const side = station.labelPos || defaultSide || (index % 2 !== 0 ? "above" : "below")

  const tickStart = 280
  const tickEnd = 370
  const labelOffset = 400

  let tickProps, labelProps

  if (side === "above") {
    tickProps = {
      x1: station.x, y1: station.y - tickStart,
      x2: station.x, y2: station.y - tickEnd,
    }
    labelProps = {
      x: station.x, y: station.y - labelOffset,
      textAnchor: "start",
      transform: `rotate(-45, ${station.x}, ${station.y - labelOffset})`,
    }
  } else if (side === "below") {
    tickProps = {
      x1: station.x, y1: station.y + tickStart,
      x2: station.x, y2: station.y + tickEnd,
    }
    labelProps = {
      x: station.x, y: station.y + labelOffset,
      textAnchor: "end",
      transform: `rotate(-45, ${station.x}, ${station.y + labelOffset})`,
    }
  } else if (side === "left") {
    tickProps = {
      x1: station.x - tickStart, y1: station.y,
      x2: station.x - tickEnd, y2: station.y,
    }
    labelProps = {
      x: station.x - labelOffset, y: station.y,
      textAnchor: "end",
      transform: `rotate(-45, ${station.x - labelOffset}, ${station.y})`,
    }
  } else {
    tickProps = {
      x1: station.x + tickStart, y1: station.y,
      x2: station.x + tickEnd, y2: station.y,
    }
    labelProps = {
      x: station.x + labelOffset, y: station.y,
      textAnchor: "start",
      transform: `rotate(-45, ${station.x + labelOffset}, ${station.y})`,
    }
  }

  return (
    <g className="station-group" onClick={() => onToggleExpand?.(`${lineId}:${station.stopId}`)} style={{ cursor: onToggleExpand ? "pointer" : undefined }}>
      <circle
        cx={station.x}
        cy={station.y}
        r={80}
        fill="var(--color-bg)"
        stroke={color}
        strokeWidth={30}
        className="station-circle"
        style={{ filter: "brightness(0.5)" }}
        data-id={station.stopId}
        data-line={lineId}
        onMouseEnter={() => onHover?.({ station, lineId })}
        onMouseLeave={() => onHover?.(null)}
      />
      {!hideLabel && (
        <>
          <line
            {...tickProps}
            stroke={color}
            strokeWidth={20}
            opacity={0.5}
          />
          <text
            {...labelProps}
            className={`station-label${isExpanded || isNearest ? " station-label--active" : ""}`}
          >
            {shortLabels ? (station.stopId || station.name) : station.name}
          </text>
        </>
      )}
    </g>
  )
}
