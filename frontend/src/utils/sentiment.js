const BANKS = {
  happy: [
    'great', 'glad', 'happy', 'love', 'wonderful', 'amazing', 'excellent',
    'good', 'absolutely', 'perfect', 'fantastic', 'enjoy', 'fun',
    'exciting', 'sure', 'yes', 'awesome', 'brilliant', 'delightful',
    'nice', 'cool', 'beautiful', 'pleased', 'gladly', 'cheers',
  ],
  sad: [
    'sorry', 'unfortunate', 'sad', 'regret', 'cannot', 'cant', 'wont',
    'unable', 'fail', 'difficult', 'hard', 'problem', 'issue',
    'error', 'bad', 'unfortunately', 'apolog', 'miss', 'hurt',
    'upset', 'disappointed', 'lonely', 'cry', 'painful', 'worst',
  ],
  surprised: [
    'wow', 'really', 'oh', 'seriously', 'incredible', 'unbelievable',
    'surprising', 'unexpected', 'whoa', 'shocking', 'no way', 'omg',
    'gosh', 'astonishing', 'never expected', 'crazy', 'mind blown',
  ],
  thinking: [
    'think', 'consider', 'analyze', 'perhaps', 'maybe', 'let me',
    'wondering', 'complex', 'interesting', 'curious', 'ponder',
    'reflect', 'evaluate', 'assess', 'hmm', 'well',
    'actually', 'imagine', 'suppose', 'theory', 'depends',
  ],
  angry: [
    'angry', 'furious', 'annoyed', 'frustrated', 'mad', 'irritated',
    'unacceptable', 'ridiculous', 'stupid', 'hate', 'terrible', 'awful',
    'outrageous', 'disgusting', 'pathetic', 'infuriating', 'rage',
  ],
  excited: [
    'excited', 'thrilled', 'pumped', 'yay', 'woohoo', 'lets go',
    'cant wait', 'so much', 'incredible', 'super', 'mega', 'ultimate',
    'best ever', 'favorite', 'dream come true', 'yes yes',
  ],
  love: [
    'love', 'adore', 'cherish', 'heart', 'sweet', 'darling', 'precious',
    'dear', 'cute', 'lovely', 'warm', 'care', 'affection', 'hug',
    'kiss', 'beautiful', 'gorgeous', 'wonderful you', 'best friend',
  ],
  shy: [
    'shy', 'blush', 'embarrassed', 'nervous', 'timid', 'hesitant',
    'awkward', 'um', 'uh', 'maybe not', 'not sure', 'giggle',
    'quietly', 'whisper', 'hide', 'scared', 'afraid',
  ],
}

const EMOJIS = {
  happy: '😊',
  sad: '😢',
  surprised: '😲',
  thinking: '🤔',
  angry: '😠',
  excited: '🤩',
  love: '🥰',
  shy: '🙈',
  neutral: '😐',
}

function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .replace(/[\p{P}$+<=>^`|~]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function detectSentiment(text) {
  const normalized = normalizeText(text)
  const scores = {}
  for (const key of Object.keys(BANKS)) {
    scores[key] = 0
  }

  for (const sentiment of Object.keys(BANKS)) {
    for (const keyword of BANKS[sentiment]) {
      if (normalized.includes(keyword)) {
        scores[sentiment] += 1
      }
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1]
    const order = ['angry', 'excited', 'love', 'shy', 'happy', 'surprised', 'thinking', 'sad']
    return order.indexOf(a[0]) - order.indexOf(b[0])
  })

  const [winner, score] = sorted[0]
  return score === 0 ? 'neutral' : winner
}

export function getSentimentEmoji(sentiment) {
  return EMOJIS[sentiment] ?? EMOJIS.neutral
}

export function getSentimentLabel(text) {
  const sentiment = detectSentiment(text)
  return `${sentiment} ${getSentimentEmoji(sentiment)}`
}
