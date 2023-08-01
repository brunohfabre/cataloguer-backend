import { Candle } from '../types'

export function twinTowers(candles: Candle[]) {
  return candles
    .map((candle, index) => {
      if (
        ['4', '9'].includes(
          String(candle.at.getMinutes()).padStart(2, '0').slice(1),
        )
      ) {
        const previousFrame = candles.slice(index - 4, index - 3)

        if (previousFrame.length < 1) {
          return null
        }

        const nextFrame = candles.slice(index + 1, index + 3)

        if (nextFrame.length < 2) {
          return null
        }

        if (previousFrame.find((candle) => candle.result === 'doji')) {
          return {
            at: candle.at,
            result: 'doji',
          }
        }

        let expected = ''
        let result = 'loss'

        if (previousFrame[0].result === 'call') {
          expected = 'call'
        } else {
          expected = 'put'
        }

        if (candle.result === expected) {
          result = 'win'
        } else if (nextFrame[0].result === expected) {
          result = 'mg1'
        } else if (nextFrame[1].result === expected) {
          result = 'mg2'
        }

        return {
          at: candle.at,
          result,
        }
      }

      return null
    })
    .filter(Boolean)
}
