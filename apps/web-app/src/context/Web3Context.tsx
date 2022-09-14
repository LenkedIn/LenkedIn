import React, { createContext, ReactNode, useContext, useState } from "react"

interface web3ContextInterface {
  web3Info: {
    metaMaskInstalled: boolean
    account: string | undefined
  }
  updateWeb3Info: Function
}

const web3InfoInitValue = {
  metaMaskInstalled: window.ethereum ? true : false,
  account: "",
}

/*const connectWallet = async() => {
    if(window.ethereum){
        try{
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            })
            setWeb3Info({...web3Info, metaMaskInstalled:true, account:accounts?.[0 as keyof typeof accounts]})

        } catch (error) {
            console.log(error)
        }
    }
}*/

const Web3Context = createContext<web3ContextInterface>({
  web3Info: web3InfoInitValue,
  updateWeb3Info: () => {},
})

const useWeb3 = () => useContext(Web3Context)
const Web3ContextProvider = ({ children }: { children: ReactNode }) => {
  const [web3Info, setWeb3Info] = useState<any>({
    metaMaskInstalled: window.ethereum ? true : false,
    account: "",
  })
  return (
    <Web3Context.Provider
      value={{ web3Info, updateWeb3Info: (props: object) => setWeb3Info({ ...web3Info, props }) }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export { Web3ContextProvider, useWeb3 }
