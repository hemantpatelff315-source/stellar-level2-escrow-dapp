import type { WalletState } from '../types'
import { getWalletBalance, STELLAR_NETWORK, TESTNET_NETWORK_PASSPHRASE, isValidStellarAddress } from '../utils/stellar'

const normalizeNetwork = (network?: string | null) => network?.toLowerCase() ?? STELLAR_NETWORK

const waitForFreighterApi = (maxAttempts = 10, delayMs = 500): Promise<any> => {
  return new Promise((resolve, reject) => {
    let attempts = 0
    const checkApi = () => {
      attempts++
      console.log(`[Freighter] Attempt ${attempts}/${maxAttempts} to detect extension...`)
      if (typeof window !== 'undefined' && window.freighterApi) {
        console.log('[Freighter] Extension detected!')
        resolve(window.freighterApi)
        return
      }
      if (attempts >= maxAttempts) {
        console.error('[Freighter] Extension not found after all attempts')
        reject(new Error('Freighter wallet is not installed or available. Install the extension and refresh the page.'))
        return
      }
      setTimeout(checkApi, delayMs)
    }
    checkApi()
  })
}

const getFreighterApi = async (): Promise<any> => {
  if (typeof window === 'undefined') {
    throw new Error('Window object not available.')
  }

  if (window.freighterApi) {
    console.log('[Freighter] API already available')
    return window.freighterApi
  }

  console.log('[Freighter] API not yet available, waiting...')
  return waitForFreighterApi()
}

const getFreighterAddress = async (): Promise<string> => {
  const api = await getFreighterApi()

  try {
    if (api.getAddress) {
      console.log('[Freighter] Calling getAddress()...')
      return await api.getAddress()
    }

    if (api.getPublicKey) {
      console.log('[Freighter] Calling getPublicKey()...')
      return await api.getPublicKey()
    }
  } catch (error) {
    console.error('[Freighter] Error getting address:', error)
    throw new Error('Freighter is installed but did not return a wallet address. Unlock it and try again.')
  }

  throw new Error('Freighter wallet does not expose a public key method.')
}

export const connectFreighterWallet = async (): Promise<WalletState> => {
  console.log('[Freighter] Starting connection flow...')
  const api = await getFreighterApi()

  try {
    const connected = await api.isConnected?.() ?? false
    console.log('[Freighter] isConnected:', connected)

    if (!connected) {
      console.log('[Freighter] Requesting access...')
      const allowed = await api.isAllowed?.() ?? false
      console.log('[Freighter] isAllowed:', allowed)
      if (!allowed) {
        await api.setAllowed?.()
        console.log('[Freighter] Called setAllowed()')
      }
      await api.requestAccess?.()
      console.log('[Freighter] Called requestAccess()')
    }
  } catch (error) {
    console.error('[Freighter] Error during access request:', error)
    // Continue to the address retrieval so we can get a better error message
  }

  const address = await getFreighterAddress()
  console.log('[Freighter] Got address:', address)
  const network = normalizeNetwork(await api.getNetwork?.() ?? STELLAR_NETWORK)
  console.log('[Freighter] Network:', network)
  const balance = await getWalletBalance(address)
  console.log('[Freighter] Balance:', balance)

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
