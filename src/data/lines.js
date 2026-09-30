export const LINE_COLORS = {
  azul: "var(--color-linha-azul)",
  amarela: "var(--color-linha-amarela)",
  verde: "var(--color-linha-verde)",
  vermelha: "var(--color-linha-vermelha)",
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
      { id: "aeroporto", name: "Aeroporto", x: 0, y: 500, labelPos: "above" },
      { id: "encarnacao", name: "Encarnacao", x: 600, y: 500, labelPos: "above" },
      { id: "moscavide", name: "Moscavide", x: 1300, y: 500, labelPos: "above" },
      { id: "oriente", name: "Oriente", x: 2000, y: 500, labelPos: "above" },
      { id: "cabo-ruivo", name: "Cabo Ruivo", x: 2700, y: 500, labelPos: "above" },
      { id: "olivais", name: "Olivais", x: 3400, y: 500, labelPos: "above" },
      { id: "chelas", name: "Chelas", x: 4100, y: 500, labelPos: "above" },
      { id: "bela-vista", name: "Bela Vista", x: 4800, y: 500, labelPos: "above" },
      { id: "olaias", name: "Olaias", x: 5500, y: 500, labelPos: "above" },
      { id: "alameda-vm", name: "Alameda", x: 6500, y: 1500, labelPos: "above" },
      { id: "saldanha-vm", name: "Saldanha", x: 6500, y: 3500, labelPos: "above" },
      { id: "s-sebastiao-vm", name: "S. Sebastiao", x: 6500, y: 4500, labelPos: "below" },
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
      { id: "telheiras", name: "Telheiras", x: 2000, y: 3500, labelPos: "left" },
      { id: "campo-grande-vd", name: "Campo Grande", x: 3000, y: 3000, labelPos: "below" },
      { id: "alvalade", name: "Alvalade", x: 4100, y: 1500, labelPos: "above" },
      { id: "roma", name: "Roma", x: 4800, y: 1500, labelPos: "above" },
      { id: "areeiro", name: "Areeiro", x: 5500, y: 1500, labelPos: "above" },
      { id: "alameda-vd", name: "Alameda", x: 6500, y: 1500, labelPos: "above" },
      { id: "arroios", name: "Arroios", x: 7000, y: 1500, labelPos: "above" },
      { id: "anjos", name: "Anjos", x: 7500, y: 1500, labelPos: "above" },
      { id: "intendente", name: "Intendente", x: 8000, y: 1500, labelPos: "above" },
      { id: "martim-moniz", name: "Martim Moniz", x: 8500, y: 1500, labelPos: "above" },
      { id: "rossio", name: "Rossio", x: 9000, y: 1500, labelPos: "above" },
      { id: "baixa-chiado-vd", name: "Baixa-Chiado", x: 9500, y: 1500, labelPos: "right" },
      { id: "cais-sodre", name: "Cais do Sodre", x: 10500, y: 1500, labelPos: "right" },
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
      { id: "odivelas", name: "Odivelas", x: 0, y: 2500 },
      { id: "senhor-roubado", name: "Senhor Roubado", x: 600, y: 2500 },
      { id: "ameixoeira", name: "Ameixoeira", x: 1200, y: 2500 },
      { id: "lumiar", name: "Lumiar", x: 1800, y: 2500 },
      { id: "quinta-conchas", name: "Quinta das Conchas", x: 2400, y: 2500 },
      { id: "campo-grande-am", name: "Campo Grande", x: 3000, y: 3000, labelPos: "below" },
      { id: "cidade-univ", name: "Cidade Universitaria", x: 3900, y: 3500 },
      { id: "entre-campos", name: "Entre Campos", x: 4750, y: 3500 },
      { id: "campo-pequeno", name: "Campo Pequeno", x: 5600, y: 3500 },
      { id: "saldanha-am", name: "Saldanha", x: 6500, y: 3500 },
      { id: "picoas", name: "Picoas", x: 7250, y: 3500 },
      { id: "marques-pombal-am", name: "Marques de Pombal", x: 8000, y: 3500, labelPos: "above" },
      { id: "rato", name: "Rato", x: 9000, y: 3500 },
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
      { id: "reboleira", name: "Reboleira", x: 0, y: 4500 },
      { id: "amadora-este", name: "Amadora Este", x: 650, y: 4500 },
      { id: "alfornelos", name: "Alfornelos", x: 1300, y: 4500 },
      { id: "pontinha", name: "Pontinha", x: 1950, y: 4500 },
      { id: "carnide", name: "Carnide", x: 2600, y: 4500 },
      { id: "colegioMilitar", name: "Colegio Militar/Luz", x: 3250, y: 4500 },
      { id: "altoMoinhos", name: "Alto dos Moinhos", x: 3900, y: 4500 },
      { id: "laranjeiras", name: "Laranjeiras", x: 4550, y: 4500 },
      { id: "jardimZoo", name: "Jardim Zoologico", x: 5200, y: 4500 },
      { id: "praca-espanha", name: "Praca de Espanha", x: 5850, y: 4500 },
      { id: "s-sebastiao-az", name: "S. Sebastiao", x: 6500, y: 4500 },
      { id: "parque", name: "Parque", x: 7250, y: 4500 },
      { id: "marques-pombal-az", name: "Marques de Pombal", x: 8000, y: 3500, labelPos: "below" },
      { id: "avenida", name: "Avenida", x: 8400, y: 2550, labelPos: "above" },
      { id: "restauradores", name: "Restauradores", x: 9250, y: 2300, labelPos: "right" },
      { id: "baixa-chiado-az", name: "Baixa-Chiado", x: 9500, y: 1500, labelPos: "right" },
      { id: "terreiro-paco", name: "Terreiro do Paco", x: 9550, y: 600, labelPos: "above" },
      { id: "santa-apolonia", name: "Santa Apolonia", x: 10500, y: 500, labelPos: "above" },
    ],
  },
}

export const interchanges = [
  ["campo-grande-vd", "campo-grande-am"],
  ["marques-pombal-az", "marques-pombal-am"],
  ["s-sebastiao-az", "s-sebastiao-vm"],
  ["saldanha-am", "saldanha-vm"],
  ["alameda-vd", "alameda-vm"],
  ["baixa-chiado-az", "baixa-chiado-vd"],
]

export function findStation(id) {
  for (const line of Object.values(lines)) {
    const s = line.stations.find((s) => s.id === id)
    if (s) return s
  }
  return null
}
