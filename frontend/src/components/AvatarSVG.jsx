import React from 'react'
import getHairSVG from '../utils/hairPaths'
import { getExpression } from '../utils/expressions'
import shadeColor from '../utils/shadeColor'

function getAccSVG(acc) {
  switch (acc) {
    case 'glasses':
      return [
        <ellipse key="tint-left"  cx="62"  cy="98" rx="14" ry="11" fill="rgba(100,160,255,0.08)" />,
        <ellipse key="tint-right" cx="118" cy="98" rx="14" ry="11" fill="rgba(100,160,255,0.08)" />,
        <ellipse key="frame-left"  cx="62"  cy="98" rx="14" ry="11" fill="none" stroke="#2a2a2a" strokeWidth="3" />,
        <ellipse key="frame-right" cx="118" cy="98" rx="14" ry="11" fill="none" stroke="#2a2a2a" strokeWidth="3" />,
        <path key="bridge" d="M76 98 Q90 93 104 98" fill="none" stroke="#2a2a2a" strokeWidth="2.5" strokeLinecap="round" />,
        <line key="arm-left"  x1="48"  y1="94" x2="32" y2="90" stroke="#2a2a2a" strokeWidth="2.5" strokeLinecap="round" />,
        <line key="arm-right" x1="132" y1="94" x2="148" y2="90" stroke="#2a2a2a" strokeWidth="2.5" strokeLinecap="round" />,
      ]
    case 'cap':
      return [
        <ellipse key="cap-top" cx="90" cy="24" rx="64" ry="24" fill="#2255AA" />,
        <rect key="cap-brim" x="40" y="34" width="100" height="14" rx="8" fill="#2255AA" />,
      ]
    case 'earrings':
      return [
        <circle key="earring-left" cx="32" cy="108" r="6" fill="#D9B200" />,
        <circle key="earring-right" cx="148" cy="108" r="6" fill="#D9B200" />,
      ]
    default:
      return null
  }
}

function AvatarSVG({ skin, skinShade, hair, hairStyle, eye, lip, acc, expr, speaking, blinking }) {
  const expression = getExpression(expr)
  const hairNodes = getHairSVG(hairStyle, hair)
  const shadowColor = shadeColor(skin, -25)
  const lipColor = lip || '#C0704A'

  // Parse openAmount from speaking prop
  const openAmount = typeof speaking === 'number' ? speaking : speaking ? 0.5 : 0
  const isSpeaking = openAmount > 0.1

  // Calculate mouth dimensions
  const mouthWidth = 28
  const mouthHeight = Math.max(0, (openAmount - 0.1) * 22)
  const mouthOpen = mouthHeight > 1

  return (
    <svg viewBox="0 0 180 200" width="180" height="180" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="90" cy="168" rx="50" ry="12" fill={shadowColor} opacity="0.25" />

      {/* Neck */}
      <rect x="74" y="106" width="32" height="40" rx="12" fill={skinShade} />

      {/* Hair */}
      {hairNodes}

      {/* Face */}
      <ellipse cx="90" cy="95" rx="54" ry="66" fill={skin} />
      <ellipse cx="36" cy="96" rx="14" ry="20" fill={skinShade} />
      <ellipse cx="144" cy="96" rx="14" ry="20" fill={skinShade} />

      {/* Eyebrows */}
      <path d={expression.browL} fill="none" stroke="#2C1A0E" strokeWidth="4" strokeLinecap="round" />
      <path d={expression.browR} fill="none" stroke="#2C1A0E" strokeWidth="4" strokeLinecap="round" />

      {/* Eyes */}
      <ellipse cx="62" cy="98" rx="12" ry="9" fill="#fff" />
      <ellipse cx="118" cy="98" rx="12" ry="9" fill="#fff" />
      <ellipse cx="62" cy="98" rx="8" ry="8" fill={eye} />
      <ellipse cx="118" cy="98" rx="8" ry="8" fill={eye} />
      <ellipse cx="62" cy="98" rx="4" ry="4" fill="#1a1a1a" />
      <ellipse cx="118" cy="98" rx="4" ry="4" fill="#1a1a1a" />
      <circle cx="59" cy="95" r="2.5" fill="#fff" opacity="0.9" />
      <circle cx="115" cy="95" r="2.5" fill="#fff" opacity="0.9" />

      {/* Blink */}
      {blinking && (
        <>
          <rect x="50" y="92" width="24" height="6" rx="3" fill={skin} />
          <rect x="106" y="92" width="24" height="6" rx="3" fill={skin} />
        </>
      )}

      {/* Cheeks */}
      <ellipse cx="54" cy="118" rx="8" ry="5" fill="#F28C8C" opacity={expression.cheekOpacity} />
      <ellipse cx="126" cy="118" rx="8" ry="5" fill="#F28C8C" opacity={expression.cheekOpacity} />

      {/* Nose */}
      <ellipse cx="90" cy="110" rx="6" ry="10" fill={skinShade} opacity="0.6" />

      {/* MOUTH AREA */}
      {mouthOpen ? (
        <>
          {/* Inner mouth (dark background) */}
          <ellipse
            cx="90"
            cy={130 + (mouthHeight * 0.4)}
            rx={mouthWidth / 2 - 2}
            ry={mouthHeight * 0.8}
            fill="#1a0a0a"
          />

          {/* Teeth (upper, fixed position) */}
          {mouthHeight > 4 && (
            <rect
              x={90 - mouthWidth / 2 + 2}
              y={129}
              width={mouthWidth - 4}
              height={Math.min(6, mouthHeight * 0.4)}
              rx={1}
              fill="#f5f5f5"
            />
          )}

          {/* Tongue (lower, when mouth more open) */}
          {mouthHeight > 8 && (
            <ellipse
              cx="90"
              cy={132 + (mouthHeight * 0.5)}
              rx={8}
              ry={4}
              fill="#c45555"
              opacity={0.9}
            />
          )}

          {/* Upper lip line */}
          <path
            d={`M ${90 - mouthWidth / 2} 130 Q 90 ${126 - mouthHeight * 0.1} ${90 + mouthWidth / 2} 130`}
            fill="none"
            stroke={lipColor}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Lower lip line */}
          <path
            d={`M ${90 - mouthWidth / 2} ${130 + mouthHeight} Q 90 ${136 + mouthHeight * 1.2} ${90 + mouthWidth / 2} ${130 + mouthHeight}`}
            fill="none"
            stroke={lipColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      ) : (
        /* Closed mouth - simple curved line */
        <path
          d={expression.mouth}
          fill="none"
          stroke={lipColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}

      {/* Tears */}
      <ellipse cx="62" cy="108" rx="4" ry="6" fill="#69B8FF" opacity={expression.tearOpacity} />
      <ellipse cx="118" cy="108" rx="4" ry="6" fill="#69B8FF" opacity={expression.tearOpacity} />

      {/* Accessories */}
      {getAccSVG(acc)}
    </svg>
  )
}

export default React.memo(AvatarSVG)
