import { Horizon, Networks, StrKey, TransactionBuilder, Operation, Asset, TimeoutInfinite, BASE_FEE } from '@stellar/stellar-sdk'

export const STELLAR_NETWORK = 'testnet'
export const TESTNET_NETWORK_PASSPHRASE = Networks.TESTNET
export const HORIZON_URL = 'https://horizon-testnet.stellar.org'
export const RPC_URL = 'https://soroban-testnet.stellar.org'
export const EXPLORER_BASE_URL = 'https://stellar.expert/explorer/testnet/tx/'

export const isValidStellarAddress = (address: string) => StrKey.isValidEd25519PublicKey(address)

export const formatAmount = (value: number | string) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(Number(value))

export const createTransactionEnvelope = async (source: string, dest: string, amount: string) => {
  const server = new Horizon.Server(HORIZON_URL)
  const account = await server.loadAccount(source)
  const txBuilder = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
  }).addOperation(Operation.payment({
    destination: dest,
    asset: Asset.native(),
    amount,
  }))
  return txBuilder.setTimeout(TimeoutInfinite).build().toXDR()
}

export const getWalletBalance = async (address: string) => {
  try {
    const server = new Horizon.Server(HORIZON_URL)
    const account = await server.loadAccount(address)
    return account.balances.find((balance) => balance.asset_type === 'native')?.balance ?? '0'
  } catch {
    return '0'
  }
}

export const getAccountDetails = async (address: string) => {
  try {
    const server = new Horizon.Server(HORIZON_URL)
    return await server.loadAccount(address)
  } catch {
    return null
  }
}

export const createSorobanServer = () => new Horizon.Server(RPC_URL)
