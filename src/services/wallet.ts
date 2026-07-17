import type { WalletState } from '../types'
import { getWalletBalance, STELLAR_NETWORK, TESTNET_NETWORK_PASSPHRASE, isValidStellarAddress } from '../utils/stellar'

export const connectFreighterWallet = async (): Promise<WalletState> => {
  if (typeof window === 'undefined' || !window.freighterApi?.isConnected) {
    throw new Error('Freighter wallet is not installed or available.')
  }

  const connected = await window.freighterApi.isConnected()
  if (!connected) {
    await window.freighterApi.requestAccess?.()
  }

  const address = await window.freighterApi.getAddress()
  const network = await window.freighterApi.getNetwork()
  const balance = await getWalletBalance(address)

  if (!isValidStellarAddress(address)) {
    throw new Error('Invalid wallet address returned by Freighter.')
  }

  return {
    isConnected: true,
    address,
    network,
    balance,
    status: network === STELLAR_NETWORK ? 'connected' : 'disconnected',
  }
}

export const disconnectFreighterWallet = () => ({
  isConnected: false,
  address: null,
  network: null,
  balance: '0',
  status: 'disconnected' as const,
})

export const signWithFreighter = async (xdr: string, address: string) => {
  if (!window.freighterApi?.signTransaction) {
    throw new Error('Freighter signing is not available in this browser.')
  }

  return window.freighterApi.signTransaction(xdr, {
    networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
    address,
  })
}
