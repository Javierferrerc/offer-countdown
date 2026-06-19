import React from 'react'

import styles from '../styles.css'

interface TimeUnitProps {
  value: number
  label: string
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

const Roller: React.FC<{ digit: number }> = ({ digit }) => (
  <span className={styles.roller}>
    <span className={styles.track} style={{ transform: `translateY(-${digit}em)` }}>
      {DIGITS.map(d => (
        <span key={d}>{d}</span>
      ))}
    </span>
  </span>
)

const TimeUnit: React.FC<TimeUnitProps> = ({ value, label }) => {
  const safe = Math.max(0, value)
  const tens = Math.floor(safe / 10) % 10
  const ones = safe % 10

  return (
    <div className={styles.group}>
      <span className={styles.num}>
        <Roller digit={tens} />
        <Roller digit={ones} />
      </span>
      <span className={styles.unit}>{label}</span>
    </div>
  )
}

export default TimeUnit
