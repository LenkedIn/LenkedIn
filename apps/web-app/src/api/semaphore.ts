import { ethers } from "ethers"
import { Identity } from "@semaphore-protocol/identity"
import { LOCAL_STORAGE_KEY } from "../constant"

const provider = new ethers.providers.Web3Provider(window?.ethereum as any)
const signer = provider.getSigner()

export const generateIdCommitment = async (groupId: string) => {
  const timeStamp = new Date().getTime()
  const signature = await signer.signMessage(
    `create id for group with Id ${groupId} at time ${timeStamp}`
  )
  const identity = new Identity(signature)
  localStorage.setItem(LOCAL_STORAGE_KEY.SEMAPHORE_TRAPDOOR, JSON.stringify(identity.getTrapdoor()))
  localStorage.setItem(
    LOCAL_STORAGE_KEY.SEMAPHORE_NULLIFIER,
    JSON.stringify(identity.getNullifier())
  )
  localStorage.setItem(
    LOCAL_STORAGE_KEY.SEMAPHORE_COMMITMENT,
    JSON.stringify(identity.generateCommitment())
  )
}
