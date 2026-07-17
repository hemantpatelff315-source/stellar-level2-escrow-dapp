import { motion } from 'framer-motion'
import { FiCheckCircle, FiDollarSign, FiLink2, FiLogOut } from 'react-icons/fi'
import type { WalletState } from '../types'

interface WalletPanelProps {
  wallet: WalletState
  loading: boolean
  onConnect: () => void
  onDisconnect: () => void
}

const shortAddress = (address: string | null) => address ? `${address.slice(0, 8)}...${address.slice(-6)}` : 'Not connected'

export const WalletPanel = ({ wallet, loading, onConnect, onDisconnect }: WalletPanelProps) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/10 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Wallet</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Freighter Connection</h2>
      </div>
      <div className={`rounded-full px-3 py-1 text-sm ${wallet.isConnected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800/70 text-slate-200'}`}>
        {wallet.isConnected ? 'Connected' : 'Disconnected'}
      </div>
    </div>

    <div className="mt-6 grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
        <div className="flex items-center gap-2 text-cyan-300">
          <FiLink2 />
          <span className="text-sm">Address</span>
        </div>
        <p className="mt-3 break-all font-mono text-sm text-slate-200">{shortAddress(wallet.address)}</p>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <FiCheckCircle className="text-emerald-400" />
          <span>Network: {wallet.network ?? 'testnet'}</span>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
        <div className="flex items-center gap-2 text-fuchsia-300">
          <FiDollarSign />
          <span className="text-sm">Balance</span>
        </div>
        <p className="mt-3 text-2xl font-semibold text-white">{wallet.balance} XLM</p>
      </div>
    </div>

    <div className="mt-5 flex gap-3">
      <button
        onClick={onConnect}
        className="rounded-full bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400"
      >
        {loading ? 'Connecting...' : wallet.isConnected ? 'Refresh' : 'Connect Wallet'}
      </button>
      <button
        onClick={onDisconnect}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/20"
      >
        <FiLogOut />
        Disconnect
      </button>
    </div>
  </motion.section>
)
