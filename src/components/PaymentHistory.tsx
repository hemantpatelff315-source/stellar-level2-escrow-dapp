import { motion } from 'framer-motion'
import type { PaymentRecord, PaymentStatus } from '../types'

interface PaymentHistoryProps {
  payments: PaymentRecord[]
  search: string
  setSearch: (value: string) => void
  filter: PaymentStatus | 'all'
  setFilter: (value: PaymentStatus | 'all') => void
  sort: string
  setSort: (value: string) => void
  page: number
  setPage: (value: number) => void
  pageSize: number
}

const badgeClass = (status: PaymentStatus) => {
  switch (status) {
    case 'success': return 'bg-emerald-500/15 text-emerald-300'
    case 'pending': return 'bg-amber-500/15 text-amber-300'
    default: return 'bg-rose-500/15 text-rose-300'
  }
}

export const PaymentHistory = ({ payments, search, setSearch, filter, setFilter, sort, setSort, page, setPage, pageSize }: PaymentHistoryProps) => {
  const filtered = payments
    .filter((payment) => {
      const matchesSearch = payment.recipient.toLowerCase().includes(search.toLowerCase()) || payment.hash.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === 'all' ? true : payment.status === filter
      return matchesSearch && matchesFilter
    })
    .sort((left, right) => {
      if (sort === 'oldest') return new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime()
      return new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime()
    })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">History</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Payment ledger</h2>
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search address or hash" className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" />
          <select value={filter} onChange={(event) => { setFilter(event.target.value as PaymentStatus | 'all'); setPage(1) }} className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white">
            <option value="all">All</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1) }} className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400">
            <tr>
              <th className="px-4 py-3">Recipient</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Hash</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((payment) => (
              <tr key={payment.id} className="border-t border-white/10 bg-slate-950/50">
                <td className="px-4 py-3">{payment.recipient.slice(0, 12)}...</td>
                <td className="px-4 py-3">{payment.amount} {payment.asset}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${badgeClass(payment.status)}`}>{payment.status}</span></td>
                <td className="px-4 py-3 font-mono text-xs">{payment.hash.slice(0, 14)}...</td>
                <td className="px-4 py-3">{new Date(payment.timestamp).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
        <p>Page {page} of {totalPages}</p>
        <div className="flex gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} className="rounded-full border border-white/10 px-3 py-2 hover:bg-white/10">Prev</button>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} className="rounded-full border border-white/10 px-3 py-2 hover:bg-white/10">Next</button>
        </div>
      </div>
    </motion.section>
  )
}
