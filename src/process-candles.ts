import dayjs from 'dayjs'

import { CandleRaw } from './types'

export function processCandles(candles: CandleRaw[]) {
  return candles
    .map((candle) => {
      return {
        ...candle,
        at: dayjs(new Date(candle.at / 1000000)).subtract(3, 'hour'),
        result:
          candle.open < candle.close
            ? 'call'
            : candle.open > candle.close
            ? 'put'
            : 'doji',
      }
    })
    .filter((candle) => candle.at.second() === 0)
    .map((candle) => {
      return {
        ...candle,
        at: candle.at.subtract(1, 'minute').toDate(),
      }
    })
}
