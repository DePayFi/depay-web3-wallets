import Argent from './Argent'
import Safe from './Safe'
import { request, getProvider } from '@depay/web3-client'

const isSmartContractWallet = async(blockchain, address)=>{
  const provider = await getProvider(blockchain)
  const code = await provider.getCode(address)
  return (code != '0x')
}

const identifySmartContractWallet = async (blockchain, address)=>{
  let name 
  try {
    name = await request({
      blockchain,
      address,
      api: [{ "constant": true, "inputs": [], "name": "NAME", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function"}],
      method: 'NAME'
    })
  } catch {}
  if(name == 'Default Callback Handler') { return 'Safe' }
  
  let executor 
  try {
    executor = await request({
      blockchain,
      address,
      api: [{ "constant": true, "inputs": [], "name": "staticCallExecutor", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function"}],
      method: 'staticCallExecutor'
    })
  } catch {}
  if(executor) { return 'Argent' }
  
}

const getSmartContractWallet = async(blockchain, address)=> {
  if(!await isSmartContractWallet(blockchain, address)){ return }

  const type = await identifySmartContractWallet(blockchain, address)
  if(type == 'Safe') {
    return new Safe({ blockchain, address })
  } else if(type == 'Argent') {
    return new Argent({ blockchain, address })
  } else {
    throw('Unrecognized smart contract wallet not supported!')
  }
}

export {
  getSmartContractWallet
}