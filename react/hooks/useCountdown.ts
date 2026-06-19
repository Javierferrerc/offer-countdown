import { useEffect, useMemo, useState } from 'react'

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}
export interface CountdownState {
  timeLeft: TimeLeft
  isFinished: boolean
  isValid: boolean
}

const EMPTY_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }
const SECOND = 1000
const SECONDS_IN_DAY = 86400
const SECONDS_IN_HOUR = 3600

function buildTimeLeft(remaining: number): TimeLeft {
  if (remaining <= 0) return EMPTY_TIME

  const totalSeconds = Math.floor(remaining / SECOND)

  return {
    days: Math.floor(totalSeconds / SECONDS_IN_DAY),
    hours: Math.floor((totalSeconds % SECONDS_IN_DAY) / SECONDS_IN_HOUR),
    minutes: Math.floor((totalSeconds % SECONDS_IN_HOUR) / 60),
    seconds: totalSeconds % 60,
  }
}

/**
 * Devuelve el tiempo restante hasta `finalDate` y se actualiza cada segundo.
 * - finalDate vacía o con formato inválido -> isValid = false (el componente decide qué mostrar).
 * - El intervalo se frena solo cuando la oferta termina, no antes.
 */
export default function useCountdown(finalDate?: string): CountdownState {
  const target = useMemo(() => {
    if (!finalDate) return NaN
    return new Date(finalDate).getTime()
  }, [finalDate])

  const isValid = !Number.isNaN(target)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!isValid) return undefined
    setNow(Date.now())

    const intervalId = setInterval(() => {
      const current = Date.now()
      setNow(current)

      if (current >= target) {
        clearInterval(intervalId)
      }
    }, SECOND)

    return () => clearInterval(intervalId)
  }, [target, isValid])

  const remaining = isValid ? target - now : 0

  return {
    timeLeft: buildTimeLeft(remaining),
    isFinished: isValid && remaining <= 0,
    isValid,
  }
}
