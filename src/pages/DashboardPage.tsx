import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { FiCheckCircle, FiClock, FiDollarSign, FiXCircle } from 'react-icons/fi'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PaymentForm } from '../components/PaymentForm'
import { PaymentHistory } from '../components/PaymentHistory'
import { StatCard } from '../components/StatCard'
import { WalletPanel } from '../components/WalletPanel'
import { submitPaymentToContract } from '../services/contract'
import { useWallet } from '../hooks/useWallet'
import type { PaymentRecord, PaymentStatus, PaymentFormValues } from '../types'
import { isValidStellarAddress, formatAmount } from '../utils/stellar'

const initialPayments: PaymentRecord[] = [
  {
    id: '1',
    recipient: 'GCLY3...Y2S4',
    amount: 15,
    asset: 'XLM',
    memo: 'Initial',
    status: 'success',
    hash: '4f5db842ff4ac82b',
    ledger: 1222401,
    timestamp: '2026-07-17T10:00:00.000Z',
    explorerUrl: 'https://stellar.expert/explorer/testnet/tx/4f5db842ff4ac82b',
  },
  {
    id: '2',
    recipient: 'GAQ5J...Q2M8',
    amount: 7,
    asset: 'USDC',
    memo: 'Invoice',
    status: 'pending',
    hash: '9203d11e2f2acc1c',
    ledger: null,
    timestamp: '2026-07-17T11:30:00.000Z',
    explorerUrl: 'https://stellar.expert/explorer/testnet/tx/9203d11e2f2acc1c',
  },
]

export const DashboardPage = () => {
  const { wallet, loading, connect, disconnect, refreshWallet } = useWallet()
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<PaymentStatus | 'all'>('all')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPayments((prev) => prev.map((payment) => payment.status === 'pending' ? { ...payment, status: 'success' as PaymentStatus } : payment))
    }, 10000)
    return () => window.clearInterval(timer)
  }, [])

  const stats = useMemo(() => {
    const total = payments.length
    const success = payments.filter((payment) => payment.status === 'success').length
    const pending = payments.filter((payment) => payment.status === 'pending').length
    const failed = payments.filter((payment) => payment.status === 'failed').length
    return { total, success, pending, failed, balance: wallet.balance }
  }, [payments, wallet.balance])

  const handleConnect = async () => {
    setConnectionError(null)
    try {
      await connect()
      toast.success('Wallet connected successfully.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to connect wallet.'
      setConnectionError(message)
      toast.error(message)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setConnectionError(null)
    toast.info('Wallet disconnected.')
  }

  const handleSubmit = async (values: PaymentFormValues) => {
    if (!wallet.isConnected || !wallet.address) {
      toast.error('Connect your Freighter wallet before sending a payment.')
      return
    }
    if (!isValidStellarAddress(values.recipient)) {
      toast.error('The recipient address is not a valid Stellar public key.')
      return
    }
    setSubmitting(true)
    try {
      const response = await submitPaymentToContract({
        recipient: values.recipient,
        amount: values.amount,
        asset: values.asset,
        memo: values.memo,
      }, wallet.address)
      const record: PaymentRecord = {
        id: `${Date.now()}`,
        recipient: values.recipient,
        amount: Number(values.amount),
        asset: values.asset,
        memo: values.memo,
        status: 'pending',
        hash: response.tx.hash().toString(),
        ledger: null,
        timestamp: new Date().toISOString(),
        explorerUrl: `https://stellar.expert/explorer/testnet/tx/${response.tx.hash().toString()}`,
      }
      setPayments((prev) => [record, ...prev])
      toast.success('Payment sent to Soroban contract and is pending confirmation.')
      await refreshWallet()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'The transaction could not be completed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.25),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(217,70,239,0.25),_transparent_35%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-slate-950/70 px-6 py-8 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.38em] text-cyan-300">Payment Tracker</p>
              <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Multi-address payments with real-time status.</h1>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
              Stellar Testnet • Soroban • Freighter Wallet
            </div>
          </div>
        </motion.header>

        <WalletPanel wallet={wallet} loading={loading} error={connectionError} onConnect={handleConnect} onDisconnect={handleDisconnect} />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Payments" value={stats.total} icon={<FiDollarSign />} accent="bg-cyan-500/20 text-cyan-300" />
          <StatCard title="Successful" value={stats.success} icon={<FiCheckCircle />} accent="bg-emerald-500/20 text-emerald-300" />
          <StatCard title="Pending" value={stats.pending} icon={<FiClock />} accent="bg-amber-500/20 text-amber-300" />
          <StatCard title="Failed" value={stats.failed} icon={<FiXCircle />} accent="bg-rose-500/20 text-rose-300" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <PaymentForm onSubmit={handleSubmit} loading={submitting} />
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Wallet balance</p>
              <p className="mt-4 text-4xl font-semibold text-white">{formatAmount(stats.balance)} XLM</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Realtime updates</p>
              <p className="mt-3 text-slate-300">The app listens for contract-driven state changes and refreshes the dashboard automatically when a payment confirms or fails.</p>
            </div>
          </div>
        </div>

        <PaymentHistory payments={payments} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} page={page} setPage={setPage} pageSize={5} />
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  )
}
