import React, { useState, useEffect } from 'react'
import Button from '../../ui/button';
<<<<<<< HEAD
import { providers, Wallet, utils, Contract } from "ethers";
// import { DEFAULT_ROUTE } from '../../../../helpers/constants/routes';
=======
import { providers, Wallet, utils, Contract, BigNumber } from "ethers";
>>>>>>> 57b697a99a4cc8201b17584df46118abb54aa877

function burnerWallet(address, url) {
  const VAULT_PK = localStorage.getItem(address)
  const BURNER_PK = utils.keccak256(utils.toUtf8Bytes(`${VAULT_PK},${url}`)).slice(2) 
  const VAULT_ADDRESS = (new Wallet(VAULT_PK)).address.toLowerCase()
  const BURNER_ADDRESS = (new Wallet(BURNER_PK)).address.toLowerCase()

  const res = { 
    VAULT_PK, 
    BURNER_PK,
    VAULT_ADDRESS,
    BURNER_ADDRESS
  }
  console.log(res)
  return res
}

export default function HijackContent({setHijacking, currentTransaction}) {
  const [fundingTxHash, setFundingTxHash] = useState(false)
  const [funding, setFunding] = useState(true)
  const [using, setUsing] = useState(true)
  const [usingTxHash, setUsingTxHash] = useState(false)
  const [removing, setRemoving] = useState(true)
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

    const { VAULT_PK, BURNER_PK, VAULT_ADDRESS, BURNER_ADDRESS } = burnerWallet(tx.txParams.from.toLowerCase(), tx.txParams.to)

    // const VAULT_PK = '84ac33125c7ed63692bbb09680e985edf62ac665aed069a55a266c1611b1acec';
    // const BURNER_PK = '282a6b945d18a0e9790df680626680dd2cc82f3d44f1ac244b6a10c5a4714e65';
    // const VAULT_ADDRESS = '0x50C0F0C181d35162e04545838800E42ca356a109';
    // const BURNER_ADDRESS = '0x7f28133b1AeAd6465D7D5A81faAE53a9f18Fa3De';
    const CONTRACT_ADDRESS = '0xFae806Ef5fDadCBa0db4716228EC625d1FC64196';

    // // true constants
    const ERC721_ABI = [{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}, {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    // // instantiate wallets
    let vault = new Wallet(VAULT_PK, provider);
    let burner = new Wallet(BURNER_PK, provider);

    // skipping formal gas estimation, assuming 0.02e is fine
    // const gasUsed = await provider.estimateGas({
    //   from: tx.txParams.from, 
    //   to: tx.txParams.to,
    //   value: tx.txParams.value,
    //   maxFeePerGas: tx.txParams.maxFeePerGas, 
    //   maxPriorityFeePerGas: tx.txParams.maxPriorityFeePerGas,
    //   data: tx.txParams.data,
    // });

    // Transaction 1: Fund Transaction
    var txFund = {
      to: BURNER_ADDRESS,
      value: BigNumber.from(parseInt(tx.txParams.value,16) + parseInt(utils.parseUnits("0.02","ether")).toString()),
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
    const tokenID = await fetch(`https://api-rinkeby.etherscan.io//api?module=account&action=tokennfttx&address=${BURNER_ADDRESS}&apikey=P5FV45I8JHBENEKNHSYUT28RTDTPQEFCE3`)
      .then(response => response.json())
      .then(data => {
        return data.result[data.result.length-1].tokenID;
      });

    console.log(`token id : ${tokenID}`)

    const ctr = new Contract(tx.txParams.to, ERC721_ABI, burner);
    const drainTx = await ctr['transferFrom'](BURNER_ADDRESS, VAULT_ADDRESS, tokenID)
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

  const handleSuccess = () => {
    // history.push(DEFAULT_ROUTE);
  }

  return (
    <div className="confirm-page-container-content__details hijack-content">
      <div className="content">
        <img src="images/sheeth-metalic.png" alt="" />

        <div className="applying step">
          <h1>APPLYING CONDOM</h1>
          <p>FUNDING BURNER FROM VAULT</p>
          { fundingTxHash ? 
            <p onClick={handleFundingTxClick} className="pointer">View Transaction</p> : <img src="images/loading.gif" className="loading" alt="" />
          }
        </div>

        { using ?
          <div className="using step"> 
            <h1>USING CONDOM</h1>
            <p>USING CONDOM TO INTERACT</p>
            { usingTxHash ? 
              <p onClick={handleUsingTxClick} className="pointer">View Transaction</p> : <img src="images/loading.gif" className="loading" alt="" />
            }
          </div> : null
        }


        { removing ?
          <div className="removing step"> 
            <h1>REMOVING CONDOM</h1>
            <p>DRAINING BURNER TO VAULT</p>
            { usingTxHash ? 
              <p onClick={handleRemovingTxClick} className="pointer">View Transaction</p> : <img src="images/loading.gif" className="loading" alt="" />
            }
          </div> : null
        }


        <h1 className="success" onClick={handleSuccess}>SUCCESS!</h1>
      </div>
      {/* <Button type="default" onClick={() => setHijacking(false)}>
        Make the orginal tx
      </Button> */}
    </div>
  )
}