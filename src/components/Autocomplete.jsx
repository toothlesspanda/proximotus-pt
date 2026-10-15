import { useState, useRef, useEffect } from "react"

export default function Autocomplete({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState("")
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const filtered = filter
    ? options.filter(o => o.label.toLowerCase().includes(filter.toLowerCase()))
    : options

  return (
    <div className="ac" ref={ref}>
      <input
        className="ac-input"
        placeholder={placeholder}
        value={open ? filter : value}
        onFocus={() => {
          setFilter(value)
          setOpen(true)
        }}
        onChange={e => {
          setFilter(e.target.value)
          setOpen(true)
        }}
      />
      {open && filtered.length > 0 && (
        <ul className="ac-list">
          {filtered.map(o => (
            <li
              key={o.value}
              className={`ac-option${o.label === value ? " ac-option--selected" : ""}`}
              onMouseDown={() => {
                onChange(o.label, o.value)
                setOpen(false)
              }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
