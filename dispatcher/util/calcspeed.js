const MIN_SPEED_KMH = 10
const CONV_FACTOR = 3.6

export default function calcMovingSpeed(loc) {
  const { speed } = loc
  if (speed <= 0) return null 
  const kmh = speed * CONV_FACTOR
  return kmh >= MIN_SPEED_KMH
}