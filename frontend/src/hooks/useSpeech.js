import { useEffect, useRef, useState, useCallback } from 'react'

// Viseme mouth shapes for lip sync
const VISME_SHAPES = [
  'rest',      // 0: Neutral/rest position
  'ee',        // 1: Smiley/long "ee" as in "see"
  'mid',       // 2: Slightly open
  'wide',      // 3: Wide open "ah" as in "father"
  'round',     // 4: Rounded "oh" as in "go"
  'sad',       // 5: Frown/sad
  'happy',     // 6: Big smile
  'surprised', // 7: Surprised "oh"
]

// Target open amounts for each syllable (increased for more expressive movement)
const SYLLABLE_OPENS = [0.8, 1.0, 0.9, 0.7, 1.0, 0.8, 0.6, 1.1, 0.85, 0.95]

// Partial close amount (never fully shut between syllables)
const PARTIAL_CLOSE = 0.08

// Lerp speed for smooth transitions
const LERP_FACTOR = 0.3

// Voice presets for different avatars
const VOICE_PRESETS = {
  human: {
    rate: 0.95,
    pitch: 0.85,
    voicePreference: /male|man|guy|david|mark|james|daniel|george|ryan/i,
  },
  cat: {
    rate: 1.15,
    pitch: 1.35,
    voicePreference: /female|woman|girl|zira|aria|jenny/i,
  },
  spongebob: {
    rate: 1.25,
    pitch: 1.55,
    voicePreference: /male|guy/i,
  },
  chibi: {
    rate: 1.1,
    pitch: 1.2,
    voicePreference: /female|woman|girl|aria|jenny/i,
  },
}

// Emotion voice modifiers — adjust rate and pitch per emotion
const EMOTION_VOICE_MODS = {
  angry:    { rateMod: 1.1,  pitchMod: 0.85 },
  excited:  { rateMod: 1.2,  pitchMod: 1.15 },
  love:     { rateMod: 0.9,  pitchMod: 1.1 },
  shy:      { rateMod: 0.85, pitchMod: 1.05 },
  sad:      { rateMod: 0.85, pitchMod: 0.9 },
  happy:    { rateMod: 1.05, pitchMod: 1.05 },
  surprised:{ rateMod: 1.1,  pitchMod: 1.2 },
  thinking: { rateMod: 0.9,  pitchMod: 0.95 },
}

export default function useSpeech(dispatch, avatarType = 'human') {
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [isSupported, setIsSupported] = useState(false)
  const utteranceRef = useRef(null)
  const pendingOnEndRef = useRef(null)

  // Viseme/animation state
  const animationRef = useRef(null)
  const openAmountRef = useRef(0)
  const targetOpenRef = useRef(0)
  const visemeIndexRef = useRef(0)
  const isSpeakingRef = useRef(false)
  const partialCloseTimeoutRef = useRef(null)

  // Animation loop - runs continuously to lerp openAmount
  const animate = useCallback(() => {
    const current = openAmountRef.current
    const target = targetOpenRef.current

    // Lerp toward target
    const lerpedValue = current + (target - current) * LERP_FACTOR
    openAmountRef.current = lerpedValue

    // Procedural oscillation while speaking
    let mouthValue = lerpedValue
    if (isSpeakingRef.current) {
      // Add a natural-feeling oscillation with two overlapping sin waves for organic movement
      const time = Date.now() / 1000
      const oscillation = Math.sin(time * 18) * 0.15 + Math.sin(time * 27) * 0.08 + (Math.random() * 0.04)
      mouthValue = Math.max(0, lerpedValue + oscillation)
    }

    // Dispatch SET_SPEAKING when mouthValue > 0.05
    const isVisiblyOpen = mouthValue > 0.05
    dispatch({
      type: 'SET_SPEAKING',
      payload: isVisiblyOpen ? mouthValue : 0,
    })

    // Continue animation loop
    animationRef.current = requestAnimationFrame(animate)
  }, [dispatch])

  // Start animation loop on mount
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (partialCloseTimeoutRef.current) {
        clearTimeout(partialCloseTimeoutRef.current)
      }
    }
  }, [animate])

  useEffect(() => {
    const synth = window.speechSynthesis
    if (!synth) {
      setIsSupported(false)
      return
    }

    setIsSupported(true)

    const loadVoices = () => {
      const allVoices = synth.getVoices()
      const englishVoices = allVoices.filter((voice) => voice.lang?.toLowerCase().startsWith('en'))
      setVoices(englishVoices)

      if (!selectedVoice && englishVoices.length > 0) {
        // Default to a suitable voice
        const male = englishVoices.find((voice) =>
          /male|man|guy|david|mark|james|daniel|george|ryan/i.test(voice.name)
        )
        setSelectedVoice(male || englishVoices[0])
      }
    }

    loadVoices()
    synth.onvoiceschanged = loadVoices

    return () => {
      if (synth.onvoiceschanged === loadVoices) {
        synth.onvoiceschanged = null
      }
    }
  }, [selectedVoice])

  const stop = () => {
    const synth = window.speechSynthesis
    if (!synth) return

    synth.cancel()
    if (typeof pendingOnEndRef.current === 'function') {
      pendingOnEndRef.current()
      pendingOnEndRef.current = null
    }

    // Reset viseme state
    isSpeakingRef.current = false
    visemeIndexRef.current = 0
    targetOpenRef.current = 0

    if (partialCloseTimeoutRef.current) {
      clearTimeout(partialCloseTimeoutRef.current)
      partialCloseTimeoutRef.current = null
    }
  }

  const speak = (text, { onStart, onEnd, avatarType: speakAvatarType, emotion } = {}) => {
    const synth = window.speechSynthesis
    if (!synth) {
      return
    }

    stop()

    // Get voice preset based on avatar type
    const currentAvatarType = speakAvatarType || avatarType || 'human'
    const preset = VOICE_PRESETS[currentAvatarType] || VOICE_PRESETS.human

    // Apply emotion modifier if provided
    const emotionMod = emotion && EMOTION_VOICE_MODS[emotion] ? EMOTION_VOICE_MODS[emotion] : { rateMod: 1, pitchMod: 1 }

    // Reset viseme state for new speech (but don't start animation yet)
    isSpeakingRef.current = false
    visemeIndexRef.current = 0
    openAmountRef.current = 0
    targetOpenRef.current = 0

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = Math.min(2, Math.max(0.1, preset.rate * emotionMod.rateMod))
    utterance.pitch = Math.min(2, Math.max(0.1, preset.pitch * emotionMod.pitchMod))
    utterance.volume = 1.0

    // Try to find a suitable voice for the avatar type
    if (voices.length > 0) {
      const preferredVoice = voices.find((voice) =>
        preset.voicePreference.test(voice.name)
      )
      utterance.voice = preferredVoice || selectedVoice || voices[0]
    } else if (selectedVoice) {
      utterance.voice = selectedVoice
    }

    utterance.onstart = () => {
      // Start mouth animation ONLY when audio actually starts
      isSpeakingRef.current = true
      targetOpenRef.current = SYLLABLE_OPENS[0]
      if (typeof onStart === 'function') {
        onStart()
      }
    }

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        // Change the base target on each word to keep things varied
        visemeIndexRef.current = (visemeIndexRef.current + 1) % SYLLABLE_OPENS.length
        targetOpenRef.current = SYLLABLE_OPENS[visemeIndexRef.current]
      }
    }

    // Also vary mouth on character boundaries for smoother lip sync
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        visemeIndexRef.current = (visemeIndexRef.current + 1) % SYLLABLE_OPENS.length
        targetOpenRef.current = SYLLABLE_OPENS[visemeIndexRef.current]
      } else if (event.name === 'sentence') {
        // Pause briefly between sentences
        targetOpenRef.current = 0.1
        setTimeout(() => {
          if (isSpeakingRef.current) {
            visemeIndexRef.current = (visemeIndexRef.current + 1) % SYLLABLE_OPENS.length
            targetOpenRef.current = SYLLABLE_OPENS[visemeIndexRef.current]
          }
        }, 120)
      }
    }

    utterance.onend = () => {
      isSpeakingRef.current = false
      visemeIndexRef.current = 0
      targetOpenRef.current = 0

      if (partialCloseTimeoutRef.current) {
        clearTimeout(partialCloseTimeoutRef.current)
        partialCloseTimeoutRef.current = null
      }

      if (typeof onEnd === 'function') {
        onEnd()
      }
      pendingOnEndRef.current = null
    }

    pendingOnEndRef.current = onEnd
    utteranceRef.current = utterance
    try {
      synth.speak(utterance)
    } catch (error) {
      console.warn('Speech synthesis error:', error)
      isSpeakingRef.current = false
      targetOpenRef.current = 0
      if (typeof onEnd === 'function') {
        onEnd()
      }
      pendingOnEndRef.current = null
    }
  }

  // Wrapper to speak with specific avatar type
  const speakWithAvatar = (text, options = {}, type) => {
    return speak(text, { ...options, avatarType: type })
  }

  return {
    speak,
    speakWithAvatar,
    stop,
    voices,
    selectedVoice,
    setVoice: setSelectedVoice,
    isSupported,
  }
}
