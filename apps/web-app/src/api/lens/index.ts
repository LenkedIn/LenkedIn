import { gql } from "@apollo/client"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { GET_CHALLENGE } from "./query"
import { AUTHENTICATION, CREATE_PROFILE, REFRESH_AUTHENTICATION } from "./mutate"
import { ethers } from "ethers"
import { LOCAL_STORAGE_KEY } from "../../constant"
import { profileFormInterface } from "../../pages/CreateProfile"

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

export const createProfile = async (form: profileFormInterface) => {
  try {
    console.log("getting authenticating client...")
    const authenticatedClient = await getAuthenticatedClient()
    console.log("creating profile...")
    console.log("form data", form)
    const result = await authenticatedClient.mutate({
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
    console.log(result)
  } catch (error) {
    console.log(error)
  }
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
  console.log("refresh credential", tokens.accessToken, tokens.refreshToken)
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
    throw Error("no refresh token")
  }

  await refreshAuth(localStorage.getItem(LOCAL_STORAGE_KEY.LENS_REFRESH_TOKEN) as string)

  console.log(`Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.LENS_ACCESS_TOKEN)}`)

  const authenticatedClient = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
    headers: {
      "x-access-token": `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.LENS_ACCESS_TOKEN)}`,
    },
  })
  return authenticatedClient
}
