/**
 * hooks/useTransfer.js
 * Executes a STRK ERC20 transfer via Cartridge account.
 */

import { useState, useCallback } from 'react'
import { STRK_TOKEN, toUint256 } from '../lib/starkzap'

export function useTransfer() {
  const [txHash,    setTxHash]    = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error,     setError]     = useState(null)

  /**
   * send({ account, to, amount })
   * account — Cartridge account object from useWallet
   * to      — recipient Starknet address (0x...)
   * amount  — human-readable STRK e.g. "10"
   */
  const send = useCallback(async ({ account, to, amount }) => {
    if (!account) { setError('Wallet not connected'); return null }
    if (!to)      { setError('Missing recipient');    return null }
    if (!amount)  { setError('Missing amount');       return null }

    setIsLoading(true)
    setIsSuccess(false)
    setError(null)
    setTxHash(null)

    try {
      const { low, high } = toUint256(amount)

      const result = await account.execute([{
        contractAddress: STRK_TOKEN,
        entrypoint:      'transfer',
        calldata:        [to, low, high],
      }])

      setTxHash(result.transaction_hash)
      setIsSuccess(true)
      return result.transaction_hash
    } catch (err) {
      console.error('[useTransfer]', err)
      setError(err?.message ?? 'Transfer failed')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setTxHash(null)
    setIsLoading(false)
    setIsSuccess(false)
    setError(null)
  }, [])

  return { send, txHash, isLoading, isSuccess, error, reset }
}
