import { findStation } from "../data/lines"

const tickStart = 280
const tickEnd = 370
const labelOffset = 400

function getLabelLayout(station, side) {
  if (side === "above") {
    return {
      tickProps: {
        x1: station.x, y1: station.y - tickStart,
        x2: station.x, y2: station.y - tickEnd,
      },
      labelProps: {
        x: station.x, y: station.y - labelOffset,
        textAnchor: "start",
        transform: `rotate(-45, ${station.x}, ${station.y - labelOffset})`,
      },
    }
  }
  if (side === "below") {
    return {
      tickProps: {
        x1: station.x, y1: station.y + tickStart,
        x2: station.x, y2: station.y + tickEnd,
      },
      labelProps: {
        x: station.x, y: station.y + labelOffset,
        textAnchor: "end",
        transform: `rotate(-45, ${station.x}, ${station.y + labelOffset})`,
      },
    }
  }
  if (side === "left") {
    return {
      tickProps: {
        x1: station.x - tickStart, y1: station.y,
        x2: station.x - tickEnd, y2: station.y,
      },
      labelProps: {
        x: station.x - labelOffset, y: station.y,
        textAnchor: "end",
        transform: `rotate(-45, ${station.x - labelOffset}, ${station.y})`,
      },
    }
  }
  // right
  return {
    tickProps: {
      x1: station.x + tickStart, y1: station.y,
      x2: station.x + tickEnd, y2: station.y,
    },
    labelProps: {
      x: station.x + labelOffset, y: station.y,
      textAnchor: "start",
      transform: `rotate(-45, ${station.x + labelOffset}, ${station.y})`,
    },
  }
}

export default function Interchange({ pair, shortLabels }) {
  const [lineId, stopId] = pair[0]
  const station = findStation(lineId, stopId)
  if (!station) return null

  const side = station.labelPos || "above"
  const { tickProps, labelProps } = getLabelLayout(station, side)
  const radius = 130

  return (
    <g>
      <circle
        cx={station.x}
        cy={station.y}
        r={radius}
        fill="var(--color-accent)"
        stroke="var(--color-text-muted)"
        strokeWidth={15}
      />
      <line
        {...tickProps}
        stroke="var(--color-accent)"
        strokeWidth={20}
        opacity={0.7}
      />
      <text
        {...labelProps}
        className="station-label interchange-label"
      >
        {station.name}
      </text>
    </g>
  )
}
