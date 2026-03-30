/**
 * pages/CreateSplitPage.jsx
 * Creator sets bill name, adds members by username,
 * assigns custom STRK amounts per person.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { createBill, getUserByUsername } from '../lib/supabase'
import { fmtSTRK } from '../lib/starkzap'
import { sum, isValidUsername, copyToClipboard } from '../lib/utils'

const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin

export default function CreateSplitPage({ user }) {
  const navigate = useNavigate()

  const [title,    setTitle]    = useState('')
  const [members,  setMembers]  = useState([])  // { username, amount }
  const [uInput,   setUInput]   = useState('')
  const [aInput,   setAInput]   = useState('')
  const [uError,   setUError]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [billLink, setBillLink] = useState(null)
  const [copied,   setCopied]   = useState(false)

  if (!user) { navigate('/auth'); return null }

  const totalAmount = sum(members.map(m => m.amount))

  /* ── Add member ── */
  const addMember = async () => {
    const u = uInput.trim().toLowerCase().replace('@','')
    const a = parseFloat(aInput)

    if (!isValidUsername(u))   { setUError('Invalid username'); return }
    if (isNaN(a) || a <= 0)    { setUError('Amount must be > 0'); return }
    if (members.find(m => m.username === u)) { setUError('Already added'); return }

    // Verify username exists in Supabase
    setLoading(true)
    const found = await getUserByUsername(u).catch(() => null)
    setLoading(false)

    if (!found) { setUError(`@${u} not found on StarkSplit`); return }

    setMembers(prev => [...prev, { username: u, amount: a, walletAddress: found.wallet_address }])
    setUInput('')
    setAInput('')
    setUError('')
  }

  const removeMember = (username) =>
    setMembers(prev => prev.filter(m => m.username !== username))

  /* ── Create bill ── */
  const handleCreate = async () => {
    if (!title.trim())     { setError('Add a bill name');          return }
    if (members.length < 1){ setError('Add at least one person');  return }

    setLoading(true)
    setError('')
    try {
      const bill = await createBill({
        title:       title.trim(),
        creatorId:   user.id,
        totalAmount,
        splits:      members,
      })
      const link = `${APP_URL}/#/bill/${bill.id}`
      setBillLink(link)
    } catch (e) {
      setError(e?.message ?? 'Failed to create split')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await copyToClipboard(billLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  /* ── Success state ── */
  if (billLink) {
    return (
      <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
        <motion.div
          initial={{ opacity:0, scale:0.92 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
          style={{ width:'100%', maxWidth:420 }}
        >
          <div className="card card-glow" style={{ padding:'40px 28px', textAlign:'center' }}>
            <div style={{
              width:56, height:56, borderRadius:'50%',
              background:'var(--green-glow)', border:'1px solid rgba(16,185,129,0.3)',
              display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 20px', fontSize:'1.6rem',
              animation:'checkPop 0.4s ease',
            }}>
              ✓
            </div>
            <h2 style={{ fontSize:'1.4rem', marginBottom:8 }}>Split created!</h2>
            <p style={{ fontSize:'0.88rem', marginBottom:28 }}>
              Share this link with your group. They pay with Google login — no wallet needed.
            </p>

            {/* Link box */}
            <div style={{
              background:'var(--bg-raised)', border:'1px solid var(--border-2)',
              borderRadius:'var(--r-md)', padding:'12px 14px',
              display:'flex', alignItems:'center', gap:10, marginBottom:12,
            }}>
              <span style={{ flex:1, fontSize:'0.76rem', color:'var(--text-400)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {billLink}
              </span>
              <button className="btn btn-outline" onClick={handleCopy} style={{ padding:'6px 14px', fontSize:'0.76rem', flexShrink:0 }}>
                {copied ? '✓' : 'Copy'}
              </button>
            </div>

            {/* Share on X */}
            <button
              className="btn btn-primary"
              style={{ width:'100%', marginBottom:10 }}
              onClick={() => {
                const t = encodeURIComponent(`Hey frens 👋\n\nI created a split on StarkSplit — no wallet needed, just Google login.\n\nPay your share here 👇\n${billLink}\n\n@Starknet #Starkzap #StarkSplit`)
                window.open(`https://twitter.com/intent/tweet?text=${t}`, '_blank')
              }}
            >
              Share on X
            </button>

            <button className="btn btn-ghost" style={{ width:'100%' }} onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="page" style={{ padding:'40px 0 80px' }}>
      <div className="container">

        {/* Header */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5 }}
          style={{ marginBottom:28 }}
        >
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background:'none', color:'var(--text-400)', fontSize:'0.82rem', cursor:'pointer', marginBottom:16, display:'flex', alignItems:'center', gap:6 }}
          >
            ← Back
          </button>
          <h2 style={{ fontSize:'1.6rem', marginBottom:6 }}>Create a Split</h2>
          <p style={{ fontSize:'0.88rem' }}>Add a title, members and their amounts.</p>
        </motion.div>

        {/* Bill title */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.05, duration:0.5 }}
          style={{ marginBottom:20 }}
        >
          <label className="label">Bill name</label>
          <input
            className="input"
            placeholder='e.g. "Dinner at Mama\'s"'
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={60}
          />
        </motion.div>

        {/* Add member */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.1, duration:0.5 }}
          className="card"
          style={{ padding:'20px', marginBottom:20 }}
        >
          <label className="label">Add member</label>
          <div style={{ display:'flex', gap:8, marginBottom:8 }}>
            <div className="input-group" style={{ flex:2 }}>
              <span className="input-prefix">@</span>
              <input
                className="input"
                placeholder="username"
                value={uInput}
                onChange={e => { setUInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,'')); setUError('') }}
                onKeyDown={e => e.key === 'Enter' && addMember()}
                maxLength={20}
                spellCheck={false}
              />
            </div>
            <div className="input-group" style={{ flex:1 }}>
              <input
                className="input"
                type="number"
                placeholder="STRK"
                value={aInput}
                onChange={e => setAInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMember()}
                min="0.01"
                step="0.01"
                style={{ paddingRight:50 }}
              />
              <span className="input-suffix">STRK</span>
            </div>
          </div>
          {uError && <p style={{ fontSize:'0.75rem', color:'var(--red)', marginBottom:8 }}>⚠ {uError}</p>}
          <button
            className="btn btn-outline"
            onClick={addMember}
            disabled={loading || !uInput || !aInput}
            style={{ width:'100%', padding:'11px' }}
          >
            {loading ? <span className="spinner"/> : '+ Add member'}
          </button>
        </motion.div>

        {/* Members list */}
        <AnimatePresence>
          {members.length > 0 && (
            <motion.div
              initial={{ opacity:0, height:0 }}
              animate={{ opacity:1, height:'auto' }}
              exit={{ opacity:0, height:0 }}
              style={{ marginBottom:20, overflow:'hidden' }}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <label className="label" style={{ margin:0 }}>Members ({members.length})</label>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.85rem', color:'var(--orange-2)' }}>
                  Total: {fmtSTRK(totalAmount)} STRK
                </span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {members.map((m, i) => (
                  <motion.div
                    key={m.username}
                    initial={{ opacity:0, x:-16 }}
                    animate={{ opacity:1, x:0 }}
                    exit={{ opacity:0, x:16 }}
                    transition={{ delay:i*0.04 }}
                    style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      background:'var(--bg-raised)', border:'1px solid var(--border)',
                      borderRadius:'var(--r-md)', padding:'12px 16px',
                    }}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="avatar" style={{ width:32, height:32, fontSize:'0.72rem' }}>
                        {m.username.slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize:'0.85rem', fontFamily:'var(--font-display)', fontWeight:600, color:'var(--text-200)' }}>
                          @{m.username}
                        </p>
                        <p style={{ fontSize:'0.7rem', color:'var(--text-500)' }}>
                          {m.walletAddress?.slice(0,10)}…
                        </p>
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <span style={{ fontFamily:'var(--font-display)', fontWeight:700, color:'var(--orange-2)', fontSize:'0.9rem' }}>
                        {fmtSTRK(m.amount)} STRK
                      </span>
                      <button
                        onClick={() => removeMember(m.username)}
                        style={{ background:'none', color:'var(--text-500)', fontSize:'1rem', cursor:'pointer', lineHeight:1 }}
                      >
                        ×
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div style={{ background:'var(--red-glow)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'var(--r-md)', padding:'11px 15px', marginBottom:16, fontSize:'0.83rem', color:'var(--red)' }}>
            ⚠ {error}
          </div>
        )}

        {/* Create button */}
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:0.2 }}
        >
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={loading || !title.trim() || members.length === 0}
            style={{ width:'100%', padding:'16px', fontSize:'1rem' }}
          >
            {loading
              ? <><span className="spinner"/> Creating…</>
              : `⚡ Create Split · ${fmtSTRK(totalAmount)} STRK total`
            }
          </button>
        </motion.div>
      </div>
    </div>
  )
}
