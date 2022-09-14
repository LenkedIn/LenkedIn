import { useEffect } from "react"
import styled from "styled-components"
import { useWeb3 } from "../context/Web3Context"

const PageContainer = styled.div`
  display: flex;
  position: relative;
  height: 100vh;
`

const CreateProject = () => {
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
      <h1>Create Project</h1>
    </PageContainer>
  )
}
export default CreateProject
