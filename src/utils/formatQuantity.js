export function formatQuantity(value) {
  const rounded = Math.round(value * 100) / 100
  const common = [
    [0.25, '¼'],
    [0.33, '⅓'],
    [0.5, '½'],
    [0.67, '⅔'],
    [0.75, '¾'],
  ]

  const whole = Math.floor(rounded)
  const fraction = rounded - whole
  const match = common.find(([decimal]) => Math.abs(fraction - decimal) < 0.03)

  if (match) return `${whole || ''}${match[1]}`
  return Number.isInteger(rounded) ? String(rounded) : String(rounded)
}
