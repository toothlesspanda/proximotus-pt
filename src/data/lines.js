export const LINE_COLORS = {
  azul: "var(--color-line-azul)",
  amarela: "var(--color-line-amarela)",
  verde: "var(--color-line-verde)",
  vermelha: "var(--color-line-vermelha)",
}

export const lines = {
  vermelha: {
    color: LINE_COLORS.vermelha,
    label: "Vermelha",
    labelSide: "above",
    path: [
      { x: 0, y: 500 },
      { x: 6500, y: 500 },
      { x: 6500, y: 4700 },
    ],
    stations: [
      { id: 1, stopId: "AP", name: "Aeroporto", x: 0, y: 500, labelPos: "above", terminal: true, lat: 38.7684, lon: -9.1283 },
      { id: 2, stopId: "EN", name: "Encarnacao", x: 600, y: 500, labelPos: "above", lat: 38.7654, lon: -9.1161 },
      { id: 3, stopId: "MO", name: "Moscavide", x: 1300, y: 500, labelPos: "above", lat: 38.7690, lon: -9.1023 },
      { id: 4, stopId: "OR", name: "Oriente", x: 2000, y: 500, labelPos: "above", lat: 38.7678, lon: -9.0990 },
      { id: 5, stopId: "CR", name: "Cabo Ruivo", x: 2700, y: 500, labelPos: "above", lat: 38.7630, lon: -9.1040 },
      { id: 6, stopId: "OL", name: "Olivais", x: 3400, y: 500, labelPos: "above", lat: 38.7590, lon: -9.1110 },
      { id: 7, stopId: "CH", name: "Chelas", x: 4100, y: 500, labelPos: "above", lat: 38.7533, lon: -9.1187 },
      { id: 8, stopId: "BV", name: "Bela Vista", x: 4800, y: 500, labelPos: "above", lat: 38.7503, lon: -9.1272 },
      { id: 9, stopId: "OS", name: "Olaias", x: 5500, y: 500, labelPos: "above", lat: 38.7441, lon: -9.1310 },
      { id: 10, stopId: "AM", name: "Alameda", x: 6500, y: 1500, labelPos: "above", lat: 38.7370, lon: -9.1335 },
      { id: 11, stopId: "SA", name: "Saldanha", x: 6500, y: 3500, labelPos: "above", lat: 38.7352, lon: -9.1452 },
      { id: 12, stopId: "SS", name: "S. Sebastiao", x: 6500, y: 4500, labelPos: "below", terminal: true, lat: 38.7342, lon: -9.1537 },
    ],
  },
  verde: {
    color: LINE_COLORS.verde,
    label: "Verde",
    labelSide: "below",
    path: [
      { x: 2000, y: 3500 },
      { x: 3000, y: 3500 },
      { x: 3000, y: 1500 },
      { x: 10500, y: 1500 },
    ],
    stations: [
      { id: 13, stopId: "TE", name: "Telheiras", x: 2000, y: 3500, labelPos: "left", terminal: true, lat: 38.7576, lon: -9.1686 },
      { id: 14, stopId: "CG", name: "Campo Grande", x: 3000, y: 3000, labelPos: "below", lat: 38.7584, lon: -9.1572 },
      { id: 15, stopId: "AM", name: "Alvalade", x: 4100, y: 1500, labelPos: "above", lat: 38.7520, lon: -9.1452 },
      { id: 16, stopId: "RM", name: "Roma", x: 4800, y: 1500, labelPos: "above", lat: 38.7472, lon: -9.1426 },
      { id: 17, stopId: "AE", name: "Areeiro", x: 5500, y: 1500, labelPos: "above", lat: 38.7413, lon: -9.1365 },
      { id: 18, stopId: "AL", name: "Alameda", x: 6500, y: 1500, labelPos: "above", lat: 38.7370, lon: -9.1335 },
      { id: 19, stopId: "AR", name: "Arroios", x: 7000, y: 1500, labelPos: "above", lat: 38.7319, lon: -9.1350 },
      { id: 20, stopId: "AN", name: "Anjos", x: 7500, y: 1500, labelPos: "above", lat: 38.7265, lon: -9.1365 },
      { id: 21, stopId: "IN", name: "Intendente", x: 8000, y: 1500, labelPos: "above", lat: 38.7232, lon: -9.1373 },
      { id: 22, stopId: "MM", name: "Martim Moniz", x: 8500, y: 1500, labelPos: "above", lat: 38.7196, lon: -9.1380 },
      { id: 23, stopId: "RO", name: "Rossio", x: 9000, y: 1500, labelPos: "above", lat: 38.7148, lon: -9.1397 },
      { id: 24, stopId: "BC", name: "Baixa-Chiado", x: 9500, y: 1500, labelPos: "right", lat: 38.7107, lon: -9.1399 },
      { id: 25, stopId: "CS", name: "Cais do Sodre", x: 10500, y: 1500, labelPos: "right", terminal: true, lat: 38.7060, lon: -9.1441 },
    ],
  },
  amarela: {
    color: LINE_COLORS.amarela,
    label: "Amarela",
    labelSide: "above",
    path: [
      { x: 0, y: 2500 },
      { x: 3000, y: 2500 },
      { x: 3000, y: 3500 },
      { x: 9000, y: 3500 },
    ],
    stations: [
      { id: 26, stopId: "OD", name: "Odivelas", x: 0, y: 2500, terminal: true, lat: 38.7932, lon: -9.1695 },
      { id: 27, stopId: "SR", name: "Senhor Roubado", x: 600, y: 2500, lat: 38.7867, lon: -9.1682 },
      { id: 28, stopId: "AX", name: "Ameixoeira", x: 1200, y: 2500, lat: 38.7811, lon: -9.1689 },
      { id: 29, stopId: "LU", name: "Lumiar", x: 1800, y: 2500, lat: 38.7714, lon: -9.1665 },
      { id: 30, stopId: "QC", name: "Quinta das Conchas", x: 2400, y: 2500, lat: 38.7649, lon: -9.1620 },
      { id: 31, stopId: "CG", name: "Campo Grande", x: 3000, y: 3000, labelPos: "below", lat: 38.7584, lon: -9.1572 },
      { id: 32, stopId: "CU", name: "Cidade Universitaria", x: 3900, y: 3500, lat: 38.7522, lon: -9.1600 },
      { id: 33, stopId: "EC", name: "Entre Campos", x: 4750, y: 3500, lat: 38.7478, lon: -9.1529 },
      { id: 34, stopId: "CP", name: "Campo Pequeno", x: 5600, y: 3500, lat: 38.7428, lon: -9.1489 },
      { id: 35, stopId: "SA", name: "Saldanha", x: 6500, y: 3500, lat: 38.7352, lon: -9.1452 },
      { id: 36, stopId: "PI", name: "Picoas", x: 7250, y: 3500, lat: 38.7320, lon: -9.1479 },
      { id: 37, stopId: "MP", name: "Marques de Pombal", x: 8000, y: 3500, labelPos: "above", lat: 38.7253, lon: -9.1500 },
      { id: 38, stopId: "RA", name: "Rato", x: 9000, y: 3500, terminal: true, lat: 38.7204, lon: -9.1546 },
    ],
  },
  azul: {
    color: LINE_COLORS.azul,
    label: "Azul",
    labelSide: "below",
    path: [
      { x: 0, y: 4500 },
      { x: 8000, y: 4500 },
      { x: 8000, y: 2500 },
      { x: 9500, y: 2500 },
      { x: 9500, y: 500 },
      { x: 10000, y: 500 },
      { x: 10500, y: 500 },
    ],
    stations: [
      { id: 39, stopId: "RB", name: "Reboleira", x: 0, y: 4500, terminal: true, lat: 38.7545, lon: -9.2238 },
      { id: 40, stopId: "AS", name: "Amadora Este", x: 650, y: 4500, lat: 38.7571, lon: -9.2151 },
      { id: 41, stopId: "AF", name: "Alfornelos", x: 1300, y: 4500, lat: 38.7589, lon: -9.2076 },
      { id: 42, stopId: "PO", name: "Pontinha", x: 1950, y: 4500, lat: 38.7624, lon: -9.1993 },
      { id: 43, stopId: "CA", name: "Carnide", x: 2600, y: 4500, lat: 38.7595, lon: -9.1901 },
      { id: 44, stopId: "CM", name: "Colegio Militar/Luz", x: 3250, y: 4500, lat: 38.7574, lon: -9.1819 },
      { id: 45, stopId: "AH", name: "Alto dos Moinhos", x: 3900, y: 4500, lat: 38.7532, lon: -9.1762 },
      { id: 46, stopId: "LA", name: "Laranjeiras", x: 4550, y: 4500, lat: 38.7475, lon: -9.1710 },
      { id: 47, stopId: "JZ", name: "Jardim Zoologico", x: 5200, y: 4500, lat: 38.7428, lon: -9.1672 },
      { id: 48, stopId: "PE", name: "Praca de Espanha", x: 5850, y: 4500, lat: 38.7385, lon: -9.1600 },
      { id: 49, stopId: "SS", name: "S. Sebastiao", x: 6500, y: 4500, lat: 38.7342, lon: -9.1537 },
      { id: 50, stopId: "PA", name: "Parque", x: 7250, y: 4500, lat: 38.7302, lon: -9.1524 },
      { id: 51, stopId: "MP", name: "Marques de Pombal", x: 8000, y: 3500, labelPos: "below", lat: 38.7253, lon: -9.1500 },
      { id: 52, stopId: "AV", name: "Avenida", x: 8400, y: 2550, labelPos: "above", lat: 38.7218, lon: -9.1463 },
      { id: 53, stopId: "RE", name: "Restauradores", x: 9250, y: 2300, labelPos: "right", lat: 38.7160, lon: -9.1422 },
      { id: 54, stopId: "BC", name: "Baixa-Chiado", x: 9500, y: 1500, labelPos: "right", lat: 38.7107, lon: -9.1399 },
      { id: 55, stopId: "TP", name: "Terreiro do Paco", x: 9550, y: 600, labelPos: "above", lat: 38.7075, lon: -9.1363 },
      { id: 56, stopId: "SP", name: "Santa Apolonia", x: 10500, y: 500, labelPos: "above", terminal: true, lat: 38.7139, lon: -9.1228 },
    ],
  },
}

export const interchanges = [
  [["verde", "CG"], ["amarela", "CG"]],
  [["azul", "MP"], ["amarela", "MP"]],
  [["azul", "SS"], ["vermelha", "SS"]],
  [["amarela", "SA"], ["vermelha", "SA"]],
  [["verde", "AL"], ["vermelha", "AM"]],
  [["azul", "BC"], ["verde", "BC"]],
]

export function findStation(lineId, stopId) {
  const line = lines[lineId]
  if (!line) return null
  return line.stations.find((s) => s.stopId === stopId) || null
}
