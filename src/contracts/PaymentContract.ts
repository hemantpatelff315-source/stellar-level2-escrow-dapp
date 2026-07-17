export const PAYMENT_CONTRACT_ID = 'CAQGJ2QXKQ6L6J2MJ54W3P4N5EHW4Y7U7Q7ZP4J7M4R6R5Q677Y4XW6WFQ'

export const PAYMENT_CONTRACT_WASM = '/contracts/payment_contract.wasm'

export interface PaymentContractArgs {
  recipient: string
  amount: string
  asset: string
  memo: string
}

export const buildPaymentArgs = ({ recipient, amount, asset, memo }: PaymentContractArgs) => [{
  type: 'string',
  value: recipient,
}, {
  type: 'string',
  value: amount,
}, {
  type: 'string',
  value: asset,
}, {
  type: 'string',
  value: memo,
}]
