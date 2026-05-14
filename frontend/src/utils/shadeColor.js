function clamp(value) {
  return Math.min(255, Math.max(0, value))
}

function normalizeHex(hex) {
  const cleaned = String(hex).trim().replace(/^#/, '')
  if (cleaned.length === 3) {
    return cleaned
      .split('')
      .map((char) => char + char)
      .join('')
  }
  return cleaned
}

export default function shadeColor(hex, amount) {
  const normalized = normalizeHex(hex)
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    throw new Error('Invalid hex color')
  }

  const r = clamp(parseInt(normalized.slice(0, 2), 16) + amount)
  const g = clamp(parseInt(normalized.slice(2, 4), 16) + amount)
  const b = clamp(parseInt(normalized.slice(4, 6), 16) + amount)

  const formatted = [r, g, b]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')

  return `#${formatted}`.toLowerCase()
}

export function autoShade(hex) {
  return shadeColor(hex, -35)
}
