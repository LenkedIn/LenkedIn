import { gql } from "@apollo/client"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { GET_CHALLENGE, GET_DEFAULT_PROFILES, GET_PROFILES_BY_ADDRESSES } from "./query"
import {
  AUTHENTICATION,
  CREATE_PROFILE,
  CREATE_SET_PROFILE_TYPED_DATA,
  REFRESH_AUTHENTICATION,
} from "./mutate"
import { ethers } from "ethers"
import { CONTRACT_ADDRESSES, LOCAL_STORAGE_KEY } from "../../constant"
import { profileFormInterface } from "../../pages/CreateProfile"
import { formDataToMeta, uploadProfileToIpfs } from "../ipfs"
import PERIPHERY from "../../abi/lensperiphery.json"
import omitDeep from "omit-deep"

const APIURL = "https://api-mumbai.lens.dev/"

export const apolloClient = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
})

const provider = new ethers.providers.Web3Provider(window?.ethereum as any)
const signer = provider.getSigner()

export const getChallenge = async () => {
  const addresses = await provider.listAccounts()
  const response = await apolloClient.query({
    query: gql(GET_CHALLENGE),
    variables: {
      request: {
        address: addresses[0],
      },
    },
  })
  return { address: addresses[0], text: response.data.challenge.text }
}

export const authenticate = async (address: string, signature: string) => {
  const result = await apolloClient.mutate({
    mutation: gql(AUTHENTICATION),
    variables: {
      request: {
        address,
        signature,
      },
    },
  })
  return result
}

export const refreshAuth = async (refreshToken: string) => {
  const response = await apolloClient.mutate({
    mutation: gql(REFRESH_AUTHENTICATION),
    variables: {
      request: {
        refreshToken,
      },
    },
  })
  const tokens = response?.data?.refresh
  localStorage.setItem(LOCAL_STORAGE_KEY.LENS_ACCESS_TOKEN, tokens.accessToken)
  localStorage.setItem(LOCAL_STORAGE_KEY.LENS_REFRESH_TOKEN, tokens.refreshToken)
}

export const getAccessToken = async () => {
  try {
    const { address, text } = await getChallenge()
    const signature = await signer.signMessage(text)
    const response = await authenticate(address, signature)
    localStorage.setItem(
      LOCAL_STORAGE_KEY.LENS_ACCESS_TOKEN,
      response?.data?.authenticate?.accessToken
    )
    localStorage.setItem(
      LOCAL_STORAGE_KEY.LENS_REFRESH_TOKEN,
      response?.data?.authenticate?.refreshToken
    )
  } catch (err) {
    console.log(err)
  }
}

export const getAuthenticatedClient = async () => {
  // refresh credential
  if (!localStorage.getItem(LOCAL_STORAGE_KEY.LENS_REFRESH_TOKEN)) {
    await getAccessToken()
  }

  await refreshAuth(localStorage.getItem(LOCAL_STORAGE_KEY.LENS_REFRESH_TOKEN) as string)

  const authenticatedClient = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
    headers: {
      "x-access-token": `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.LENS_ACCESS_TOKEN)}`,
    },
  })
  return authenticatedClient
}

export const createProfile = async (form: profileFormInterface) => {
  try {
    const authenticatedClient = await getAuthenticatedClient()
    await authenticatedClient.mutate({
      mutation: gql(CREATE_PROFILE),
      variables: {
        request: {
          handle: form.name,
          profilePictureUri: form.profileIconLink || null,
          followModule: {
            freeFollowModule: true,
          },
        },
      },
    })
    alert("profile created")
  } catch (error) {
    console.log(error)
  }
}

export const getDefaultProfile = async (ethereumAddress: string | undefined) => {
  try {
    const result = await apolloClient.query({
      query: gql(GET_DEFAULT_PROFILES),
      variables: {
        request: {
          ethereumAddress,
        },
      },
    })
    return result
  } catch (err) {
    console.log(err)
  }
}

export const getProfilesByAddress = async (ethereumAddressList: Array<string> | undefined) => {
  try {
    console.log("getting info by address", ethereumAddressList)
    const result = await apolloClient.query({
      query: gql(GET_PROFILES_BY_ADDRESSES),
      variables: {
        request: { ownedBy: ethereumAddressList, limit: 10 },
      },
    })
    console.log(result)
    const { items } = result?.data?.profiles
    const profiles = items.map((item: any) => ({ ethereumAddress: item?.ownedBy, profile: item }))
    console.log(profiles)
    return profiles
  } catch (err) {
    console.log(err)
  }
}

export const updateProfile = async (prevProfile: any, formData: any, setPending: Function) => {
  const metaData = formDataToMeta(prevProfile, formData)
  const ipfsLink = await uploadProfileToIpfs(metaData)
  const authenticatedClient = await getAuthenticatedClient()
  const result = await authenticatedClient.mutate({
    mutation: gql(CREATE_SET_PROFILE_TYPED_DATA),
    variables: {
      request: {
        profileId: prevProfile.id,
        metadata: ipfsLink,
      },
    },
  })
  const typedData = result.data.createSetProfileMetadataTypedData.typedData
  const signature = await signer._signTypedData(
    omitDeep(typedData.domain, "__typename"),
    omitDeep(typedData.types, "__typename"),
    omitDeep(typedData.value, "__typename")
  )
  const { v, r, s } = ethers.utils.splitSignature(signature)
  const lensPeripheryContract = new ethers.Contract(
    CONTRACT_ADDRESSES.LENS_PERIPHERY,
    PERIPHERY,
    signer
  )
  try {
    setPending(true)
    const tx = await lensPeripheryContract.setProfileMetadataURIWithSig(
      {
        profileId: prevProfile.id,
        metadata: ipfsLink,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      },
      { gasLimit: 500000 }
    )
    const receipt = await tx.wait()
    setPending(false)
    if (receipt.status !== 1) {
      alert("transaction error")
    }
  } catch (err) {
    console.log(err)
  }
}
