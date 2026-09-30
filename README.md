# Proximotus

**Proximotus** — *proxima deslocação*, do latim — é uma aplicação web interactiva que apresenta o mapa do metro de Lisboa em tempo real.

## Funcionalidades

- Mapa SVG interactivo com pan (arrastar) e zoom (scroll / botões)
- Linhas do metro de Lisboa: Azul, Amarela, Verde e Vermelha
- Estações posicionadas ao longo das linhas com labels a 45°
- Marcadores de interseção nas estações partilhadas entre linhas
- Toggle entre nomes completos e abreviações (iniciais)
- Legenda com visibilidade por linha
- Painel inferior com informação de estações e próximo comboio (em desenvolvimento)
- Adapta-se ao tamanho do ecrã mantendo a escala visual

## Stack

- React + Vite
- SVG nativo (sem dependências de mapas)

## Desenvolvimento

```bash
npm install
npm run dev
```

## Licença

MIT
