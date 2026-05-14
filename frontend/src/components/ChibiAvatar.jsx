import React from 'react'

const CHIBI_EXPRESSIONS = {
  neutral: {
    mouthPath: 'M52,88 Q60,91 68,88',
    cheekOpacity: 0,
    browAngle: 0,
    eyeScaleY: 1,
    bodyBounce: 0,
    bowSquish: 0,
  },
  happy: {
    mouthPath: 'M48,85 Q60,98 72,85',
    cheekOpacity: 0.6,
    browAngle: -5,
    eyeScaleY: 0.9,
    bodyBounce: 0,
    bowSquish: 0,
  },
  sad: {
    mouthPath: 'M50,91 Q60,85 70,91',
    cheekOpacity: 0,
    browAngle: 10,
    eyeScaleY: 0.95,
    bodyBounce: 0,
    bowSquish: 0,
  },
  surprised: {
    mouthPath: 'M54,85 Q60,95 66,85 Q60,75 54,85',
    cheekOpacity: 0.3,
    browAngle: -15,
    eyeScaleY: 1.25,
    bodyBounce: 0.5,
    bowSquish: 0,
  },
  thinking: {
    mouthPath: 'M52,89 Q60,87 68,89',
    cheekOpacity: 0,
    browAngle: 5,
    eyeScaleY: 0.85,
    bodyBounce: 0,
    bowSquish: 0,
  },
  angry: {
    mouthPath: 'M50,92 Q60,88 70,92',
    cheekOpacity: 0,
    browAngle: 15,
    eyeScaleY: 0.8,
    bodyBounce: 0,
    bowSquish: 0,
  },
  excited: {
    mouthPath: 'M46,84 Q60,100 74,84',
    cheekOpacity: 0.7,
    browAngle: -8,
    eyeScaleY: 0.85,
    bodyBounce: 1,
    bowSquish: 1,
  },
  love: {
    mouthPath: 'M48,86 Q60,96 72,86',
    cheekOpacity: 0.8,
    browAngle: -3,
    eyeScaleY: 0.7,
    bodyBounce: 0,
    bowSquish: 0,
  },
  shy: {
    mouthPath: 'M53,89 Q60,91 67,89',
    cheekOpacity: 0.5,
    browAngle: 3,
    eyeScaleY: 0.88,
    bodyBounce: 0,
    bowSquish: 0,
  },
}

function ChibiAvatar({ speaking, expr = 'neutral', blinking, skinColor = '#FFDFC4', hairColor = '#FF69B4', eyeColor = '#4FC3F7' }) {
  const expression = CHIBI_EXPRESSIONS[expr] || CHIBI_EXPRESSIONS.neutral

  const openAmount = typeof speaking === 'number' ? speaking : speaking ? 0.5 : 0
  const isSpeaking = openAmount > 0.05
  const mouthOpenAmount = Math.max(0, (openAmount - 0.05) * 22)
  const bounceClass = expression.bodyBounce > 0.5 ? 'chibi-bounce' : ''

  return (
    <div
      className={`${isSpeaking ? 'chibi-speaking' : ''} ${bounceClass}`}
      style={{
        width: '180px',
        height: '210px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'visible',
        background: 'transparent',
      }}
    >
      <style>{`
        @keyframes chibi-talk {
          0%   { transform: scale(1);    }
          50%  { transform: scale(1.01); }
          100% { transform: scale(1);    }
        }
        @keyframes chibi-bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
        .chibi-speaking {
          animation: chibi-talk 0.3s infinite ease-in-out !important;
        }
        .chibi-bounce {
          animation: chibi-bounce 0.35s infinite ease-in-out !important;
        }
      `}</style>
      <svg
        viewBox="0 0 120 140"
        width="100%"
        height="100%"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="chibiSkin" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={skinColor} />
            <stop offset="100%" stopColor={skinColor} filter="brightness(0.9)" />
          </radialGradient>
          <linearGradient id="chibiHair" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={hairColor} />
            <stop offset="100%" stopColor={hairColor} filter="brightness(0.8)" />
          </linearGradient>
          <radialGradient id="chibiEye" cx="40%" cy="40%" r="50%">
            <stop offset="0%" stopColor={eyeColor} />
            <stop offset="100%" stopColor={eyeColor} filter="brightness(0.7)" />
          </radialGradient>
          <radialGradient id="chibiCheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFAB91" />
            <stop offset="100%" stopColor="#FF8A65" />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="60" cy="130" rx="35" ry="6" fill="#000" opacity="0.15" />

        {/* Body - Moved up to connect with head */}
        <ellipse cx="60" cy="118" rx="22" ry="12" fill="#E91E63" />

        {/* Neck - Extended to bridge the gap */}
        <rect x="54" y="90" width="12" height="20" fill={skinColor} filter="brightness(0.9)" />

        {/* Back hair */}
        <ellipse cx="32" cy="62" rx="25" ry="42" fill="#FF1493" />
        <ellipse cx="88" cy="62" rx="25" ry="42" fill="#FF1493" />
        <ellipse cx="60" cy="32" rx="52" ry="32" fill="#FF1493" />

        {/* Head Base */}
        <circle cx="60" cy="58" r="48" fill="url(#chibiSkin)" />

        {/* Front hair (Bangs) */}
        <path
          d="M12,50 Q12,10 60,10 Q108,10 108,50 L108,55 Q90,40 75,48 Q65,32 55,48 Q45,32 35,48 Q20,40 12,55 Z"
          fill="url(#chibiHair)"
        />

        {/* Cheek blushes */}
        <circle cx="25" cy="70" r="14" fill="url(#chibiCheek)" opacity={expression.cheekOpacity} />
        <circle cx="95" cy="70" r="14" fill="url(#chibiCheek)" opacity={expression.cheekOpacity} />

        {/* Eyes container */}
        <g transform={`translate(0, ${expression.browAngle < 0 ? -2 : 0})`}>
          {blinking ? (
            <>
              <path d="M22,65 Q35,68 48,65" fill="none" stroke="#4A148C" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M72,65 Q85,68 98,65" fill="none" stroke="#4A148C" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <g transform={`translate(35, 65) scale(1, ${expression.eyeScaleY})`}>
                <circle cx="0" cy="0" r="14" fill="white" stroke="#333" strokeWidth="0.5" />
                <circle cx="0" cy="0" r="10" fill="url(#chibiEye)" />
                <circle cx="0" cy="0" r="5" fill="#1A1A1A" />
                <circle cx="4" cy="-4" r="2.5" fill="white" opacity="0.95" />
                <circle cx="-2" cy="-2" r="1.5" fill="white" opacity="0.8" />
              </g>
              <g transform={`translate(85, 65) scale(1, ${expression.eyeScaleY})`}>
                <circle cx="0" cy="0" r="14" fill="white" stroke="#333" strokeWidth="0.5" />
                <circle cx="0" cy="0" r="10" fill="url(#chibiEye)" />
                <circle cx="0" cy="0" r="5" fill="#1A1A1A" />
                <circle cx="4" cy="-4" r="2.5" fill="white" opacity="0.95" />
                <circle cx="-2" cy="-2" r="1.5" fill="white" opacity="0.8" />
              </g>
            </>
          )}
        </g>

        {/* Eyebrows */}
        <g transform={`rotate(${expression.browAngle}, 35, 43)`}>
          <path d="M22,45 Q35,37 48,45" fill="none" stroke="#4A148C" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <g transform={`rotate(${-expression.browAngle}, 85, 43)`}>
          <path d="M72,45 Q85,37 98,45" fill="none" stroke="#4A148C" strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* Nose */}
        <ellipse cx="60" cy="78" rx="2.5" ry="1.5" fill="#E91E63" opacity="0.6" />

        {/* Lip-sync Mouth — multi-shape based on openAmount */}
        {(() => {
          const t = Math.min(1, openAmount)      // 0 = closed, 1 = wide
          const cx = 60
          const baseY = 88

          // Mouth width grows with speech
          const halfW  = 8 + t * 9              // 8 → 17
          // Lower jaw drops
          const upperY = baseY - 1
          const lowerY = baseY + 3 + t * 10     // drops 0 → 13px
          const innerY = baseY + 1 + t * 5

          if (!isSpeaking) {
            // Rest: use expression-specific path
            return (
              <path
                d={expression.mouthPath}
                fill="none"
                stroke="#4A148C"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )
          }

          return (
            <g>
              {/* Dark mouth interior */}
              <path
                d={`M${cx - halfW},${upperY} Q${cx},${innerY} ${cx + halfW},${upperY} Q${cx + halfW + 3},${(upperY + lowerY) / 2} ${cx + halfW},${lowerY} Q${cx},${lowerY + 3} ${cx - halfW},${lowerY} Q${cx - halfW - 3},${(upperY + lowerY) / 2} ${cx - halfW},${upperY} Z`}
                fill="#2a0a18"
              />
              {/* Tongue (shows when open > 40%) */}
              {t > 0.4 && (
                <ellipse
                  cx={cx}
                  cy={lowerY - 1}
                  rx={halfW * 0.55}
                  ry={(lowerY - upperY) * 0.38}
                  fill="#F48FB1"
                />
              )}
              {/* Upper lip */}
              <path
                d={`M${cx - halfW},${upperY} Q${cx - halfW * 0.35},${upperY - 4} ${cx},${upperY - 2} Q${cx + halfW * 0.35},${upperY - 4} ${cx + halfW},${upperY}`}
                fill="#E91E63"
                stroke="#880E4F"
                strokeWidth="0.8"
                strokeLinecap="round"
              />
              {/* Lower lip */}
              <path
                d={`M${cx - halfW},${lowerY} Q${cx},${lowerY + 4} ${cx + halfW},${lowerY}`}
                fill="#E91E63"
                stroke="#880E4F"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </g>
          )
        })()}

        {/* Bow */}
        <g transform="translate(95, 30)">
          <ellipse cx="0" cy="0" rx="8" ry="5" fill="#E91E63" />
          <circle cx="-5" cy="0" r="5" fill="#F06292" />
          <circle cx="5" cy="0" r="5" fill="#F06292" />
          <circle cx="0" cy="0" r="2" fill="#880E4F" />
        </g>
      </svg>
    </div>
  )
}

export default React.memo(ChibiAvatar)
