// Destination IDs per line from the Metro API
// Direction "a" = trains heading towards the LAST station in each line's station list
// Direction "b" = trains heading towards the FIRST station in each line's station list
export const DESTINATIONS = {
  vermelha: { a: { id: 60, label: "SS" }, b: { id: 38, label: "AP" } },
  verde:    { a: { id: 54, label: "CS" }, b: { id: 50, label: "TE" } },
  amarela:  { a: { id: 43, label: "RA" }, b: { id: 48, label: "OD" } },
  azul:     { a: { id: 42, label: "RB" }, b: { id: 33, label: "SP" } },
}

export const PAGE_SIZE = 10

// Perpendicular offset (SVG units) from center line to each rail track
export const TRACK_OFFSET = 167
