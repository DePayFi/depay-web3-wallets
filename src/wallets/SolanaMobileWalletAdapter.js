/*#if _EVM
/*#elif _SOLANA

import { transact } from '@depay/solana-web3.js'

//#else */

import { transact } from '@depay/solana-web3.js'

//#endif

const KEY = '_DePayWeb3WalletsConnectedSolanaMobileWalletInstance'

class SolanaMobileWalletAdapter {

  static info = {
    name: 'Solana Mobile Wallet',
    logo: "",
    blockchains: ['solana']
  }

  static isAvailable = async()=>{
  }

  constructor() {
    this.name = (localStorage[KEY+'_name'] && localStorage[KEY+'_name'] != 'undefined') ? localStorage[KEY+'_name'] : this.constructor.info.name
    this.logo = (localStorage[KEY+'_logo'] && localStorage[KEY+'_logo'] != 'undefined') ? localStorage[KEY+'_logo'] : this.constructor.info.logo
    this.blockchains = this.constructor.info.blockchains
    this.sendTransaction = (transaction)=>{ 
    }
  }

  disconnect() {
  }

  async account() {
  }

  async connect(options) {
    const result = await transact(
      async (wallet) => {
        const authResult = wallet.authorize({
          cluster: 'mainnet-beta',
          identity: {
            name: document.title,
            uri:  window.location.origin.toString()
          },
        })
        return authResult
      }
    )
    if(!result || !result.auth_token || !result.accounts || result.acconuts.length === 0) { return }
    this.auth_token = result.auth_token
    return result.accounts[0].toString()
  }

  static isAvailable = async()=>{
  }

  async connectedTo(input) {
  }

  switchTo(blockchainName) {
  }

  addNetwork(blockchainName) {
  }

  on(event, callback) {
  }

  off(event, callback) {
  }

  async sign(message) {
    const encodedMessage = new TextEncoder().encode(message)
    const signedMessage = await transact(async (wallet) => {
      console.log('wallet', wallet)
      console.log('wallet.signMessages', wallet.signMessages)
      console.log('auth_token', this.auth_token)
      console.log('encodedMessage', encodedMessage)
      const { signed_payloads } = await wallet.signMessages({
          auth_token: this.auth_token,
          payloads: encodedMessage,
      })
      console.log('signed_payloads', signed_payloads)
      return signed_payloads
    })
    console.log('signedMessage', signedMessage)
    // if(signedMessage && signedMessage.signature) {
    //   return Array.from(signedMessage.signature)
    // }
  }
}

export default SolanaMobileWalletAdapter
