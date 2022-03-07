import React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";
import DoubbleBubble from "./components/DoubleBubble/DoubleBubble.jsx";
import WaveList from "./components/WaveList/WaveList.jsx";
import Header from "./components/Header/Header.jsx";

export default function App() {

  const [currentAccount, setCurrentAccount] = React.useState()
  const [minningOver, setMinningOver] = React.useState(true)
  const [waves, setWaves] = React.useState([])
  const [contract, setContract] = React.useState()
  const contractAddress = "0x5254b542a98716e54aB07247362E04Aa12acCC8c"
  const contractABI = abi.abi 
  
  const getContract = () => {
    const { ethereum } = window
    const onNewWave = (from, timestamp, message) => {
    setWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)
      setContract(wavePortalContract)
      wavePortalContract.on("NewWave", onNewWave);
    } else {
      console.log("No wallet found")
    }
  }
  
  const getWaves = async () => {
    try {
  
      const wavesBlockchain = await contract.getAllWaves()
      setWaves(wavesBlockchain.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message
        }
      }))
    } catch (error) {
      console.log(error)
    }

  }

  const getOkayToWave = async (account) => {
    const okay = await contract.isWaverOkayToWave(account)
    console.log(okay)
    return okay
  }
  const wave = async (messageParam) => {
    try {
      const { ethereum } = window

      if (ethereum) {
        console.log(currentAccount)
        const okayToWave = await getOkayToWave(currentAccount)
        if(okayToWave){
          if(messageParam.length > 0){
          const waveWait = await contract.wave(messageParam, { gasLimit: 300000 })
          setMinningOver(false)
          await waveWait.wait()
          setMinningOver(true)
      }else{
        alert("A wave with a message is sooo much more special")
      }
        } else{
          alert("Wait a momment waver! We need a little time to breathe")
        }
        
      } else {
        console.log("No wallet found")
      }
    } catch (error) {
      console.log(error)
    }

  }



  const checkIfWalletisConnected = async () => {

    try {

      const { ethereum } = window

      const accounts = await ethereum.request({ method: "eth_accounts" })

      if (accounts.length !== 0) {
        console.log("Look a wallet address:" + accounts[0])
        setCurrentAccount(accounts[0])
      } else {
        console.log("No accounts there")
      }
    } catch (error) {
      console.log(error)
    }

  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert("Download Metamask and join Web3")
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      getWaves();
      console.log(accounts)
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  function changeMessage(e) {
    setMessage(e.target.value)
  }
  React.useEffect(() => {
    getContract()
    return () => {
    if (contract) {
      contract.off("NewWave", onNewWave);
    }
  };
  }, [])

  
  return (
    <div className="mainContainer">
      <Header className="headContainer"
        totalWaves={waves.length} 
        currentAccount={currentAccount} 
        minningOver={minningOver} 
        wave={wave} 
        connectWallet={connectWallet}/>
      <WaveList waves={waves}/>
    </div>
  );
}