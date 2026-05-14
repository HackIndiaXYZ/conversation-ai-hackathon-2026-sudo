import shadeColor from './shadeColor'

const hairStyles = {
  long: (color) => {
    const shadow = shadeColor(color, -30)
    return [
      <ellipse key="long-top" cx="90" cy="42" rx="56" ry="28" fill={color} />,
      <rect key="long-left" x="34" y="40" width="20" height="55" rx="10" fill={color} />,
      <rect key="long-right" x="126" y="40" width="20" height="55" rx="10" fill={color} />,
      <ellipse key="long-shadow-left" cx="44" cy="96" rx="12" ry="6" fill={shadow} />,
      <ellipse key="long-shadow-right" cx="136" cy="96" rx="12" ry="6" fill={shadow} />,
    ]
  },
  short: (color) => {
    const shadow = shadeColor(color, -30)
    return [
      <ellipse key="short-top" cx="90" cy="42" rx="56" ry="22" fill={color} />,
      <rect key="short-left" x="34" y="46" width="20" height="30" rx="10" fill={color} />,
      <rect key="short-right" x="126" y="46" width="20" height="30" rx="10" fill={color} />,
      <ellipse key="short-shadow-left" cx="44" cy="78" rx="10" ry="5" fill={shadow} />,
      <ellipse key="short-shadow-right" cx="136" cy="78" rx="10" ry="5" fill={shadow} />,
    ]
  },
  curly: (color) => {
    const shadow = shadeColor(color, -30)
    return [
      <ellipse key="curly-top" cx="90" cy="42" rx="56" ry="28" fill={color} />,
      <circle key="curly-1" cx="60" cy="40" r="16" fill={color} />,
      <circle key="curly-2" cx="120" cy="40" r="16" fill={color} />,
      <circle key="curly-3" cx="74" cy="26" r="14" fill={color} />,
      <circle key="curly-4" cx="106" cy="26" r="14" fill={color} />,
      <circle key="curly-5" cx="90" cy="54" r="18" fill={color} />,
      <circle key="curly-shadow-1" cx="60" cy="56" r="8" fill={shadow} />,
      <circle key="curly-shadow-2" cx="120" cy="56" r="8" fill={shadow} />,
    ]
  },
  bun: (color) => {
    const shadow = shadeColor(color, -30)
    return [
      <ellipse key="bun-top" cx="90" cy="42" rx="56" ry="28" fill={color} />,
      <rect key="bun-left" x="34" y="46" width="20" height="30" rx="10" fill={color} />,
      <rect key="bun-right" x="126" y="46" width="20" height="30" rx="10" fill={color} />,
      <circle key="bun-top-circle" cx="90" cy="14" r="18" fill={color} />,
      <circle key="bun-inner" cx="90" cy="14" r="12" fill={shadow} />,
    ]
  },
  spiky: (color) => {
    const shadow = shadeColor(color, -30)
    return [
      <ellipse key="spiky-top" cx="90" cy="42" rx="56" ry="24" fill={color} />,
      <polygon key="spiky-1" points="60,42 68,12 76,42" fill={color} />,
      <polygon key="spiky-2" points="75,42 84,8 93,42" fill={color} />,
      <polygon key="spiky-3" points="90,42 98,10 106,42" fill={color} />,
      <polygon key="spiky-4" points="105,42 114,12 123,42" fill={color} />,
      <rect key="spiky-left" x="34" y="50" width="20" height="24" rx="8" fill={color} />,
      <rect key="spiky-right" x="126" y="50" width="20" height="24" rx="8" fill={color} />,
      <ellipse key="spiky-shadow-left" cx="44" cy="78" rx="10" ry="5" fill={shadow} />,
      <ellipse key="spiky-shadow-right" cx="136" cy="78" rx="10" ry="5" fill={shadow} />,
    ]
  },
  bob: (color) => {
    const shadow = shadeColor(color, -30)
    return [
      <ellipse key="bob-top" cx="90" cy="42" rx="56" ry="24" fill={color} />,
      <rect key="bob-left" x="34" y="46" width="20" height="44" rx="10" fill={color} />,
      <rect key="bob-right" x="126" y="46" width="20" height="44" rx="10" fill={color} />,
      <rect key="bob-bottom" x="34" y="84" width="116" height="8" rx="4" fill={color} />,
      <ellipse key="bob-shadow-left" cx="44" cy="96" rx="10" ry="5" fill={shadow} />,
      <ellipse key="bob-shadow-right" cx="136" cy="96" rx="10" ry="5" fill={shadow} />,
    ]
  },
  buzz: (color) => {
    return [
      <ellipse key="buzz-top" cx="90" cy="42" rx="56" ry="14" fill={color} />,
    ]
  },
}

export default function getHairSVG(style, color) {
  const hairFn = hairStyles[style] || hairStyles.long
  return hairFn(color)
}
