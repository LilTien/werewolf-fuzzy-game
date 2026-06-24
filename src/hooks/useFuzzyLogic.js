import { useMemo } from 'react'

function triMF(x, a, b, c) {
  if (x <= a || x >= c) return 0
  if (x === b) return 1
  if (x < b) return (x - a) / (b - a)
  return (c - x) / (c - b)
}

function fuzzify(value) {
  const low = value <= 30 ? 1 : value >= 60 ? 0 : (60 - value) / 30
  const med = triMF(value, 30, 50, 70)
  const high = value <= 40 ? 0 : value >= 70 ? 1 : (value - 40) / 30
  return { low, med, high }
}

const LEVELS = ['low', 'med', 'high']

// Score each level numerically so we can derive an output decision per rule
const LEVEL_SCORE = { low: 0, med: 1, high: 2 }

// Decide rule output based on weighted combination of the 4 input levels.
// Suspicion, Vote Erraticness, Previous Lies, Aggression all push toward EXECUTE when HIGH.
// This mirrors a typical Mamdani decision table - tune weights as needed.
function decideOutput(sLevel, vLevel, lLevel, bLevel) {
  const total =
    LEVEL_SCORE[sLevel] * 1.2 + // suspicion weighted slightly higher
    LEVEL_SCORE[vLevel] * 1.0 +
    LEVEL_SCORE[lLevel] * 1.1 + // lies weighted slightly higher
    LEVEL_SCORE[bLevel] * 0.9

  // max possible total = 2*(1.2+1.0+1.1+0.9) = 8.4
  const maxTotal = 2 * (1.2 + 1.0 + 1.1 + 0.9)
  const ratio = total / maxTotal

  if (ratio >= 0.62) return 'execute' // HIGH trust-risk -> act
  if (ratio >= 0.34) return 'observe' // MED -> watch
  return 'alliance' // LOW -> trust/ally
}

// Build all 81 rules: 3 (S) x 3 (V) x 3 (L) x 3 (B)
function buildRuleMatrix() {
  const rules = []
  for (const sLevel of LEVELS) {
    for (const vLevel of LEVELS) {
      for (const lLevel of LEVELS) {
        for (const bLevel of LEVELS) {
          const output = decideOutput(sLevel, vLevel, lLevel, bLevel)
          rules.push({
            label: `IF Sus is ${sLevel.toUpperCase()} AND Vote is ${vLevel.toUpperCase()} AND Lies is ${lLevel.toUpperCase()} AND Beh is ${bLevel.toUpperCase()}`,
            sLevel,
            vLevel,
            lLevel,
            bLevel,
            output,
          })
        }
      }
    }
  }
  return rules
}

// Generated once - 81 static rules
export const RULE_MATRIX = buildRuleMatrix()

export default function useFuzzyLogic({ suspicion, voteErraticness, previousLies, aggression }) {
  return useMemo(() => {
    const S = fuzzify(suspicion)
    const V = fuzzify(voteErraticness)
    const L = fuzzify(previousLies)
    const B = fuzzify(aggression)

    const membershipMap = {
      S: { low: S.low, med: S.med, high: S.high },
      V: { low: V.low, med: V.med, high: V.high },
      L: { low: L.low, med: L.med, high: L.high },
      B: { low: B.low, med: B.med, high: B.high },
    }

    // Evaluate all 81 rules: weight = MIN of the 4 membership values (Mamdani AND)
    const evaluatedRules = RULE_MATRIX.map((rule) => {
      const weight = Math.min(
        membershipMap.S[rule.sLevel],
        membershipMap.V[rule.vLevel],
        membershipMap.L[rule.lLevel],
        membershipMap.B[rule.bLevel]
      )
      return { ...rule, weight }
    })

    // Aggregate (union = MAX) per output category
    const executeClipped = Math.max(
      0,
      ...evaluatedRules.filter((r) => r.output === 'execute').map((r) => r.weight)
    )
    const observeClipped = Math.max(
      0,
      ...evaluatedRules.filter((r) => r.output === 'observe').map((r) => r.weight)
    )
    const allianceClipped = Math.max(
      0,
      ...evaluatedRules.filter((r) => r.output === 'alliance').map((r) => r.weight)
    )

    // Centroid of gravity (COG) defuzzification using representative output centers
    const EXECUTE_CENTER = 85
    const OBSERVE_CENTER = 55
    const ALLIANCE_CENTER = 20

    const numerator =
      executeClipped * EXECUTE_CENTER + observeClipped * OBSERVE_CENTER + allianceClipped * ALLIANCE_CENTER
    const denominator = executeClipped + observeClipped + allianceClipped
    const trustZ = denominator > 0 ? numerator / denominator : 0

    // Invert so higher number = more trustworthy (adjust if you want raw risk score instead)
    const finalTrust = Math.max(0, Math.min(100, Math.round(100 - trustZ)))

    let directive = 'OBSERVE'
    if (executeClipped >= observeClipped && executeClipped >= allianceClipped) directive = 'EXECUTE'
    else if (allianceClipped > observeClipped && allianceClipped > executeClipped) directive = 'ALLIANCE'

    // Only return rules that actually fired (weight > 0) - useful for the trace log UI
    const firedRules = evaluatedRules.filter((r) => r.weight > 0).sort((a, b) => b.weight - a.weight)

    return {
      memberships: { S, V, L, B },
      allRules: evaluatedRules, // all 81, for debugging or a "show all" toggle
      firedRules, // only the active ones, great for your trace log panel
      clipped: { executeClipped, observeClipped, allianceClipped },
      trustZ,
      finalTrust,
      directive,
    }
  }, [suspicion, voteErraticness, previousLies, aggression])
}