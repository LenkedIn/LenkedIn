import styled from "styled-components"
import TextField from "../components/TextField"
import Button from "../components/Button"
import { Formik, Form } from "formik"
import { useWeb3 } from "../context/Web3Context"
import { useEffect } from "react"
import { generateIdCommitment } from "../api/semaphore"
import * as Yup from "yup"

const PageContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  height: 100vh;
  Form {
    display: block;
    width: 50%;
    margin: auto;
  }
`

const JoinGroupFormSchema = Yup.object().shape({
  groupId: Yup.string().default(""),
})

const JoinGroup = () => {
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
      <Formik
        initialValues={JoinGroupFormSchema.getDefault()}
        validationSchema={JoinGroupFormSchema}
        onSubmit={async (values, actions) => {
          console.log(values)
          //await generateIdCommitment(values.groupId)
          actions.setSubmitting(false)
        }}
      >
        <Form>
          <h2>Enter GroupId to join group</h2>
          <TextField label="Group Id" name="groupId" placeholder="001ed" />
          <Button style={{ width: "30%", marginLeft: "auto" }} type="submit">
            Join Group
          </Button>
        </Form>
      </Formik>
    </PageContainer>
  )
}

export default JoinGroup
