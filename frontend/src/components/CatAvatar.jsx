import React, { useMemo } from 'react'

const CAT_EXPRESSIONS = {
  neutral: {
    eyeScaleY: 1,
    eyeScaleX: 1,
    browAngle: 0,
    mouthY: 0,
    earAngle: 0,
    cheekOpacity: 0,
    pupilScale: 1,
    browY: 0,
    tailWag: 0,
    bodyBounce: 0,
  },
  happy: {
    eyeScaleY: 0.65,
    eyeScaleX: 1.1,
    browAngle: -5,
    mouthY: -2,
    earAngle: -3,
    cheekOpacity: 0.4,
    pupilScale: 0.8,
    browY: 2,
    tailWag: 1,
    bodyBounce: 0,
  },
  sad: {
    eyeScaleY: 0.85,
    eyeScaleX: 1,
    browAngle: 10,
    mouthY: 3,
    earAngle: 6,
    cheekOpacity: 0,
    pupilScale: 1.1,
    browY: -2,
    tailWag: 0,
    bodyBounce: 0,
  },
  surprised: {
    eyeScaleY: 1.25,
    eyeScaleX: 1.15,
    browAngle: -15,
    mouthY: -4,
    earAngle: -2,
    cheekOpacity: 0,
    pupilScale: 1.4,
    browY: -5,
    tailWag: 0,
    bodyBounce: 0.5,
  },
  thinking: {
    eyeScaleY: 0.8,
    eyeScaleX: 1.05,
    browAngle: 6,
    mouthY: 1,
    earAngle: 2,
    cheekOpacity: 0,
    pupilScale: 0.9,
    browY: 1,
    tailWag: 0,
    bodyBounce: 0,
  },
  angry: {
    eyeScaleY: 0.7,
    eyeScaleX: 1,
    browAngle: 18,
    mouthY: 4,
    earAngle: -10,
    cheekOpacity: 0,
    pupilScale: 0.6,
    browY: -3,
    tailWag: 0,
    bodyBounce: 0,
  },
  excited: {
    eyeScaleY: 0.55,
    eyeScaleX: 1.2,
    browAngle: -8,
    mouthY: -3,
    earAngle: -5,
    cheekOpacity: 0.6,
    pupilScale: 0.75,
    browY: 3,
    tailWag: 1,
    bodyBounce: 1,
  },
  love: {
    eyeScaleY: 0.6,
    eyeScaleX: 1.05,
    browAngle: -4,
    mouthY: -2,
    earAngle: -2,
    cheekOpacity: 0.7,
    pupilScale: 1.3,
    browY: 2,
    tailWag: 1,
    bodyBounce: 0,
  },
  shy: {
    eyeScaleY: 0.75,
    eyeScaleX: 0.95,
    browAngle: 4,
    mouthY: 1,
    earAngle: 8,
    cheekOpacity: 0.5,
    pupilScale: 0.85,
    browY: 1,
    tailWag: 0,
    bodyBounce: 0,
  },
}

function CatAvatar({ speaking, expr = 'neutral', blinking, furColor = '#FFA726', eyeColor = '#DCE775' }) {
  const expression = CAT_EXPRESSIONS[expr] || CAT_EXPRESSIONS.neutral

  const openAmount = typeof speaking === 'number' ? speaking : speaking ? 0.5 : 0
  const isSpeaking = openAmount > 0.05
  const mouthOpenAmount = Math.max(0, (openAmount - 0.05) * 22)
  const bounceClass = expression.bodyBounce > 0.5 ? 'cat-bounce' : ''
  const tailWagClass = expression.tailWag > 0 ? 'cat-tail-wag' : ''

  const svgContent = useMemo(() => {
    const jawDrop = isSpeaking ? mouthOpenAmount : 0

    return (
      <svg
        viewBox="0 0 200 240"
        width="100%"
        height="100%"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="catMainFur" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor={furColor} />
            <stop offset="100%" stopColor={furColor} filter="brightness(0.8)" />
          </radialGradient>
          <radialGradient id="muzzleGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFF9EB" />
            <stop offset="100%" stopColor={furColor} stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id="irisGrad" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor={eyeColor} />
            <stop offset="100%" stopColor={eyeColor} stopOpacity="0.6" />
          </radialGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shoulders */}
        <path
          d="M35,240 C35,185 60,165 100,165 C140,165 165,185 165,240"
          fill="url(#catMainFur)"
          filter="url(#softShadow)"
        />

        {/* Ears */}
        <g transform={`rotate(${expression.earAngle}, 60, 70)`}>
          <path d="M30,90 L12,15 C45,5 85,40 85,50" fill="url(#catMainFur)" stroke="#BF360C" strokeWidth="0.5" />
          <path d="M38,80 L28,30 C45,25 70,48 70,48" fill="#FFCCBC" opacity="0.6" />
        </g>
        <g transform={`rotate(${-expression.earAngle}, 140, 70)`}>
          <path d="M170,90 L188,15 C155,5 115,40 115,50" fill="url(#catMainFur)" stroke="#BF360C" strokeWidth="0.5" />
          <path d="M162,80 L172,30 C155,25 130,48 130,48" fill="#FFCCBC" opacity="0.6" />
        </g>

        {/* Head Base */}
        <path
          d="M25,100 C25,55 60,38 100,38 C140,38 175,55 175,100 C175,145 140,165 100,165 C60,165 25,145 25,100"
          fill="url(#catMainFur)"
          filter="url(#softShadow)"
        />

        {/* Tabby markings */}
        <g fill="#E65100" opacity="0.2">
            <path d="M100,45 L92,60 L100,55 L108,60 Z" />
            <path d="M35,105 L55,108 L35,112 Z" />
            <path d="M165,105 L145,108 L165,112 Z" />
        </g>

        {/* Eyes */}
        <g transform={`translate(0, ${expression.browY})`}>
          {blinking ? (
            <>
              <path d="M40,92 Q62,98 84,92" fill="none" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
              <path d="M116,92 Q138,98 160,92" fill="none" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              <g transform={`translate(62, 92) scale(${expression.eyeScaleX}, ${expression.eyeScaleY})`}>
                <ellipse cx="0" cy="0" rx="22" ry="20" fill="white" stroke="#3E2723" strokeWidth="1" />
                <circle cx="0" cy="0" r="17" fill="url(#irisGrad)" />
                <ellipse cx="0" cy="0" rx={4.5 * expression.pupilScale} ry={14 * expression.pupilScale} fill="#0A0A0A" />
                <circle cx="8" cy="-8" r="6" fill="white" opacity="0.2" />
                <circle cx="9" cy="-9" r="2.5" fill="white" opacity="0.8" />
              </g>
              <g transform={`translate(138, 92) scale(${expression.eyeScaleX}, ${expression.eyeScaleY})`}>
                <ellipse cx="0" cy="0" rx="22" ry="20" fill="white" stroke="#3E2723" strokeWidth="1" />
                <circle cx="0" cy="0" r="17" fill="url(#irisGrad)" />
                <ellipse cx="0" cy="0" rx={4.5 * expression.pupilScale} ry={14 * expression.pupilScale} fill="#0A0A0A" />
                <circle cx="8" cy="-8" r="6" fill="white" opacity="0.2" />
                <circle cx="9" cy="-9" r="2.5" fill="white" opacity="0.8" />
              </g>
            </>
          )}
        </g>

        {/* Eyebrows */}
        <g transform={`translate(0, ${expression.browY})`}>
          <path d="M38,70 Q62,55 86,70" fill="none" stroke="#BF360C" strokeWidth="6" strokeLinecap="round" opacity="0.5" transform={`rotate(${expression.browAngle}, 62, 70)`} />
          <path d="M114,70 Q138,55 162,70" fill="none" stroke="#BF360C" strokeWidth="6" strokeLinecap="round" opacity="0.5" transform={`rotate(${-expression.browAngle}, 138, 70)`} />
        </g>

        {/* Muzzle area */}
        <path
          d="M68,125 C68,110 82,105 100,105 C118,105 132,110 132,125 C132,148 118,155 100,155 C82,155 68,148 68,125"
          fill="url(#muzzleGrad)"
        />

        {/* Nose */}
        <path
          d={`M94,${118 + expression.mouthY} Q100,${115 + expression.mouthY} 106,${118 + expression.mouthY} L100,${126 + expression.mouthY} Z`}
          fill="#FF8A65"
        />

        {/* Whiskers */}
        <g stroke="white" strokeWidth="0.6" opacity="0.4" fill="none">
          <path d="M75,128 C50,130 25,122 10,115" />
          <path d="M75,134 C50,138 25,138 10,135" />
          <path d="M75,140 C55,150 35,155 15,155" />
          <path d="M125,128 C150,130 175,122 190,115" />
          <path d="M125,134 C150,138 175,138 190,135" />
          <path d="M125,140 C145,150 165,155 185,155" />
        </g>

        {/* Lip-sync Mouth — multi-shape based on openAmount */}
        <g transform={`translate(0, ${expression.mouthY})`}>
          {(() => {
            const t = Math.min(1, openAmount)          // 0 = closed, 1 = wide open
            const cx = 100
            const mouthY = 138

            // Mouth width grows slightly with openness
            const halfW   = 14 + t * 8                // 14 → 22
            // Upper lip stays mostly fixed, lower jaw drops
            const upperY  = mouthY - 2
            const lowerY  = mouthY + 4 + t * 16       // drops 0 → 20px
            // Interior depth
            const innerY  = mouthY + 2 + t * 10

            if (!isSpeaking) {
              // Rest: classic cat "W" mouth
              return (
                <path
                  d={`M${cx - 16},${mouthY} C${cx - 10},${mouthY + 7} ${cx - 4},${mouthY + 7} ${cx},${mouthY} C${cx + 4},${mouthY + 7} ${cx + 10},${mouthY + 7} ${cx + 16},${mouthY}`}
                  fill="none"
                  stroke="#3E2723"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )
            }

            return (
              <g>
                {/* Mouth interior (dark cavity) */}
                <path
                  d={`M${cx - halfW},${upperY} Q${cx},${innerY} ${cx + halfW},${upperY} Q${cx + halfW + 4},${(upperY + lowerY) / 2} ${cx + halfW},${lowerY} Q${cx},${lowerY + 4} ${cx - halfW},${lowerY} Q${cx - halfW - 4},${(upperY + lowerY) / 2} ${cx - halfW},${upperY} Z`}
                  fill="#1a0a08"
                />
                {/* Tongue (visible when open > 40%) */}
                {t > 0.4 && (
                  <ellipse
                    cx={cx}
                    cy={lowerY - 2}
                    rx={halfW * 0.55}
                    ry={(lowerY - upperY) * 0.35}
                    fill="#E57373"
                  />
                )}
                {/* Upper lip */}
                <path
                  d={`M${cx - halfW},${upperY} Q${cx - halfW * 0.4},${upperY - 5} ${cx},${upperY - 3} Q${cx + halfW * 0.4},${upperY - 5} ${cx + halfW},${upperY}`}
                  fill="#BF5940"
                  stroke="#8B3A28"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                {/* Lower lip */}
                <path
                  d={`M${cx - halfW},${lowerY} Q${cx},${lowerY + 5} ${cx + halfW},${lowerY}`}
                  fill="#BF5940"
                  stroke="#8B3A28"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
            )
          })()}
        </g>
      </svg>
    )
  }, [expression, isSpeaking, mouthOpenAmount, blinking, furColor, eyeColor])

  return (
    <div
      className={`${isSpeaking ? 'cat-speaking' : ''} ${bounceClass}`}
      style={{
        width: '200px',
        height: '240px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <style>{`
        @keyframes cat-talk {
          0%   { transform: scale(1);    }
          50%  { transform: scale(1.01); }
          100% { transform: scale(1);    }
        }
        @keyframes cat-bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes cat-tail-wag {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(8deg); }
          75%      { transform: rotate(-8deg); }
        }
        .cat-speaking {
          animation: cat-talk 0.3s infinite ease-in-out !important;
        }
        .cat-bounce {
          animation: cat-bounce 0.4s infinite ease-in-out !important;
        }
        .cat-tail-wag {
          animation: cat-tail-wag 0.3s infinite ease-in-out !important;
        }
      `}</style>
      {svgContent}
    </div>
  )
}

export default React.memo(CatAvatar)
