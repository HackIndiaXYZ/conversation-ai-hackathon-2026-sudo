import React from 'react'

const SPONGE_EXPRESSIONS = {
  neutral: {
    eyeScaleY: 1,
    eyeScaleX: 1,
    browAngle: 0,
    mouthY: 0,
    cheekY: 0,
    armWiggle: 0,
    bodyWiggle: 0,
  },
  happy: {
    eyeScaleY: 0.65,
    eyeScaleX: 1.05,
    browAngle: -10,
    mouthY: -5,
    cheekY: -3,
    armWiggle: 1,
    bodyWiggle: 0,
  },
  sad: {
    eyeScaleY: 0.9,
    eyeScaleX: 1,
    browAngle: 15,
    mouthY: 8,
    cheekY: 5,
    armWiggle: 0,
    bodyWiggle: 0,
  },
  surprised: {
    eyeScaleY: 1.4,
    eyeScaleX: 1.15,
    browAngle: -20,
    mouthY: -8,
    cheekY: -5,
    armWiggle: 0,
    bodyWiggle: 0.5,
  },
  thinking: {
    eyeScaleY: 0.75,
    eyeScaleX: 1,
    browAngle: 8,
    mouthY: 3,
    cheekY: 0,
    armWiggle: 0,
    bodyWiggle: 0,
  },
  angry: {
    eyeScaleY: 0.7,
    eyeScaleX: 0.9,
    browAngle: 20,
    mouthY: 10,
    cheekY: 8,
    armWiggle: 0,
    bodyWiggle: 0,
  },
  excited: {
    eyeScaleY: 0.5,
    eyeScaleX: 1.2,
    browAngle: -15,
    mouthY: -6,
    cheekY: -4,
    armWiggle: 1,
    bodyWiggle: 1,
  },
  love: {
    eyeScaleY: 0.6,
    eyeScaleX: 1.1,
    browAngle: -8,
    mouthY: -4,
    cheekY: -2,
    armWiggle: 0,
    bodyWiggle: 0,
  },
  shy: {
    eyeScaleY: 0.8,
    eyeScaleX: 0.95,
    browAngle: 5,
    mouthY: 2,
    cheekY: 0,
    armWiggle: 0,
    bodyWiggle: 0,
  },
}

function SpongeAvatar({ speaking, expr = 'neutral', bodyColor = '#FFF176', pantsColor = '#8D6E63' }) {
  const expression = SPONGE_EXPRESSIONS[expr] || SPONGE_EXPRESSIONS.neutral

  const openAmount = typeof speaking === 'number' ? speaking : speaking ? 0.5 : 0
  const isSpeaking = openAmount > 0.05

  const mouthOpenAmount = Math.max(0, (openAmount - 0.05) * 33)
  const jawDrop = isSpeaking ? mouthOpenAmount : 0

  // Arm animation based on speaking - subtle wiggle when talking
  const leftArmAngle = isSpeaking ? 5 : expression.armWiggle > 0 ? 3 : 0
  const rightArmAngle = isSpeaking ? -5 : expression.armWiggle > 0 ? -3 : 0
  const bodyWiggleClass = expression.bodyWiggle > 0.5 ? 'sponge-wiggle' : ''

  return (
    <div
      className={`${isSpeaking ? 'sponge-speaking' : ''} ${bodyWiggleClass}`}
      style={{
        width: '240px',
        height: '300px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <style>{`
        @keyframes sponge-talk {
          0%   { transform: scale(1);    }
          50%  { transform: scale(1.01); }
          100% { transform: scale(1);    }
        }
        @keyframes sponge-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(2deg); }
          75%      { transform: rotate(-2deg); }
        }
        .sponge-speaking {
          animation: sponge-talk 0.3s infinite ease-in-out !important;
        }
        .sponge-wiggle {
          animation: sponge-wiggle 0.25s infinite ease-in-out !important;
        }
      `}</style>
      <svg
        viewBox="0 0 240 280"
        width="100%"
        height="100%"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="spongeBody" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor={bodyColor} />
            <stop offset="100%" stopColor={bodyColor} filter="brightness(0.85)" />
          </radialGradient>
          <radialGradient id="holeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={bodyColor} filter="darken(20%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor={bodyColor} stopOpacity="0.1" />
          </radialGradient>
          <linearGradient id="pantsBrown" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={pantsColor} />
            <stop offset="100%" stopColor={pantsColor} filter="brightness(0.7)" />
          </linearGradient>
        </defs>

        {/* Arms (behind body) */}
        <g transform={`rotate(${leftArmAngle}, 55, 120)`}>
            {/* Sleeve */}
            <rect x="35" y="115" width="22" height="16" rx="3" fill="white" stroke="#E0E0E0" strokeWidth="1" />
            {/* Yellow Arm pointing downwards */}
            <path d="M42,128 L38,160" stroke="#FDD835" strokeWidth="4" strokeLinecap="round" />
            {/* Hand */}
            <g transform="translate(38, 160)">
                <circle cx="0" cy="0" r="6" fill="#FDD835" />
                <path d="M-2,2 L-4,8 M0,3 L0,9 M2,2 L4,8" stroke="#FDD835" strokeWidth="2" strokeLinecap="round" />
            </g>
        </g>
        <g transform={`rotate(${rightArmAngle}, 185, 120)`}>
            {/* Sleeve */}
            <rect x="183" y="115" width="22" height="16" rx="3" fill="white" stroke="#E0E0E0" strokeWidth="1" />
            {/* Yellow Arm pointing downwards */}
            <path d="M198,128 L202,160" stroke="#FDD835" strokeWidth="4" strokeLinecap="round" />
            {/* Hand */}
            <g transform="translate(202, 160)">
                <circle cx="0" cy="0" r="6" fill="#FDD835" />
                <path d="M-2,2 L-4,8 M0,3 L0,9 M2,2 L4,8" stroke="#FDD835" strokeWidth="2" strokeLinecap="round" />
            </g>
        </g>

        {/* Legs */}
        <g>
          <rect x="85" y="225" width="8" height="30" fill="#FDD835" />
          <rect x="145" y="225" width="8" height="30" fill="#FDD835" />
          {/* Socks */}
          <rect x="83" y="240" width="12" height="15" fill="white" />
          <rect x="143" y="240" width="12" height="15" fill="white" />
          <rect x="83" y="243" width="12" height="2" fill="#E53935" />
          <rect x="83" y="247" width="12" height="2" fill="#1E88E5" />
          <rect x="143" y="243" width="12" height="2" fill="#E53935" />
          <rect x="143" y="247" width="12" height="2" fill="#1E88E5" />
          {/* Shoes */}
          <path d="M75,255 L95,255 L98,270 Q98,275 85,275 Q72,275 72,270 Z" fill="black" />
          <path d="M142,255 L162,255 L165,270 Q165,275 152,275 Q139,275 139,270 Z" fill="black" />
        </g>

        {/* Body Main Rectangle */}
        <path 
            d="M50,40 Q55,35 65,37 Q75,35 85,38 Q95,35 110,37 Q125,35 140,38 Q155,35 175,37 Q185,35 190,40 L190,200 Q185,205 175,203 Q160,205 145,202 Q130,205 115,203 Q100,205 85,202 Q70,205 60,203 Q55,205 50,200 Z" 
            fill="url(#spongeBody)" 
            stroke="#FBC02D" 
            strokeWidth="2"
        />

        {/* Pores/Holes */}
        <g fill="url(#holeGrad)">
          <circle cx="65" cy="65" r="8" />
          <circle cx="170" cy="70" r="10" />
          <circle cx="75" cy="110" r="6" />
          <circle cx="160" cy="140" r="9" />
          <circle cx="100" cy="55" r="5" />
          <circle cx="140" cy="170" r="7" />
          <circle cx="70" cy="175" r="6" />
        </g>

        {/* Shirt (White Section) */}
        <rect x="52" y="190" width="136" height="25" fill="white" />
        
        {/* Collar and Tie */}
        <g>
            <path d="M98,190 L115,190 L110,200 Z" fill="white" stroke="#E0E0E0" strokeWidth="1" />
            <path d="M142,190 L125,190 L130,200 Z" fill="white" stroke="#E0E0E0" strokeWidth="1" />
            {/* Tie Knot */}
            <rect x="115" y="190" width="10" height="8" rx="1" fill="#E53935" />
            {/* Tie Body */}
            <path d="M115,198 L125,198 L130,222 L120,228 L110,222 Z" fill="#E53935" />
        </g>

        {/* Pants (Brown Section) */}
        <rect x="52" y="210" width="136" height="25" fill="url(#pantsBrown)" />
        {/* Belt Details */}
        <g fill="black">
          <rect x="65" y="215" width="12" height="4" />
          <rect x="95" y="215" width="12" height="4" />
          <rect x="133" y="215" width="12" height="4" />
          <rect x="163" y="215" width="12" height="4" />
        </g>

        {/* Eyes */}
        <g transform={`translate(0, ${expression.browAngle !== 0 ? -3 : 0})`}>
          <g transform={`translate(92, 95) scale(${expression.eyeScaleX}, ${expression.eyeScaleY})`}>
            <circle cx="0" cy="0" r="26" fill="white" stroke="black" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="10" fill="#4FC3F7" />
            <circle cx="0" cy="0" r="5" fill="black" />
            <circle cx="3" cy="-3" r="2.5" fill="white" />
          </g>
          <g transform={`translate(148, 95) scale(${expression.eyeScaleX}, ${expression.eyeScaleY})`}>
            <circle cx="0" cy="0" r="26" fill="white" stroke="black" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="10" fill="#4FC3F7" />
            <circle cx="0" cy="0" r="5" fill="black" />
            <circle cx="3" cy="-3" r="2.5" fill="white" />
          </g>
          {/* Eyelashes */}
          <g stroke="black" strokeWidth="2" strokeLinecap="round">
            <line x1="85" y1="65" x2="80" y2="55" />
            <line x1="92" y1="62" x2="92" y2="52" />
            <line x1="99" y1="65" x2="104" y2="55" />
            <line x1="141" y1="65" x2="136" y2="55" />
            <line x1="148" y1="62" x2="148" y2="52" />
            <line x1="155" y1="65" x2="160" y2="55" />
          </g>
        </g>

        {/* Nose */}
        <path d="M115,110 Q120,95 125,110 Q122,120 120,120 Q118,120 115,110" fill="#FDD835" stroke="#FBC02D" strokeWidth="2" />

        {/* SpongeBob Mouth — iconic curved smile lip-sync */}
        <g transform={`translate(0, ${expression.mouthY})`}>
          {(() => {
            const t = Math.min(1, openAmount)
            const cx = 120
            const smileY = 140           // centre of smile curve
            const smileW = 32            // half-width of smile

            // Upper lip stays fixed (the iconic smile curve)
            const upperY = smileY
            // Lower jaw drops with speech
            const lowerY = smileY + 6 + t * 28   // 6 → 34 drop

            if (!isSpeaking) {
              return (
                <g>
                  {/* Closed smile */}
                  <path d={`M${cx - smileW},${smileY - 5} Q${cx},${smileY + 22} ${cx + smileW},${smileY - 5}`}
                    fill="none" stroke="#3E2723" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Two front teeth always visible */}
                  <rect x="111" y="138" width="9" height="11" rx="2" fill="white" stroke="#3E2723" strokeWidth="1" />
                  <rect x="122" y="138" width="9" height="11" rx="2" fill="white" stroke="#3E2723" strokeWidth="1" />
                </g>
              )
            }

            return (
              <g>
                {/* Dark mouth interior */}
                <path
                  d={`M${cx - smileW},${upperY - 5} Q${cx},${upperY + 10} ${cx + smileW},${upperY - 5} L${cx + smileW + 5},${lowerY} Q${cx},${lowerY + 8} ${cx - smileW - 5},${lowerY} Z`}
                  fill="#1a0800"
                />
                {/* Tongue — big and pink, like real SpongeBob */}
                {t > 0.25 && (
                  <ellipse
                    cx={cx}
                    cy={lowerY - 2}
                    rx={smileW * 0.7}
                    ry={(lowerY - upperY) * 0.38}
                    fill="#E57373"
                  />
                )}
                {/* Upper smile lip */}
                <path
                  d={`M${cx - smileW},${upperY - 5} Q${cx},${upperY + 10} ${cx + smileW},${upperY - 5}`}
                  fill="none" stroke="#3E2723" strokeWidth="3" strokeLinecap="round"
                />
                {/* Two iconic front teeth (anchored to upper jaw) */}
                <rect x="111" y={upperY + 2} width="9" height="12" rx="2" fill="white" stroke="#3E2723" strokeWidth="1" />
                <rect x="122" y={upperY + 2} width="9" height="12" rx="2" fill="white" stroke="#3E2723" strokeWidth="1" />
                {/* Lower lip / chin line */}
                <path
                  d={`M${cx - smileW - 5},${lowerY} Q${cx},${lowerY + 8} ${cx + smileW + 5},${lowerY}`}
                  fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round"
                />
              </g>
            )
          })()}
        </g>

        {/* Cheeks */}
        <g opacity="0.6">
            <circle cx="75" cy="140" r="8" fill="#FFAB91" />
            <circle cx="165" cy="140" r="8" fill="#FFAB91" />
            <g fill="#D84315">
                <circle cx="72" cy="138" r="1.5" />
                <circle cx="78" cy="142" r="1.5" />
                <circle cx="162" cy="138" r="1.5" />
                <circle cx="168" cy="142" r="1.5" />
            </g>
        </g>
      </svg>
    </div>
  )
}

export default React.memo(SpongeAvatar)
