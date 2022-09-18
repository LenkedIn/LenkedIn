import styled from "styled-components"
import { useEffect } from "react"
import { useWeb3 } from "../context/Web3Context"
import Button from "../components/Button"
import { Formik, Form } from "formik"
import TextField from "../components/TextField"
import * as Yup from "yup"

const PageContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  height: 130vh;
  Form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`

const DoubleFieldsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  place-content: space-between;
  gap: 20px;
`

const ProfileFormSchema = Yup.object().shape({
  name: Yup.string().required("Required").default(""),
  gitHandle: Yup.string().default(""),
  discord: Yup.string().default(""),
  twitter: Yup.string().default(""),
  profileIconLink: Yup.string().default(""),
  introduction: Yup.string().default(""),
  skillSet: Yup.string().default(""),
  backGround: Yup.string().default(""),
  purpose: Yup.string().default(""),
})

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
      <Formik
        initialValues={ProfileFormSchema.getDefault()}
        validationSchema={ProfileFormSchema}
        onSubmit={(values, actions) => {
          console.log("submit")
          console.log(values)
          actions.setSubmitting(false)
        }}
      >
        <Form>
          <DoubleFieldsContainer>
            <TextField label="Name" name="name" placeholder="Bubu" />
            <TextField label="Github Handle" name="gitHandle" />
          </DoubleFieldsContainer>

          <DoubleFieldsContainer>
            <TextField label="Discord" name="discord" placeholder="Bubu#1000" />
            <TextField label="Twitter" name="twitter" />
          </DoubleFieldsContainer>

          <TextField label="Profile Image Link" name="profileIconLink" />
          <TextField
            label="Introduce yourself"
            name="introduction"
            placeholder="Best person ever"
            component="textarea"
          />
          <TextField
            label="What are your skill sets"
            name="skillSet"
            placeholder="Best power ever"
            component="textarea"
          />
          <TextField
            label="Tell us about your professional background"
            name="backGround"
            component="textarea"
          />
          <Button style={{ width: "30%", marginLeft: "auto" }} type="submit">
            Save
          </Button>
        </Form>
      </Formik>
    </PageContainer>
  )
}
export default CreateProfile
