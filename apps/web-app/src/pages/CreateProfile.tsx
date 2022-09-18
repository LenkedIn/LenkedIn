import styled from "styled-components"
import { useEffect } from "react"
import { useWeb3 } from "../context/Web3Context"

const PageContainer = styled.div`
  display: flex;
  position: relative;
  height: 100vh;
`

const CreateProfile = () => {
  const { web3Info } = useWeb3()

  useEffect(() => {
    if (web3Info && !web3Info.account) {
      window.alert("Please connect wallet to continue.")
    }
    // To prevent unnecessary eslint check
    // eslint-disable-next-line
  }, [web3Info])

  return (
    <PageContainer>
      <h1>Create Profile</h1>
    </PageContainer>
  )
}
export default CreateProfile
