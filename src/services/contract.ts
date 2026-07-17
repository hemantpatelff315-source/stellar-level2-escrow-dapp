import { Contract, TransactionBuilder, nativeToScVal, TimeoutInfinite, BASE_FEE, Operation, Account } from '@stellar/stellar-sdk'
import { PAYMENT_CONTRACT_ID, type PaymentContractArgs, buildPaymentArgs } from '../contracts/PaymentContract'
import { TESTNET_NETWORK_PASSPHRASE } from '../utils/stellar'
import { signWithFreighter } from './wallet'

export const submitPaymentToContract = async ({ recipient, amount, asset, memo }: PaymentContractArgs, sourceAddress: string) => {
  const contract = new Contract(PAYMENT_CONTRACT_ID)
  const sourceAccount = new Account(sourceAddress, '0')
  const server = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
  })
  const args = buildPaymentArgs({ recipient, amount, asset, memo })
  const operation = Operation.invokeContractFunction({
    contract: contract.address().toString(),
    function: 'record_payment',
    args: args.map((arg) => nativeToScVal(arg.value, { type: arg.type } as never)),
  })
  const tx = server.addOperation(operation).setTimeout(TimeoutInfinite).build()
  const signedXdr = await signWithFreighter(tx.toXDR(), sourceAddress)
  return { signedXdr, tx }
}
