import fastify from 'fastify'
import path from 'node:path'
import { PythonShell } from 'python-shell'

import fastifyCors from '@fastify/cors'

// import { data } from './data'
import { processCandles } from './process-candles'
import { processCounts } from './process-counts'
import { best3 } from './strategies/best-3'
import { mhi } from './strategies/mhi'
import { mhi2 } from './strategies/mhi-2'
import { mhi2High } from './strategies/mhi-2-high'
import { mhi3 } from './strategies/mhi-3'
import { mhi3High } from './strategies/mhi-3-high'
import { mhiHigh } from './strategies/mhi-high'
import { millionHigh } from './strategies/million-high'
import { millionLow } from './strategies/million-low'
import { pattern23 } from './strategies/pattern-23'
import { pattern3x1 } from './strategies/pattern-3x1'
import { threeMusketeers } from './strategies/three-musketeers'
import { twinTowers } from './strategies/twin-towers'

const strategies = [
  {
    strategy: 'mhi',
    process: mhi,
  },
  {
    strategy: 'mhi-high',
    process: mhiHigh,
  },
  {
    strategy: 'mhi-2',
    process: mhi2,
  },
  {
    strategy: 'mhi-2-high',
    process: mhi2High,
  },
  {
    strategy: 'mhi-3',
    process: mhi3,
  },
  {
    strategy: 'mhi-3-high',
    process: mhi3High,
  },
  {
    strategy: 'million-low',
    process: millionLow,
  },
  {
    strategy: 'million-high',
    process: millionHigh,
  },
  {
    strategy: 'twin-towers',
    process: twinTowers,
  },
  {
    strategy: 'three-musketeers',
    process: threeMusketeers,
  },
  {
    strategy: 'pattern-23',
    process: pattern23,
  },
  {
    strategy: 'best-3',
    process: best3,
  },
  {
    strategy: 'pattern-3x1',
    process: pattern3x1,
  },
]

const app = fastify()

app.register(fastifyCors)

app.get('/', async (request, reply) => {
  const [result] = await PythonShell.run(
    path.resolve(__dirname, '..', 'main.py'),
  )

  if (result.includes('error')) {
    return reply.status(400).send({
      message: result,
    })
  }

  const finalResult = Object.keys(JSON.parse(result)).map((key) => {
    return strategies.map(({ strategy, process }) => {
      const results = process(processCandles(JSON.parse(result)[key])).slice(
        -24,
      )

      return {
        asset: key,
        strategy,
        results,
        counts: processCounts(results),
      }
    })
  })

  return reply.send(finalResult)
})

// app.get('/example', (request, reply) => {
//   const result = Object.keys(data.assets).map((key) => {
//     return strategies.map(({ strategy, process }) => {
//       const results = process(processCandles(data.assets[key])).slice(-24)

//       return {
//         asset: key,
//         strategy,
//         results,
//         counts: processCounts(results),
//       }
//     })
//   })

//   return reply.send(result)
// })

app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => console.log('HTTP server running on port 3333.'))
