import React from 'react'

import useCountdown from './hooks/useCountdown'
import TimeUnit from './components/TimeUnit'
import styles from './styles.css'

interface OfferCountdownProps {
  /** Permite ocultar el componente desde el Site Editor sin borrarlo del bloque. */
  showComponent?: boolean
  /** Texto principal de la oferta (ej: "La oferta termina en"). */
  title?: string
  /** Fecha y hora límite en formato ISO (ej: 2026-12-31T23:59:59). */
  finalDate?: string
  /** Texto a mostrar cuando la oferta ya terminó. */
  finishedText?: string
}

const DEFAULT_FINISHED_TEXT = 'Oferta finalizada'

// Formato local-independiente (dd/mm/aaaa hh:mm) para no depender del ICU del runtime.
function formatFinalDate(finalDate?: string): string {
  if (!finalDate) return ''

  const date = new Date(finalDate)
  if (Number.isNaN(date.getTime())) return ''

  const pad = (n: number) => String(n).padStart(2, '0')

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`
}

const OfferCountdown: StorefrontFunctionComponent<OfferCountdownProps> = ({
  showComponent = true,
  title,
  finalDate,
  finishedText = DEFAULT_FINISHED_TEXT,
}) => {
  const { timeLeft, isFinished, isValid } = useCountdown(finalDate)

  // Si el editor lo ocultó o la fecha no es válida, no renderizamos nada.
  // Así el componente nunca rompe la Home aunque le falte configuración.
  if (!showComponent || !isValid) return null

  const formattedDate = formatFinalDate(finalDate)

  return (
    <div className={styles.container} role="timer" aria-live="polite">
      <div className={styles.head}>
        <span className={styles.dot} />
        {title ? <p className={styles.label}>{title}</p> : null}
      </div>

      {isFinished ? (
        <div className={styles.expired}>
          <p className={styles.expiredTitle}>{finishedText}</p>
        </div>
      ) : (
        <>
          <div className={styles.timer}>
            <TimeUnit value={timeLeft.days} label="días" />
            <TimeUnit value={timeLeft.hours} label="horas" />
            <TimeUnit value={timeLeft.minutes} label="min" />
            <TimeUnit value={timeLeft.seconds} label="seg" />
          </div>

          {formattedDate ? (
            <p className={styles.end}>finaliza el {formattedDate}</p>
          ) : null}
        </>
      )}
    </div>
  )
}

OfferCountdown.schema = {
  title: 'Contador de Oferta',
  description:
    'Muestra un contador regresivo (días, horas, minutos y segundos) para una oferta por tiempo limitado.',
  type: 'object',
  properties: {
    showComponent: {
      title: 'Mostrar componente',
      type: 'boolean',
      default: true,
    },
    title: {
      title: 'Texto principal',
      type: 'string',
      default: 'La oferta termina en',
    },
    finalDate: {
      title: 'Fecha final de la oferta',
      description: 'Seleccioná la fecha y hora en que termina la oferta.',
      type: 'string',
      format: 'date-time',
      default: '',
      widget: {
        'ui:widget': 'datetime',
      },
    },
    finishedText: {
      title: 'Texto al finalizar',
      type: 'string',
      default: DEFAULT_FINISHED_TEXT,
    },
  },
}

export default OfferCountdown
