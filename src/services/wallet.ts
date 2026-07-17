import type { WalletState } from '../types'
import { getWalletBalance, STELLAR_NETWORK, TESTNET_NETWORK_PASSPHRASE, isValidStellarAddress } from '../utils/stellar'

const normalizeNetwork = (network?: string | null) => network?.toLowerCase() ?? STELLAR_NETWORK

const getFreighterApi = () => {
  if (typeof window === 'undefined' || !window.freighterApi) {
    throw new Error('Freighter wallet is not installed or available. Install the extension and refresh the page.')
  }
  return window.freighterApi
}

const getFreighterAddress = async (): Promise<string> => {
  const api = getFreighterApi()

  try {
    if (api.getAddress) {
      return await api.getAddress()
    }

    if (api.getPublicKey) {
      return await api.getPublicKey()
    }
  } catch {
    throw new Error('Freighter is installed but did not return a wallet address. Unlock it and try again.')
  }

  throw new Error('Freighter wallet does not expose a public key method.')
}

export const connectFreighterWallet = async (): Promise<WalletState> => {
  const api = getFreighterApi()
  const connected = await api.isConnected?.() ?? false

  if (!connected) {
    try {
      const allowed = await api.isAllowed?.() ?? false
      if (!allowed) {
        await api.setAllowed?.()
      }
      await api.requestAccess?.()
    } catch {
      // Continue so the user can see the actual extension state from the next step.
    }
  }

  const address = await getFreighterAddress()
  const network = normalizeNetwork(await api.getNetwork?.() ?? STELLAR_NETWORK)
  const balance = await getWalletBalance(address)

  if (!isValidStellarAddress(address)) {
    throw new Error('Invalid wallet address returned by Freighter.')
  }

  return {
    isConnected: true,
    address,
    network,
    balance,
    status: network.includes(STELLAR_NETWORK) ? 'connected' : 'disconnected',
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
