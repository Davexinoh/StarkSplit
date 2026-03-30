/**
 * pages/LandingPage.jsx
 * The face of StarkSplit. Luxury fintech energy.
 * Scroll-triggered animations on every section.
 * Judges see this first — it needs to floor them.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal'

/* ── Feature card ────────────────────────────────────────── */
function FeatureCard({ icon, title, desc, delay }) {
  return (
    <ScrollReveal variant="fadeUp" delay={delay}>
      <div className="card card-hover" style={{ padding:'28px 24px' }}>
        <div style={{
          width:         48, height: 48,
          borderRadius:  'var(--r-md)',
          background:    'linear-gradient(135deg,var(--orange),var(--amber))',
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          fontSize:      '1.4rem',
          marginBottom:  16,
          boxShadow:     '0 4px 20px rgba(255,77,0,0.35)',
        }}>
          {icon}
        </div>
        <h3 style={{ fontSize:'1rem', marginBottom:8, fontFamily:'var(--font-display)' }}>{title}</h3>
        <p style={{ fontSize:'0.85rem', lineHeight:1.65 }}>{desc}</p>
      </div>
    </ScrollReveal>
  )
}

/* ── Step ────────────────────────────────────────────────── */
function Step({ n, title, desc, delay }) {
  return (
    <ScrollReveal variant="fadeUp" delay={delay}>
      <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
        <div style={{
          width:          44, height: 44,
          borderRadius:   '50%',
          background:     'var(--orange-glow)',
          border:         '1px solid var(--border-o)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontFamily:     'var(--font-display)',
          fontWeight:     800,
          fontSize:       '1rem',
          color:          'var(--orange-2)',
          flexShrink:     0,
          boxShadow:      '0 0 20px rgba(255,77,0,0.15)',
        }}>
          {n}
        </div>
        <div>
          <h3 style={{ fontSize:'1rem', marginBottom:6, fontFamily:'var(--font-display)' }}>{title}</h3>
          <p style={{ fontSize:'0.85rem' }}>{desc}</p>
        </div>
      </div>
    </ScrollReveal>
  )
}

/* ── Stat chip ───────────────────────────────────────────── */
function Stat({ label, val }) {
  return (
    <div style={{
      background:    'var(--bg-surface)',
      border:        '1px solid var(--border-2)',
      borderRadius:  'var(--r-full)',
      padding:       '8px 20px',
      display:       'flex',
      alignItems:    'center',
      gap:           10,
    }}>
      <span style={{ color:'var(--text-400)', fontSize:'0.78rem' }}>{label}</span>
      <span style={{
        color:         'var(--orange-2)',
        fontFamily:    'var(--font-display)',
        fontWeight:    700,
        fontSize:      '0.82rem',
      }}>
        {val}
      </span>
    </div>
  )
}

/* ── Main ────────────────────────────────────────────────── */
export default function LandingPage({ onLogin, isLoading }) {
  return (
    <div style={{ position:'relative', zIndex:1 }}>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section style={{
        minHeight:      '100dvh',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        textAlign:      'center',
        padding:        '120px 24px 80px',
        position:       'relative',
        overflow:       'hidden',
      }}>
        {/* Large ambient glow */}
        <div style={{
          position:      'absolute',
          top:           '30%',
          left:          '50%',
          transform:     'translate(-50%,-50%)',
          width:         700,
          height:        700,
          borderRadius:  '50%',
          background:    'radial-gradient(circle, rgba(255,77,0,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
          animation:     'meshFloat 10s ease-in-out infinite alternate',
        }}/>

        <motion.div
          initial={{ opacity:0, y:32 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}
        >
          <span className="badge badge-orange">
            ⚡ Built on Starkzap · Sepolia Testnet
          </span>

          <h1 style={{ maxWidth:700, fontSize:'clamp(2.8rem,8vw,5.5rem)' }}>
            Split bills.<br/>
            <span className="grad-text">Settle in STRK.</span>
          </h1>

          <p style={{ maxWidth:460, fontSize:'clamp(0.95rem,2.5vw,1.15rem)', lineHeight:1.75 }}>
            Split any expense with anyone, anywhere in the world.
            No bank account. No wallet. No fees. Just Google login and Starknet.
          </p>

          {/* Stats */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center', marginTop:8 }}>
            <Stat label="Gas fees"        val="$0.00" />
            <Stat label="Wallet needed"   val="Nope" />
            <Stat label="Works in"        val="Every country" />
          </div>

          {/* CTA */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center', marginTop:8 }}>
            <button
              className="btn btn-primary"
              onClick={onLogin}
              disabled={isLoading}
              style={{ padding:'16px 36px', fontSize:'1rem' }}
            >
              {isLoading
                ? <><span className="spinner"/> Connecting…</>
                : <>⚡ Start Splitting</>
              }
            </button>
            <a
              href="https://github.com/Davexinoh/StarkSplit"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
              style={{ padding:'16px 28px', fontSize:'0.9rem' }}
            >
              View on GitHub
            </a>
          </div>

          <p style={{ fontSize:'0.72rem', color:'var(--text-500)', marginTop:4 }}>
            Sign in with Google · No seed phrase · Powered by Cartridge
          </p>
        </motion.div>

        {/* Floating mock bill card */}
        <motion.div
          initial={{ opacity:0, y:48 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:1, delay:0.4, ease:[0.16,1,0.3,1] }}
          style={{ marginTop:60, width:'100%', maxWidth:400 }}
        >
          <div className="card card-glow" style={{ padding:'24px', animation:'float 5s ease-in-out infinite' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div>
                <p style={{ fontSize:'0.7rem', color:'var(--text-400)', fontFamily:'var(--font-display)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4 }}>Bill</p>
                <h3 style={{ fontSize:'1.1rem' }}>Dinner at Mama's 🍽</h3>
              </div>
              <span className="badge badge-orange">Open</span>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
              {[
                { name:'dave',   amount:'40', paid:true  },
                { name:'tunde',  amount:'35', paid:false },
                { name:'kemi',   amount:'25', paid:true  },
              ].map(({ name, amount, paid }) => (
                <div key={name} style={{
                  display:       'flex',
                  alignItems:    'center',
                  justifyContent:'space-between',
                  background:    'var(--bg-raised)',
                  borderRadius:  'var(--r-md)',
                  padding:       '10px 14px',
                  border:        '1px solid var(--border)',
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div className="avatar" style={{ width:28, height:28, fontSize:'0.65rem' }}>
                      {name.slice(0,2).toUpperCase()}
                    </div>
                    <span style={{ fontSize:'0.85rem', fontFamily:'var(--font-display)', fontWeight:600 }}>@{name}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:'0.85rem', color:'var(--text-200)', fontFamily:'var(--font-display)', fontWeight:700 }}>{amount} STRK</span>
                    <div className={paid ? 'dot-green' : 'dot-amber'}/>
                  </div>
                </div>
              ))}
            </div>

            <div className="glow-line"/>
            <p style={{ textAlign:'center', fontSize:'0.72rem', color:'var(--text-500)', marginTop:14 }}>
              ⚡ ZapDrop · Starknet Sepolia
            </p>
          </div>
        </motion.div>
      </section>

      {/* ══ PROBLEM / USE CASE ═══════════════════════════════ */}
      <section style={{ padding:'100px 24px' }}>
        <div className="container-wide">
          <ScrollReveal variant="fadeUp">
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <span className="badge badge-muted" style={{ marginBottom:20, display:'inline-flex' }}>The Problem</span>
              <h2 style={{ maxWidth:600, margin:'0 auto 20px' }}>
                Your friend in Lagos owes your friend in Accra.
              </h2>
              <p style={{ maxWidth:500, margin:'0 auto', fontSize:'1rem' }}>
                Venmo doesn't work. CashApp doesn't work. Bank transfers take days and eat fees.
                Crypto solves it — but nobody has a wallet.
              </p>
            </div>
          </ScrollReveal>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
            <FeatureCard delay={0}    icon="🌍" title="Works anywhere"       desc="Send STRK to anyone, anywhere in the world. No bank account required." />
            <FeatureCard delay={0.08} icon="🔑" title="No wallet needed"     desc="Sign in with Google. Starknet wallet auto-deployed. Zero crypto knowledge." />
            <FeatureCard delay={0.16} icon="⚡" title="Gasless settlements"  desc="AVNU Paymaster covers all gas. Your friends pay exactly their share — nothing extra." />
            <FeatureCard delay={0.24} icon="📊" title="Real-time dashboard"  desc="Track who paid, who hasn't. Send reminders. Close bills when everyone settles." />
            <FeatureCard delay={0.32} icon="🔗" title="Shareable links"      desc="One link. Share on WhatsApp, X, Telegram. Anyone can join and pay." />
            <FeatureCard delay={0.40} icon="🏗" title="Built on Starknet"    desc="Cairo execution, native AA, SNIP-36 paymaster. Pull any one out and this breaks." />
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════ */}
      <section style={{ padding:'100px 24px', background:'rgba(255,255,255,0.01)' }}>
        <div className="container-wide" style={{ maxWidth:680 }}>
          <ScrollReveal variant="fadeUp">
            <div style={{ textAlign:'center', marginBottom:60 }}>
              <span className="badge badge-muted" style={{ marginBottom:20, display:'inline-flex' }}>How it works</span>
              <h2>Simple as sending a message</h2>
            </div>
          </ScrollReveal>

          <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
            <Step n="1" delay={0}    title="Sign in with Google"          desc="No wallet setup. No seed phrase. Your Starknet account is auto-created on first login." />
            <Step n="2" delay={0.1}  title="Pick a username"              desc="Set your identity — @dave, @tunde, whoever. This is what your friends add when splitting." />
            <Step n="3" delay={0.2}  title="Create a split"               desc="Add a bill name, total amount, and assign custom amounts per person by username." />
            <Step n="4" delay={0.3}  title="Share the link"               desc="One link generates. Send it on WhatsApp, X, or wherever your group lives." />
            <Step n="5" delay={0.4}  title="Friends pay their share"      desc="They open the link, login with Google, and pay gaslessly. No crypto knowledge needed." />
            <Step n="6" delay={0.5}  title="Track it all"                 desc="Your dashboard shows every split — who paid, who hasn't, full tx history on Starkscan." />
          </div>
        </div>
      </section>

      {/* ══ BUILT ON STARKNET ════════════════════════════════ */}
      <section style={{ padding:'100px 24px' }}>
        <div className="container-wide" style={{ maxWidth:720 }}>
          <ScrollReveal variant="fadeUp">
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <span className="badge badge-muted" style={{ marginBottom:20, display:'inline-flex' }}>Architecture</span>
              <h2>Only possible on Starknet</h2>
              <p style={{ marginTop:16, fontSize:'1rem' }}>
                Pull any one of these out and StarkSplit breaks.
              </p>
            </div>
          </ScrollReveal>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:12 }}>
            {[
              { layer:'Cairo',           desc:'Provable execution — every transfer is a ZK-proven computation.',          color:'#FF4D00' },
              { layer:'Stwo',            desc:'Fast proof generation — makes gasless txns cheap enough to sponsor.',       color:'#FF8C00' },
              { layer:'Native AA',       desc:'Google login without a wallet is impossible on any other chain.',           color:'#FFB800' },
              { layer:'SNIP-36',         desc:'In-protocol paymaster verification — trustless gas sponsorship.',           color:'#FF6B00' },
            ].map(({ layer, desc, color }, i) => (
              <ScrollReveal key={layer} variant="scaleIn" delay={i * 0.08}>
                <div className="card" style={{ padding:'22px 20px' }}>
                  <div style={{
                    display:      'inline-flex',
                    alignItems:   'center',
                    gap:          8,
                    background:   `${color}18`,
                    border:       `1px solid ${color}35`,
                    borderRadius: 'var(--r-full)',
                    padding:      '4px 12px',
                    marginBottom: 12,
                  }}>
                    <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.75rem', color }}>{layer}</span>
                  </div>
                  <p style={{ fontSize:'0.85rem', lineHeight:1.65 }}>{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BOTTOM ═══════════════════════════════════════ */}
      <section style={{ padding:'100px 24px 120px' }}>
        <ScrollReveal variant="scaleIn">
          <div className="card card-glow" style={{
            maxWidth:  640,
            margin:    '0 auto',
            padding:   '56px 40px',
            textAlign: 'center',
          }}>
            <span className="badge badge-orange" style={{ marginBottom:24, display:'inline-flex' }}>
              Live on Starknet Sepolia
            </span>
            <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', marginBottom:16 }}>
              Ready to split?
            </h2>
            <p style={{ marginBottom:32, fontSize:'1rem', maxWidth:380, margin:'0 auto 32px' }}>
              Sign in with Google and start splitting expenses with anyone in the world.
            </p>
            <button
              className="btn btn-primary"
              onClick={onLogin}
              disabled={isLoading}
              style={{ padding:'16px 44px', fontSize:'1rem' }}
            >
              {isLoading
                ? <><span className="spinner"/> Connecting…</>
                : <>⚡ Launch StarkSplit</>
              }
            </button>
            <p style={{ marginTop:20, fontSize:'0.72rem', color:'var(--text-500)' }}>
              Powered by Starkzap · Cartridge Controller · AVNU Paymaster
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
