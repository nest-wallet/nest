import React, { useState, useEffect } from 'react'
import Button from '../../ui/button';
import { providers, Wallet, utils, Contract } from "ethers";


export default function HijackContent({setHijacking, currentTransaction}) {
  const [fundingTxHash, setFundingTxHash] = useState(false)
  const [funding, setFunding] = useState(true)
  const [using, setUsing] = useState(false)
  const [usingTxHash, setUsingTxHash] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [removingTxHash, setRemovingTxHash] = useState(false)

  const [error, setError] = useState(null)

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
    const fundingTx = await vault.sendTransaction(txFund)
    console.log('Funding 💸: ', fundingTx)
    setFundingTxHash(fundingTx.hash)
    await fundingTx.wait()
    console.log('Funded 💸💸💸💸💸💸💸💸💸💸💸')
    setFunding(false)


    // Transaction 2: Mint Transaction
    // this transaction is the one the user is actually requesting. 
    setUsing(true)
    const txMint = {
      to: tx.txParams.to,
      value: tx.txParams.value,
      maxFeePerGas: tx.txParams.maxFeePerGas, 
      maxPriorityFeePerGas: tx.txParams.maxPriorityFeePerGas,
      data: tx.txParams.data,
    };
    const usingTx = await burner.sendTransaction(txMint)
    console.log('Minting 🚀: ', usingTx)
    setUsingTxHash(usingTx.hash)
    await usingTx.wait()
    console.log('Minted 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀')
    

    // Transaction 3: Drain Transaction
    setRemoving(true)
    const ctr = new Contract(tx.txParams.to, ERC721_ABI, burner);
    const drainTx = await ctr['transferFrom'](BURNER_ADDRESS, VAULT_ADDRESS, token_id)
    setRemovingTxHash(drainTx.hash)
    console.log('Draining 🚮: ', drainTx)
    await drainTx.wait()
    console.log('Drained 🚮🚮🚮🚮🚮🚮🚮🚮🚮')
  }

  const handleFundingTxClick = () => {
    global.platform.openTab({
      url: `https://rinkeby.etherscan.io/tx/${fundingTxHash}`,
      active: false
    });
  }

  const handleUsingTxClick = () => {
    global.platform.openTab({
      url: `https://rinkeby.etherscan.io/tx/${usingTxHash}`,
      active: false
    });
  }

  const handleRemovingTxClick = () => {
    global.platform.openTab({
      url: `https://rinkeby.etherscan.io/tx/${removingTxHash}`,
      active: false
    });
  }

  return (
    <div className="confirm-page-container-content__details hijack-content">
      <div className="content">
        <img src="images/sheeth-metalic.png" alt="" />

        <div className="applying step">
          <h1>APPLYING CONDOM</h1>
          { fundingTxHash ? 
            <h1 onClick={handleFundingTxClick} target="_blank">View Transaction</h1> : null
          }
        </div>

        { using ?
          <div className="using step"> 
            <h1>USING CONDOM</h1>
            { usingTxHash ? 
              <h1 onClick={handleFundingTxClick} target="_blank">View Transaction</h1> : null
            }
          </div> : null
        }


        { removing ?
          <div className="removing step"> 
            <h1>REMOVING CONDOM</h1>
            { usingTxHash ? 
              <h1 onClick={handleFundingTxClick} target="_blank">View Transaction</h1> : null
            }
          </div> : null
        }
      </div>
      {/* <Button type="default" onClick={() => setHijacking(false)}>
        Make the orginal tx
      </Button> */}
    </div>
  )
}