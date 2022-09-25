export const AUTHENTICATION = `
  mutation($request: SignedAuthChallenge!) { 
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
 }
`

export const CREATE_PROFILE = `
mutation($request: CreateProfileRequest!) { 
    createProfile(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
            __typename
    }
 }
`

export const REFRESH_AUTHENTICATION = `
  mutation($request: RefreshRequest!) { 
    refresh(request: $request) {
      accessToken
      refreshToken
    }
 }
`

export const CREATE_SET_PROFILE_TYPED_DATA = `
mutation ($request:CreatePublicSetProfileMetadataURIRequest!) {
    createSetProfileMetadataTypedData(request: $request) {
      id
        expiresAt
        typedData {
          types {
            SetProfileMetadataURIWithSig {
              name
              type
            }
          }
          domain {
            name
            chainId
            version
            verifyingContract
          }
          value {
            nonce
            deadline
            profileId
            metadata
          }
        }
    }
  }
`
