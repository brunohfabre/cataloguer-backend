export type CandleRaw = {
  id: number
  from: number
  at: number
  to: number
  open: number
  close: number
  min: number
  max: number
  volume: number
}

export type Candle = {
  id: number
  from: number
  at: Date
  to: number
  open: number
  close: number
  min: number
  max: number
  volume: number
  result: 'call' | 'put' | 'doji'
}
