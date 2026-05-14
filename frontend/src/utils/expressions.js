export const EXPRESSIONS = {
  neutral: {
    mouth: 'M72 126 Q90 134 108 126',
    browL: 'M55 70 Q67 64 75 68',
    browR: 'M105 68 Q113 64 125 70',
    cheekOpacity: 0,
    tearOpacity: 0,
  },
  happy: {
    mouth: 'M68 120 Q90 142 112 120',
    browL: 'M55 68 Q67 62 75 66',
    browR: 'M105 66 Q113 62 125 68',
    cheekOpacity: 0.45,
    tearOpacity: 0,
  },
  sad: {
    mouth: 'M72 132 Q90 124 108 132',
    browL: 'M55 68 Q67 72 75 70',
    browR: 'M105 70 Q113 72 125 68',
    cheekOpacity: 0,
    tearOpacity: 0.75,
  },
  surprised: {
    mouth: 'M78 122 Q90 140 102 122',
    browL: 'M52 64 Q64 56 74 60',
    browR: 'M106 60 Q116 56 128 64',
    cheekOpacity: 0,
    tearOpacity: 0,
  },
  thinking: {
    mouth: 'M72 128 Q90 130 108 126',
    browL: 'M55 68 Q67 64 75 70',
    browR: 'M105 66 Q113 68 125 68',
    cheekOpacity: 0,
    tearOpacity: 0,
  },
}

export function getExpression(name) {
  return EXPRESSIONS[name] ?? EXPRESSIONS.neutral
}
