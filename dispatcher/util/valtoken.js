export default function valToken(exp, iat) {
  if (!exp || !iat) return null
  const valmins = (exp - iat) / 60
  return {
    valmins,
    expired: valmins > 0,
  }
}