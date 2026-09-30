export default function Controls({ onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="controls">
      <button onClick={onZoomIn}>+</button>
      <button onClick={onZoomOut}>-</button>
      <button onClick={onReset}>R</button>
    </div>
  )
}
