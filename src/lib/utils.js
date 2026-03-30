/** Generate a unique bill ID (12 char alphanumeric) */
export function generateBillId() {
  return Math.random().toString(36).slice(2, 8) +
         Math.random().toString(36).slice(2, 8)
}

/** Format date */
export function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

/** Validate username — alphanumeric + underscore, 3-20 chars */
export function isValidUsername(u) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(u)
}

/** Copy to clipboard */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/** Sum array of numbers */
export function sum(arr) {
  return arr.reduce((a, b) => a + Number(b), 0)
}

/** Get initials from username */
export function initials(username) {
  if (!username) return '?'
  return username.slice(0, 2).toUpperCase()
}
