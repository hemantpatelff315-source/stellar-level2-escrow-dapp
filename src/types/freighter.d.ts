type FreighterApi = {
  isConnected?: () => Promise<boolean>
  isAllowed?: () => Promise<boolean>
  requestAccess?: () => Promise<void>
  setAllowed?: () => Promise<void>
  getAddress?: () => Promise<string>
  getPublicKey?: () => Promise<string>
  getNetwork?: () => Promise<string>
  signTransaction?: (txXdr: string, options?: { networkPassphrase?: string; address?: string }) => Promise<string>
}

declare global {
  interface Window {
    freighterApi?: FreighterApi
  }
}

export {}
