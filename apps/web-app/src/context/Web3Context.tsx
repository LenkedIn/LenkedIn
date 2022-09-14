import React, { createContext, ReactNode, useContext, useState } from "react"

interface web3ContextInterface {
  web3Info: {
    metaMaskInstalled: boolean
    account: string | undefined
  } | null
  updateWeb3Info: Function
  connectWallet: Function
}

const Web3Context = createContext<web3ContextInterface>({
  web3Info: null,
  updateWeb3Info: () => {},
  connectWallet: () => {},
})

const useWeb3 = () => useContext(Web3Context)

const Web3ContextProvider = ({ children }: { children: ReactNode }) => {
  const [web3Info, setWeb3Info] = useState<any>({
    metaMaskInstalled: window.ethereum ? true : false,
    account: "",
  })

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
        })
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

  return (
    <Web3Context.Provider
      value={{
        web3Info,
        updateWeb3Info: (props: object) => setWeb3Info({ ...web3Info, ...props }),
        connectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export { Web3ContextProvider, useWeb3 }
