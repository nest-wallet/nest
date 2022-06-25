import React, { useState, useEffect } from 'react'
import Button from '../../ui/button';
import { providers, Wallet, utils, Contract } from "ethers";


export default function HijackContent({setHijacking, currentTransaction}) {
  const [funding, setFunding] = useState(true)
  const [using, setUsing] = useState(false)
  const [removing, setRemoving] = useState (false)
  let step = 'Funding'

  if (using) {
    step = 'Using'
  }

  if (removing) { 
    step = 'Removing'
  }

  useEffect(() => {
    handleCondom()
  }, [])

  const handleCondom = async () => {
    // set up provider
    const provider = new providers.JsonRpcProvider({ url: 'https://rinkeby.infura.io/v3/5ffee11c214a40d2a44d4a14ddc9d314' }, 4);
    provider.getNetwork(4).then(console.log);
    
    const tx = currentTransaction

    console.log(`
      data: ${tx.txParams.data}
      from: ${tx.txParams.from}
      gas: ${tx.txParams.gas}
      maxFeePerGas: ${tx.txParams.maxFeePerGas}
      maxPriorityFeePerGas: ${tx.txParams.maxPriorityFeePerGas}
      to: ${tx.txParams.to}
      value: ${tx.txParams.value}
    `)

    // // get these from Tim 
    const VAULT_PK = '84ac33125c7ed63692bbb09680e985edf62ac665aed069a55a266c1611b1acec';
    const BURNER_PK = '282a6b945d18a0e9790df680626680dd2cc82f3d44f1ac244b6a10c5a4714e65';
    const VAULT_ADDRESS = '0x50C0F0C181d35162e04545838800E42ca356a109';
    const BURNER_ADDRESS = '0x7f28133b1AeAd6465D7D5A81faAE53a9f18Fa3De';
    const CONTRACT_ADDRESS = '0xFae806Ef5fDadCBa0db4716228EC625d1FC64196';

    // // true constants
    const ERC721_ABI = [{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}, {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    // // instantiate wallets
    let vault = new Wallet(VAULT_PK, provider);
    let burner = new Wallet(BURNER_PK, provider);

    // Transaction 1: Fund Transaction
    var txFund = {
      to: BURNER_ADDRESS,
      value: tx.txParams.value, // TODO: sunny update to cover gas for the rest of the stuff
      maxFeePerGas: tx.txParams.maxFeePerGas, 
      maxPriorityFeePerGas: tx.txParams.maxPriorityFeePerGas,
    };
    console.log('here!!!')
    const vaulTx = await vault.sendTransaction(txFund)

    console.log('Funding 💸: ', vaulTx)

    // Transaction 2: Mint Transaction
    // this transaction is the one the user is actually requesting. 
    const txMint = {
      to: tx.txParams.to,
      value: tx.txParams.value,
      maxFeePerGas: tx.txParams.maxFeePerGas, 
      maxPriorityFeePerGas: tx.txParams.maxPriorityFeePerGas,
      data: tx.txParams.data,
    };

    const burnerTx = await burner.sendTransaction(txMint)
    console.log('Minting 🚀: ', burnerTx)

    // Transaction 3: Drain Transaction
    const ctr = new Contract(tx.txParams.to, ERC721_ABI, burner);
    const drainTx = await ctr['transferFrom'](BURNER_ADDRESS, VAULT_ADDRESS, token_id)
    console.log('Draining 🚮: ', drainTx)
  }

  return (
    <div className="confirm-page-container-content__details hijack-content">
      <div className="content">
        <h1>{step} Condom</h1>
        <h1>..............</h1>
      </div>
      {/* <Button type="default" onClick={() => setHijacking(false)}>
        Make the orginal tx
      </Button> */}
    </div>
  )
}