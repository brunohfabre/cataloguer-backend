import { Candle } from '../types'

export function mhi3(candles: Candle[]) {
  return candles
    .map((candle, index) => {
      if (
        ['2', '7'].includes(
          String(candle.at.getMinutes()).padStart(2, '0').slice(1),
        )
      ) {
        const previousFrame = candles.slice(index - 5, index - 2)

        if (previousFrame.length < 3) {
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

        if (
          previousFrame.filter((candle) => candle.result === 'call').length >= 2
        ) {
          expected = 'put'
        } else {
          expected = 'call'
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
