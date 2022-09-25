import React, { createContext, ReactNode, useContext, useState } from "react"
import { ethers } from "ethers"
import { getProfilesByAddress } from "../api/lens"

interface web3ContextInterface {
  web3Info: {
    metaMaskInstalled: boolean
    account: string | undefined
    provider: any
  } | null
  profileInfo: any
  pending: boolean
  updateWeb3Info: Function
  connectWallet: Function
  checkConnection: Function
  setPending: Function
}

const Web3Context = createContext<web3ContextInterface>({
  web3Info: null,
  profileInfo: null,
  pending: false,
  updateWeb3Info: () => {},
  connectWallet: () => {},
  checkConnection: () => {},
  setPending: () => {},
})

const useWeb3 = () => useContext(Web3Context)

const Web3ContextProvider = ({ children }: { children: ReactNode }) => {
  const [web3Info, setWeb3Info] = useState<any>({
    metaMaskInstalled: window.ethereum ? true : false,
    account: "",
    provider: undefined,
  })

  const [profileInfo, setProfileInfo] = useState<any>({})

  const [pending, setPending] = useState<boolean>(false)

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setWeb3Info({
          ...web3Info,
          metaMaskInstalled: true,
          account: accounts?.[0 as keyof typeof accounts],
          provider: new ethers.providers.Web3Provider(window?.ethereum as any),
        })
        //const profile = await getDefaultProfile(accounts?.[0 as keyof typeof accounts])
        const profiles = await getProfilesByAddress(accounts as Array<string>)
        // if account not created, profile will be empty array
        setProfileInfo(profiles[0]?.profile)
      } catch (error) {
        console.log(error)
        window.alert("Metamask Error, details in console.")
        return {
          status: false,
          message: "Metamask Error.",
        }
      }
    } else {
      window.alert("Please install MetaMask to continue.")
      return {
        status: false,
        message: "Please install MetaMask to continue.",
      }
    }
  }

  const checkConnection = async () => {
    //todo: check chainID
  }

  return (
    <Web3Context.Provider
      value={{
        web3Info,
        profileInfo,
        pending,
        updateWeb3Info: (props: object) => setWeb3Info({ ...web3Info, ...props }),
        connectWallet,
        checkConnection,
        setPending,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export { Web3ContextProvider, useWeb3 }
