import { useState, useCallback, useRef, useEffect, useMemo } from "react"

// map content bounds
const MAP_CONTENT = { x: -1200, y: -400, w: 11000, h: 5600 }

export function useMapControls() {
  const [viewBox, setViewBox] = useState({ ...MAP_CONTENT })
  const panRef = useRef({ isPanning: false, startX: 0, startY: 0 })
  const containerRef = useRef(null)
  const scaleRef = useRef(null)
  const initScaleRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let initialized = false

    const handleResize = () => {
      const cw = el.clientWidth
      const ch = el.clientHeight
      if (cw === 0 || ch === 0) return

      if (!initialized) {
        // first mount — compute scale to fit all content
        const scale = Math.max(MAP_CONTENT.w / cw, MAP_CONTENT.h / ch)
        scaleRef.current = scale
        initScaleRef.current = scale
        initialized = true

        const w = cw * scale
        const h = ch * scale
        const cx = MAP_CONTENT.x + MAP_CONTENT.w / 2
        const cy = MAP_CONTENT.y + MAP_CONTENT.h / 2
        setViewBox({ x: cx - w / 2, y: cy - h / 2, w, h })
      } else {
        // subsequent resizes — keep current center, adjust dimensions
        const scale = scaleRef.current
        const w = cw * scale
        const h = ch * scale
        setViewBox((prev) => {
          const cx = prev.x + prev.w / 2
          const cy = prev.y + prev.h / 2
          return { x: cx - w / 2, y: cy - h / 2, w, h }
        })
      }
    }

    handleResize()
    const ro = new ResizeObserver(handleResize)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const onMouseDown = useCallback((e) => {
    e.preventDefault()
    panRef.current = { isPanning: true, startX: e.clientX, startY: e.clientY }
  }, [])

  const onMouseMove = useCallback((e) => {
    if (!panRef.current.isPanning) return
    e.preventDefault()
    const container = containerRef.current
    if (!container) return
    const dx = (e.clientX - panRef.current.startX) * (viewBoxRef.current.w / container.clientWidth)
    const dy = (e.clientY - panRef.current.startY) * (viewBoxRef.current.h / container.clientHeight)
    panRef.current.startX = e.clientX
    panRef.current.startY = e.clientY
    setViewBox((vb) => ({ ...vb, x: vb.x - dx, y: vb.y - dy }))
  }, [])

  const onMouseUp = useCallback(() => {
    panRef.current.isPanning = false
  }, [])

  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      panRef.current = { isPanning: true, startX: touch.clientX, startY: touch.clientY }
    }
  }, [])

  const onTouchMove = useCallback((e) => {
    if (!panRef.current.isPanning || e.touches.length !== 1) return
    e.preventDefault()
    const container = containerRef.current
    if (!container) return
    const touch = e.touches[0]
    const dx = (touch.clientX - panRef.current.startX) * (viewBoxRef.current.w / container.clientWidth)
    const dy = (touch.clientY - panRef.current.startY) * (viewBoxRef.current.h / container.clientHeight)
    panRef.current.startX = touch.clientX
    panRef.current.startY = touch.clientY
    setViewBox((vb) => ({ ...vb, x: vb.x - dx, y: vb.y - dy }))
  }, [])

  const onTouchEnd = useCallback(() => {
    panRef.current.isPanning = false
  }, [])

  const applyZoom = useCallback((factor, clientX, clientY) => {
    const container = containerRef.current
    if (!container) return
    const newScale = scaleRef.current * factor
    const init = initScaleRef.current
    if (newScale < init * 0.2 || newScale > init * 3) return
    scaleRef.current = newScale

    setViewBox((vb) => {
      const cw = container.clientWidth
      const ch = container.clientHeight
      const newW = cw * newScale
      const newH = ch * newScale
      const px = clientX != null ? clientX / cw : 0.5
      const py = clientY != null ? clientY / ch : 0.5
      const mx = vb.x + px * vb.w
      const my = vb.y + py * vb.h
      return { w: newW, h: newH, x: mx - px * newW, y: my - py * newH }
    })
  }, [])

  const onWheel = useCallback((e) => {
    e.preventDefault()
    const factor = e.deltaY > 0 ? 1.1 : 0.9
    applyZoom(factor, e.clientX, e.clientY)
  }, [applyZoom])

  const zoomIn = useCallback(() => applyZoom(0.8), [applyZoom])
  const zoomOut = useCallback(() => applyZoom(1.25), [applyZoom])

  const zoomReset = useCallback(() => {
    const container = containerRef.current
    if (!container || !initScaleRef.current) return
    scaleRef.current = initScaleRef.current
    const cw = container.clientWidth
    const ch = container.clientHeight
    const scale = scaleRef.current
    const w = cw * scale
    const h = ch * scale
    const cx = MAP_CONTENT.x + MAP_CONTENT.w / 2
    const cy = MAP_CONTENT.y + MAP_CONTENT.h / 2
    setViewBox({ x: cx - w / 2, y: cy - h / 2, w, h })
  }, [])

  const zoomToPoint = useCallback((svgX, svgY, zoomFactor = 0.35) => {
    const container = containerRef.current
    if (!container || !initScaleRef.current) return
    const newScale = initScaleRef.current * zoomFactor
    scaleRef.current = newScale
    const cw = container.clientWidth
    const ch = container.clientHeight
    const w = cw * newScale
    const h = ch * newScale
    setViewBox({ x: svgX - w / 2, y: svgY - h / 2, w, h })
  }, [])

  // keep a ref to viewBox for use in move handlers (avoids stale closures)
  const viewBoxRef = useRef(viewBox)
  viewBoxRef.current = viewBox

  const handlers = useMemo(() => ({
    onMouseDown, onMouseMove, onMouseUp, onMouseLeave: onMouseUp,
    onTouchStart, onTouchMove, onTouchEnd,
  }), [onMouseDown, onMouseMove, onMouseUp, onTouchStart, onTouchMove, onTouchEnd])

  return { viewBox, containerRef, handlers, onWheel, zoomIn, zoomOut, zoomReset, zoomToPoint }
}
