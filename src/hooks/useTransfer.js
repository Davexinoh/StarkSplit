import { useState, useCallback } from 'react'
import { STRK_TOKEN } from '../lib/starkzap'

function mockHash() {
  return '0x' + Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join('')
}

export function useTransfer(onDeduct) {
  const [txHash,    setTxHash]    = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error,     setError]     = useState(null)

  const send = useCallback(async ({ account, to, amount }) => {
    if (!account) { setError('Wallet not connected'); return null }
    if (!to)      { setError('Missing recipient');    return null }
    if (!amount)  { setError('Missing amount');       return null }

    setIsLoading(true)
    setIsSuccess(false)
    setError(null)
    setTxHash(null)

    try {
      // Execute mock transfer
      const result = await account.execute([{
        contractAddress: STRK_TOKEN,
        entrypoint:      'transfer',
        calldata:        [to, String(amount), '0x0'],
      }])

      const hash = result?.transaction_hash ?? mockHash()
      setTxHash(hash)
      setIsSuccess(true)

      // Deduct balance immediately after success
      if (onDeduct) onDeduct(parseFloat(amount))

      return hash
    } catch (err) {
      console.error('[useTransfer]', err)
      setError(err?.message ?? 'Transfer failed')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [onDeduct])

  const reset = useCallback(() => {
    setTxHash(null)
    setIsLoading(false)
    setIsSuccess(false)
    setError(null)
  }, [])

  return { send, txHash, isLoading, isSuccess, error, reset }
}
