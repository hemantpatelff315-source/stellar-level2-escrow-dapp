export type AssetType = 'XLM' | 'USDC' | 'USDT'

export type PaymentStatus = 'pending' | 'success' | 'failed'

export interface PaymentRecord {
  id: string
  recipient: string
  amount: number
  asset: AssetType
  memo: string
  status: PaymentStatus
  hash: string
  ledger: number | null
  timestamp: string
  explorerUrl: string
  notes?: string
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  network: string | null
  balance: string
  status: 'connected' | 'disconnected' | 'loading'
}

export interface PaymentFormValues {
  recipient: string
  amount: string
  asset: AssetType
  memo: string
}
