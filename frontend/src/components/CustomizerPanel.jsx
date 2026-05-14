import React from 'react'

const SKIN_TONES = [
  { c: '#FDDBB4', s: '#E8B87A' },
  { c: '#FAD4A6', s: '#F0B07A' },
  { c: '#F5BC8A', s: '#D9915A' },
  { c: '#E8975C', s: '#C47040' },
  { c: '#C4713A', s: '#9E5220' },
  { c: '#8B4513', s: '#6B3010' },
  { c: '#5C2E0A', s: '#3A1A05' },
]

const HAIR_COLORS = [
  '#1A0A00', '#3A2A1A', '#6B3A1A', '#A0522D', '#C8A060', '#D4A043',
  '#F5C060', '#E8D5B0', '#888888', '#CC2244', '#4455CC', '#22AAAA',
]

const EYE_COLORS = ['#2C1A0E', '#4A3520', '#6B8E23', '#4682B4', '#708090', '#1C1C1C', '#7B4F9E', '#2E8B57']
const LIP_COLORS = ['#C0704A', '#E07080', '#B03050', '#E8A0A0', '#CC3355', '#8B2040', '#D2691E', '#FF6B6B']
const HAIR_STYLES = ['short', 'long', 'curly', 'bun', 'spiky', 'bob', 'buzz']
const ACCESSORIES = ['none', 'glasses', 'cap', 'earrings']

const sectionLabel = {
  margin: 0,
  marginBottom: 12,
  fontSize: 14,
  textTransform: 'uppercase',
  color: '#1a1a1a',
  fontFamily: "'Architects Daughter', cursive",
  letterSpacing: '0.1em',
  fontWeight: 'bold',
  opacity: 0.8,
}

const swatchStyle = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  margin: '0 10px 10px 0',
  cursor: 'pointer',
  border: '2px solid #1a1a1a',
  boxSizing: 'border-box',
  transition: 'transform 0.2s',
}

const pillStyle = {
  padding: '8px 16px',
  margin: '0 10px 10px 0',
  borderRadius: '15px 225px 15px 255px/225px 15px 255px 15px',
  border: '2px solid #1a1a1a',
  background: 'white',
  color: '#1a1a1a',
  cursor: 'pointer',
  fontSize: 16,
  fontFamily: "'Indie Flower', cursive",
  fontWeight: 'bold',
  transition: 'all 0.2s',
  boxShadow: '4px 4px 0px rgba(0,0,0,0.05)',
}

const activePillStyle = {
  ...pillStyle,
  background: '#1a1a1a',
  color: '#fffcf5',
  transform: 'rotate(-1deg)',
  boxShadow: '6px 6px 0px rgba(0,0,0,0.1)',
}

// Character specific options
const CAT_FUR_COLORS = ['#FFB74D', '#90A4AE', '#424242', '#FAFAFA', '#D7CCC8', '#FFCCBC']
const CAT_EYE_COLORS = ['#66BB6A', '#FFD54F', '#4FC3F7', '#FF8A65', '#BCAAA4']

const SPONGE_BODY_COLORS = ['#FFF176', '#FDD835', '#FBC02D', '#D4E157', '#C0CA33']
const SPONGE_PANTS_COLORS = ['#8D6E63', '#795548', '#5D4037', '#455A64', '#3E2723']

const CHIBI_HAIR_COLORS = ['#FF80AB', '#82B1FF', '#B39DDB', '#FBC02D', '#6D4C41', '#212121']
const CHIBI_EYE_COLORS = ['#4FC3F7', '#FF80AB', '#B39DDB', '#81C784', '#6D4C41']

export default function CustomizerPanel({ state, dispatch }) {
  const { 
    avatarType, 
    skin, skinShade, hair, hairStyle, eye, lip, acc,
    catFur, catEyes,
    spongeBody, spongePants,
    chibiSkin, chibiHair, chibiEyes,
    availableVoices, selectedVoice 
  } = state

  const renderHumanControls = () => (
    <>
      <div style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Skin tone</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {SKIN_TONES.map((tone, index) => {
            const active = tone.c === skin && tone.s === skinShade
            return (
              <button
                key={index}
                type="button"
                onClick={() => dispatch({ type: 'SET_SKIN', payload: { c: tone.c, s: tone.s } })}
                style={{
                  ...swatchStyle,
                  background: tone.c,
                  transform: active ? 'scale(1.2) rotate(5deg)' : 'scale(1)',
                  boxShadow: active ? '4px 4px 0px rgba(0,0,0,0.1)' : 'none',
                }}
              />
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Hair color</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {HAIR_COLORS.map((color) => {
            const active = color === hair
            return (
              <button
                key={color}
                type="button"
                onClick={() => dispatch({ type: 'SET_HAIR_COLOR', payload: color })}
                style={{
                  ...swatchStyle,
                  background: color,
                  transform: active ? 'scale(1.2) rotate(-5deg)' : 'scale(1)',
                  boxShadow: active ? '4px 4px 0px rgba(0,0,0,0.1)' : 'none',
                }}
              />
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Hair style</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {HAIR_STYLES.map((style) => {
            const active = style === hairStyle
            return (
              <button
                key={style}
                type="button"
                onClick={() => dispatch({ type: 'SET_HAIR_STYLE', payload: style })}
                style={active ? activePillStyle : pillStyle}
              >
                {style}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Eye color</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {EYE_COLORS.map((color) => {
            const active = color === eye
            return (
              <button
                key={color}
                type="button"
                onClick={() => dispatch({ type: 'SET_EYE', payload: color })}
                style={{
                  ...swatchStyle,
                  background: color,
                  transform: active ? 'scale(1.2) rotate(5deg)' : 'scale(1)',
                  boxShadow: active ? '4px 4px 0px rgba(0,0,0,0.1)' : 'none',
                }}
              />
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Lip color</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {LIP_COLORS.map((color) => {
            const active = color === lip
            return (
              <button
                key={color}
                type="button"
                onClick={() => dispatch({ type: 'SET_LIP', payload: color })}
                style={{
                  ...swatchStyle,
                  background: color,
                  transform: active ? 'scale(1.2) rotate(-5deg)' : 'scale(1)',
                  boxShadow: active ? '4px 4px 0px rgba(0,0,0,0.1)' : 'none',
                }}
              />
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Accessories</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {ACCESSORIES.map((option) => {
            const active = option === acc
            return (
              <button
                key={option}
                type="button"
                onClick={() => dispatch({ type: 'SET_ACC', payload: option })}
                style={active ? activePillStyle : pillStyle}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )

  const renderCatControls = () => (
    <>
      <div style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Fur Color</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {CAT_FUR_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => dispatch({ type: 'SET_CAT_FUR', payload: color })}
              style={{
                ...swatchStyle,
                background: color,
                transform: color === catFur ? 'scale(1.2) rotate(5deg)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Eye Color</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {CAT_EYE_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => dispatch({ type: 'SET_CAT_EYES', payload: color })}
              style={{
                ...swatchStyle,
                background: color,
                transform: color === catEyes ? 'scale(1.2) rotate(-5deg)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
    </>
  )

  const renderSpongeControls = () => (
    <>
      <div style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Body Color</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {SPONGE_BODY_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => dispatch({ type: 'SET_SPONGE_BODY', payload: color })}
              style={{
                ...swatchStyle,
                background: color,
                transform: color === spongeBody ? 'scale(1.2) rotate(5deg)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Pants Style</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {SPONGE_PANTS_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => dispatch({ type: 'SET_SPONGE_PANTS', payload: color })}
              style={{
                ...swatchStyle,
                background: color,
                transform: color === spongePants ? 'scale(1.2) rotate(-5deg)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
    </>
  )

  const renderChibiControls = () => (
    <>
      <div style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Skin Tone</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {SKIN_TONES.map((tone, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => dispatch({ type: 'SET_CHIBI_SKIN', payload: tone.c })}
              style={{
                ...swatchStyle,
                background: tone.c,
                transform: tone.c === chibiSkin ? 'scale(1.2) rotate(5deg)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Hair Color</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {CHIBI_HAIR_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => dispatch({ type: 'SET_CHIBI_HAIR', payload: color })}
              style={{
                ...swatchStyle,
                background: color,
                transform: color === chibiHair ? 'scale(1.2) rotate(-5deg)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Eye Color</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {CHIBI_EYE_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => dispatch({ type: 'SET_CHIBI_EYES', payload: color })}
              style={{
                ...swatchStyle,
                background: color,
                transform: color === chibiEyes ? 'scale(1.2) rotate(5deg)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
    </>
  )

  return (
    <aside style={{
      width: 380,
      height: 'calc(100vh - 80px)',
      padding: '32px',
      background: '#fffcf5',
      backgroundImage: 'url("https://www.transparenttextures.com/patterns/felt.png")',
      borderRadius: '20px 225px 20px 255px/225px 20px 255px 20px',
      border: '3px solid #1a1a1a',
      boxShadow: '15px 15px 0px rgba(0,0,0,0.05)',
      overflowY: 'auto',
      position: 'relative',
      flexShrink: 0,
      transform: 'rotate(0.5deg)',
    }}>
      <h2 style={{ 
        margin: '0 0 32px 0', 
        fontSize: 24, 
        fontFamily: "'Architects Daughter', cursive",
        fontWeight: 700, 
        color: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        Sketch {avatarType === 'human' ? 'Avatar' : avatarType.charAt(0).toUpperCase() + avatarType.slice(1)}
      </h2>

      {/* Dynamic Controls based on Avatar Type */}
      {avatarType === 'human' && renderHumanControls()}
      {avatarType === 'cat' && renderCatControls()}
      {avatarType === 'spongebob' && renderSpongeControls()}
      {avatarType === 'chibi' && renderChibiControls()}

      <div style={{ marginBottom: 32, marginTop: 12, paddingTop: 20, borderTop: '2px solid #1a1a1a' }}>
        <p style={sectionLabel}>Voice</p>
        <div style={{ position: 'relative' }}>
          <select
            value={selectedVoice?.voiceURI || ''}
            onChange={(event) => {
              const selected = availableVoices.find((voice) => voice.voiceURI === event.target.value)
              dispatch({ type: 'SET_VOICE', payload: selected })
            }}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px 100px 10px 100px/100px 10px 100px 10px',
              border: '2px solid #1a1a1a',
              background: 'white',
              color: '#1a1a1a',
              fontFamily: "'Indie Flower', cursive",
              fontSize: 16,
              outline: 'none',
              appearance: 'none',
              cursor: 'pointer',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.05)',
            }}
          >
            <option value="">Select voice...</option>
            {availableVoices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
          <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <p style={sectionLabel}>Background Theme</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['light', 'dark'].map((t) => (
            <button
              key={t}
              onClick={() => dispatch({ type: 'SET_THEME', payload: t })}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '100px',
                border: '2px solid #1a1a1a',
                background: state.theme === t ? '#1a1a1a' : 'white',
                color: state.theme === t ? '#fffcf5' : '#1a1a1a',
                cursor: 'pointer',
                fontFamily: "'Indie Flower', cursive",
                fontSize: 18,
                fontWeight: 'bold',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.05)',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
