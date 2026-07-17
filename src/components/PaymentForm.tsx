import { motion } from 'framer-motion'
import { useState } from 'react'
import type { PaymentFormValues } from '../types'

interface PaymentFormProps {
  onSubmit: (values: PaymentFormValues) => Promise<void> | void
  loading?: boolean
}

const defaults: PaymentFormValues = {
  recipient: '',
  amount: '',
  asset: 'XLM',
  memo: '',
}

export const PaymentForm = ({ onSubmit, loading = false }: PaymentFormProps) => {
  const [values, setValues] = useState<PaymentFormValues>(defaults)
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentFormValues, string>>>({})

  const handleChange = (field: keyof PaymentFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors: Partial<Record<keyof PaymentFormValues, string>> = {}
    if (!values.recipient.trim()) nextErrors.recipient = 'Recipient address is required.'
    if (!values.amount.trim()) nextErrors.amount = 'Amount is required.'
    if (Number(values.amount) <= 0) nextErrors.amount = 'Amount must be greater than zero.'
    if (values.memo.length > 28) nextErrors.memo = 'Memo should stay under 28 characters.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    await onSubmit(values)
    setValues(defaults)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Multi-address</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Send payment</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300">
          <span>Recipient Address</span>
          <input
            value={values.recipient}
            onChange={(event) => handleChange('recipient', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none ring-0"
            placeholder="G..."
          />
          {errors.recipient ? <p className="text-sm text-rose-400">{errors.recipient}</p> : null}
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Amount</span>
          <input
            type="number"
            min="0.1"
            step="0.01"
            value={values.amount}
            onChange={(event) => handleChange('amount', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none ring-0"
            placeholder="0.00"
          />
          {errors.amount ? <p className="text-sm text-rose-400">{errors.amount}</p> : null}
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Asset</span>
          <select
            value={values.asset}
            onChange={(event) => handleChange('asset', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
          >
            <option value="XLM">XLM</option>
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Memo</span>
          <input
            value={values.memo}
            onChange={(event) => handleChange('memo', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none ring-0"
            placeholder="Optional"
          />
          {errors.memo ? <p className="text-sm text-rose-400">{errors.memo}</p> : null}
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-3 font-semibold text-white transition hover:opacity-90"
      >
        {loading ? 'Submitting...' : 'Invoke Soroban Payment'}
      </button>
    </motion.form>
  )
}
