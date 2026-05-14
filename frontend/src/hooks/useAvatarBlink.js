import { useEffect } from 'react'

export default function useAvatarBlink(dispatch) {
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random()
      if (random < 0.4) {
        dispatch({ type: 'SET_BLINKING', payload: true })
        setTimeout(() => {
          dispatch({ type: 'SET_BLINKING', payload: false })
        }, 110)
      }
    }, 2600)

    return () => {
      clearInterval(interval)
    }
  }, [dispatch])
}
