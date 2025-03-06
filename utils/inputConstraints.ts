import React from 'react'

export const setNumberInputConstraints = (
  e: React.ChangeEvent<HTMLInputElement>,
  min: number,
  max: number
) => {
  const value = parseInt(e.target.value)
  if (isNaN(value)) {
    return ''
  }
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

