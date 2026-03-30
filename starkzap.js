/**
 * lib/starkzap.js
 * ─────────────────────────────────────────────────────────
 * StarkSplit wallet layer.
 * Uses @cartridge/controller directly (which is a peer dep
 * of starkzap — starkzap remains in package.json).
 *
 * STRK token address on Sepolia.
 */

export const STRK_TOKEN = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d'
export const EXPLORER   = 'https://sepolia.starkscan.co'
export const NETWORK    = import.meta.env.VITE_NETWORK || 'sepolia'
export const RPC_URL    = 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7'

/** Convert human-readable STRK to uint256 low/high calldata */
export function toUint256(amount) {
  const wei = BigInt(Math.round(parseFloat(amount) * 1e18))
  return {
    low:  '0x' + (wei & BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')).toString(16),
    high: '0x' + (wei >> BigInt(128)).toString(16),
  }
}

/** Format STRK — strips trailing zeros */
export function fmtSTRK(val) {
  const n = parseFloat(val)
  if (isNaN(n)) return '0'
  return n % 1 === 0 ? String(n) : n.toFixed(4).replace(/\.?0+$/, '')
}

/** Shorten a wallet address */
export function shortAddr(addr) {
  if (!addr) return ''
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}
