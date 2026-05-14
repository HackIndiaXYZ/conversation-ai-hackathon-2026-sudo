export const initialState = {
  skin: '#FAD4A6',
  skinShade: '#F0B07A',
  hair: '#3A2A1A',
  hairStyle: 'long',
  eye: '#2C1A0E',
  lip: '#C0704A',
  acc: 'none',

  expr: 'neutral',
  speaking: false,
  blinking: false,

  messages: [],
  isLoading: false,
  status: 'Ready',
  bubble: 'Ask me anything — I am listening!',
  error: null,

  selectedVoice: null,
  availableVoices: [],
  theme: 'light',
  isCustomizing: false,
  avatarType: 'human',

  // Character-specific customization
  catFur: '#FFB74D',
  catEyes: '#66BB6A',
  
  spongeBody: '#FFF176',
  spongePants: '#8D6E63',
  
  chibiSkin: '#FFE0B2',
  chibiHair: '#FF80AB',
  chibiEyes: '#4FC3F7',
}

export default function avatarReducer(state, action) {
  switch (action.type) {
    case 'SET_AVATAR_TYPE':
      return {
        ...state,
        avatarType: action.payload,
      }
    case 'SET_SKIN':
      return {
        ...state,
        skin: action.payload.c,
        skinShade: action.payload.s,
      }
    case 'SET_HAIR_COLOR':
      return {
        ...state,
        hair: action.payload,
      }
    case 'SET_HAIR_STYLE':
      return {
        ...state,
        hairStyle: action.payload,
      }
    case 'SET_EYE':
      return {
        ...state,
        eye: action.payload,
      }
    case 'SET_LIP':
      return {
        ...state,
        lip: action.payload,
      }
    case 'SET_ACC':
      return {
        ...state,
        acc: action.payload,
      }
    case 'SET_EXPR':
      return {
        ...state,
        expr: action.payload,
      }
    case 'SET_SPEAKING':
      return {
        ...state,
        speaking: action.payload,
      }
    case 'SET_BLINKING':
      return {
        ...state,
        blinking: action.payload,
      }
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload,
      }
    case 'SET_BUBBLE':
      return {
        ...state,
        bubble: action.payload,
      }
    case 'SET_VOICES':
      return {
        ...state,
        availableVoices: action.payload,
      }
    case 'SET_VOICE':
      return {
        ...state,
        selectedVoice: action.payload,
      }
    case 'LOAD_SAVED':
      return {
        ...state,
        ...action.payload,
        avatarType: action.payload.avatarType || 'human',
      }
    case 'CLEAR_CHAT':
      return {
        ...state,
        messages: [],
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      }
    case 'TOGGLE_CUSTOMIZE':
      return {
        ...state,
        isCustomizing: action.payload !== undefined ? action.payload : !state.isCustomizing,
      }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      }
    
    // Character Specific Actions
    case 'SET_CAT_FUR':
      return { ...state, catFur: action.payload }
    case 'SET_CAT_EYES':
      return { ...state, catEyes: action.payload }
    case 'SET_SPONGE_BODY':
      return { ...state, spongeBody: action.payload }
    case 'SET_SPONGE_PANTS':
      return { ...state, spongePants: action.payload }
    case 'SET_CHIBI_SKIN':
      return { ...state, chibiSkin: action.payload }
    case 'SET_CHIBI_HAIR':
      return { ...state, chibiHair: action.payload }
    case 'SET_CHIBI_EYES':
      return { ...state, chibiEyes: action.payload }
    default:
      return state
  }
}
