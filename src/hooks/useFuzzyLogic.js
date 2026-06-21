import { useMemo } from 'react'

// Triangular/trapezoidal membership function
function triMF(x, a, b, c) {
  if (x <= a || x >= c) return 0
  if (x === b) return 1
  if (x < b) return (x - a) / (b - a)
  return (c - x) / (c - b)
}

// LOW: trapezoid 0-0-30-60, MED: triangle 30-50-70, HIGH: trapezoid 40-70-100-100
function fuzzify(value) {
  const low = value <= 30 ? 1 : value >= 60 ? 0 : (60 - value) / 30
  const med = triMF(value, 30, 50, 70)
  const high = value <= 40 ? 0 : value >= 70 ? 1 : (value - 40) / 30
  return { low, med, high }
}

export default function useFuzzyLogic({ suspicion, voteErraticness, previousLies, aggression }) {
  return useMemo(() => {
    const S = fuzzify(suspicion)
    const V = fuzzify(voteErraticness)
    const L = fuzzify(previousLies)
    const B = fuzzify(aggression)

    // Simplified rule matrix (Mamdani-style) — EXECUTE / OBSERVE / ALLIANCE
    const rules = [
      { label: 'IF Lies is HIGH', weight: L.high, output: 'execute' },
      { label: 'IF Sus is HIGH AND Beh is HIGH', weight: Math.min(S.high, B.high), output: 'execute' },
      { label: 'IF Sus is HIGH AND Vote is HIGH', weight: Math.min(S.high, V.high), output: 'execute' },
      { label: 'IF Vote is HIGH AND Beh is HIGH', weight: Math.min(V.high, B.high), output: 'execute' },
      { label: 'IF Sus is HIGH AND Lies is MED', weight: Math.min(S.high, L.med), output: 'execute' },
      { label: 'IF Vote is HIGH AND Lies is MED', weight: Math.min(V.high, L.med), output: 'execute' },
      { label: 'IF Beh is HIGH AND Lies is MED', weight: Math.min(B.high, L.med), output: 'execute' },
      { label: 'IF Sus is MED AND Beh is MED', weight: Math.min(S.med, B.med), output: 'observe' },
      { label: 'IF Vote is MED AND Lies is MED', weight: Math.min(V.med, L.med), output: 'observe' },
      { label: 'IF Sus is LOW AND Lies is LOW', weight: Math.min(S.low, L.low), output: 'alliance' },
      { label: 'IF Vote is LOW AND Beh is LOW', weight: Math.min(V.low, B.low), output: 'alliance' },
    ]

    const executeClipped = Math.min(1, Math.max(...rules.filter(r => r.output === 'execute').map(r => r.weight), 0))
    const observeClipped = Math.min(1, Math.max(...rules.filter(r => r.output === 'observe').map(r => r.weight), 0))
    const allianceClipped = Math.min(1, Math.max(...rules.filter(r => r.output === 'alliance').map(r => r.weight), 0))

    // Centroid of gravity using representative output centers (Execute=85, Observe=55, Alliance=20)
    const numerator = executeClipped * 85 + observeClipped * 55 + allianceClipped * 20
    const denominator = executeClipped + observeClipped + allianceClipped
    const trustZ = denominator > 0 ? numerator / denominator : 0
    const finalTrust = Math.round(100 - trustZ) // invert so higher = more trustworthy, adjust as needed

    let directive = 'OBSERVE'
    if (executeClipped >= observeClipped && executeClipped >= allianceClipped) directive = 'EXECUTE'
    else if (allianceClipped > observeClipped) directive = 'ALLIANCE'

    return {
      memberships: { S, V, L, B },
      rules,
      clipped: { executeClipped, observeClipped, allianceClipped },
      trustZ,
      finalTrust: Math.max(0, Math.min(100, finalTrust)),
      directive,
    }
  }, [suspicion, voteErraticness, previousLies, aggression])
}