import { useEffect } from "react"
import styled from "styled-components"
import { useWeb3 } from "../context/Web3Context"
import Button from "../components/Button"
import { Formik, Form } from "formik"
import TextField from "../components/TextField"
import * as Yup from "yup"

const PageContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  height: 100vh;
  Form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`

const ProjectFormSchema = Yup.object().shape({
  projectName: Yup.string().required("Required").default(""),
  gitRepo: Yup.string().default(""),
  projectIconLink: Yup.string().default(""),
  projectDescription: Yup.string().default(""),
})

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
      <Formik
        initialValues={ProjectFormSchema.getDefault()}
        validationSchema={ProjectFormSchema}
        onSubmit={(values, actions) => {
          console.log(values)
          actions.setSubmitting(false)
        }}
      >
        <Form>
          <TextField label="Project Name" name="projectName" placeholder="Project Apollo" />
          <TextField label="Github Repository" name="gitRepo" />
          <TextField label="Project Image Link" name="projectIconLink" />
          <TextField
            label="Project Description"
            name="projectDescription"
            placeholder="Best project ever"
            component="textarea"
          />
          <Button style={{ width: "30%", marginLeft: "auto" }} type="submit">
            Save and Generate Invitation Code
          </Button>
        </Form>
      </Formik>
    </PageContainer>
  )
}
export default CreateProject
