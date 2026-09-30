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

const SKIP = new Set(["de", "do", "da", "das", "dos"])

function abbreviate(name) {
  return name
    .split(/[\s/\-]+/)
    .filter(w => !SKIP.has(w.toLowerCase()))
    .map(w => w[0].toUpperCase())
    .join("")
}

export default function Interchange({ ids, shortLabels }) {
  const station = findStation(ids[0])
  if (!station) return null

  const side = station.labelPos || "above"
  const { tickProps, labelProps } = getLabelLayout(station, side)
  const r = 130

  return (
    <g>
      <circle
        cx={station.x}
        cy={station.y}
        r={r}
        fill="#fff"
        stroke="#aaa"
        strokeWidth={15}
      />
      <line
        {...tickProps}
        stroke="#fff"
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
