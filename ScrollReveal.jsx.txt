/**
 * components/ScrollReveal.jsx
 * Wraps children in a Framer Motion div that animates when scrolled into view.
 * Used throughout the landing page for the "text pops on scroll" effect.
 */

import React from 'react'
import { motion } from 'framer-motion'

const variants = {
  fadeUp:    { hidden: { opacity: 0, y: 32 },  visible: { opacity: 1, y: 0 } },
  fadeIn:    { hidden: { opacity: 0 },          visible: { opacity: 1 } },
  scaleIn:   { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  slideLeft: { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0 } },
  slideRight:{ hidden: { opacity: 0, x: 32 },  visible: { opacity: 1, x: 0 } },
}

export default function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.65,
  className = '',
  style = {},
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={variants[variant]}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
