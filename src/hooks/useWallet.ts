import { useEffect, useState } from 'react'
import { connectFreighterWallet, disconnectFreighterWallet } from '../services/wallet'
import type { WalletState } from '../types'

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    network: null,
    balance: '0',
    status: 'loading',
  })
  const [loading, setLoading] = useState(true)

  const refreshWallet = async () => {
    try {
      setLoading(true)
      const state = await connectFreighterWallet()
      setWallet(state)
    } catch {
      setWallet(disconnectFreighterWallet())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refreshWallet()
  }, [])

  const connect = async () => {
    try {
      const state = await connectFreighterWallet()
      setWallet(state)
      return state
    } catch (error) {
      throw error
    }
  }

  const disconnect = () => {
    setWallet(disconnectFreighterWallet())
  }

  return { wallet, loading, connect, disconnect, refreshWallet }
}
