import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  accent: string
}

export const StatCard = ({ title, value, icon, accent }: StatCardProps) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      </div>
      <div className={`rounded-2xl p-3 text-xl ${accent}`}>{icon}</div>
    </div>
  </motion.article>
)
