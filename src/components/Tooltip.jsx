export default function Tooltip({ info, position }) {
  if (!info) return null

  return (
    <div
      className="tooltip visible"
      style={{ left: position.x + 12, top: position.y - 30 }}
    >
      <div className="tooltip-name">{info.station.name}</div>
      <div className="tooltip-line">
        Linha {info.lineId.charAt(0).toUpperCase() + info.lineId.slice(1)}
      </div>
    </div>
  )
}
