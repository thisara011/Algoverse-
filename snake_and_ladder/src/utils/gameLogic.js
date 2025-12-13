export const generateBoard = (N) => {
  const total = N * N
  const snakes = []
  const ladders = []
  const used = new Set([1, total])
  const MAX_ATTEMPTS = 100

  for (let i = 0; i < N - 2; i++) {
    let start, end, attempts = 0
    do {
      start = Math.floor(Math.random() * (total - 10)) + 2
      end = start + Math.floor(Math.random() * 15) + 5
      attempts++
    } while ((end >= total || used.has(start) || used.has(end)) && attempts < MAX_ATTEMPTS)
    
    if (attempts < MAX_ATTEMPTS) {
      ladders.push({ start, end })
      used.add(start); used.add(end)
    }
  }

  for (let i = 0; i < N - 2; i++) {
    let head, tail, attempts = 0
    do {
      head = Math.floor(Math.random() * (total - 10)) + 10
      tail = head - Math.floor(Math.random() * 15) - 5
      attempts++
    } while ((tail <= 1 || used.has(head) || used.has(tail)) && attempts < MAX_ATTEMPTS)
    
    if (attempts < MAX_ATTEMPTS) {
      snakes.push({ head, tail })
      used.add(head); used.add(tail)
    }
  }

  return { total, snakes, ladders }
}

export const minThrowsBFS = (total, ladders, snakes) => {
  const start = performance.now()
  const teleport = {}
  ladders.forEach(l => teleport[l.start] = l.end)
  snakes.forEach(s => teleport[s.head] = s.tail)

  const queue = [{ pos: 1, throws: 0 }]
  const visited = new Set([1])

  while (queue.length) {
    const { pos, throws } = queue.shift()
    if (pos === total) return { throws, time: performance.now() - start }
    for (let dice = 1; dice <= 6; dice++) {
      let next = pos + dice
      if (next > total) continue
      next = teleport[next] || next
      if (!visited.has(next)) {
        visited.add(next)
        queue.push({ pos: next, throws: throws + 1 })
      }
    }
  }
  return { throws: -1, time: performance.now() - start }
}

export const minThrowsDP = (total, ladders, snakes) => {
  const start = performance.now()
  const teleport = {}
  ladders.forEach(l => teleport[l.start] = l.end)
  snakes.forEach(s => teleport[s.head] = s.tail)

  const dp = Array(total + 1).fill(Infinity)
  dp[1] = 0
  let changed = true
  while(changed) {
    changed = false
    for (let i = 1; i < total; i++) {
      if (dp[i] === Infinity) continue
      for (let d = 1; d <= 6; d++) {
        let next = i + d
        if (next > total) continue
        next = teleport[next] || next
        if (dp[i] + 1 < dp[next]) {
          dp[next] = dp[i] + 1
          changed = true
        }
      }
    }
  }
  return { throws: dp[total], time: performance.now() - start }
}

export const getCoords = (pos, N) => {
  const row = Math.floor((pos - 1) / N)
  let col = (pos - 1) % N
  if (row % 2 === 1) col = N - 1 - col 
  return { row: N - 1 - row, col } 
}