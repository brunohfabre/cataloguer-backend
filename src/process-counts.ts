type CandleResultType = {
  at: string
  result: string
}

export function processCounts(results: CandleResultType[]) {
  const { doji, win, mg1, mg2, loss, total } = results.reduce(
    (acc, item) => {
      return {
        ...acc,
        [item.result]: acc[item.result] + 1,
        total: acc.total + 1,
      }
    },
    {
      doji: 0,
      win: 0,
      mg1: 0,
      mg2: 0,
      loss: 0,
      total: 0,
    } as any,
  )

  return {
    doji,
    win,
    mg1,
    mg2,
    loss,
    total,
  }
}
