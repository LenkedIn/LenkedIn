import styled from "styled-components"
import { useEffect, useState } from "react"
import { useWeb3 } from "../context/Web3Context"
import Button from "../components/Button"
import { Formik, Form } from "formik"
import TextField from "../components/TextField"
import * as Yup from "yup"
import { createProfile, updateProfile } from "../api/lens"

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

export type profileFormInterface = {
  name: string
  gitHandle: string
  discord: string
  twitter: string
  profileIconLink: string
  introduction: string
  skillSet: string
  backGround: string
  purpose: string
}

const loadLENSProfile = () => {
  console.log("log lens profile")
}

export const CreateProfile = () => {
  const { web3Info, profileInfo } = useWeb3()
  const [prevProfile, setPrevProfile] = useState<any>()

  useEffect(() => {
    if (web3Info && !web3Info.account) {
      window.alert("Please connect wallet to continue.")
    }
    if (profileInfo) {
      setPrevProfile({
        name: profileInfo.handle,
        gitHandle: "",
        discord: "",
        twitter: "",
        profileIconLink: "",
        introduction: profileInfo.bio || "",
        skillSet: "",
        backGround: "",
        purpose: "",
      })
    }
    // To prevent unnecessary eslint check
    // eslint-disable-next-line
  }, [web3Info, profileInfo])

  return (
    <PageContainer>
      <h1>Create Profile</h1>
      <Formik
        enableReinitialize
        initialValues={prevProfile || ProfileFormSchema.getDefault()}
        validationSchema={ProfileFormSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(false)
          if (!profileInfo) {
            await createProfile(values)
          } else {
            await updateProfile(profileInfo, values)
          }
        }}
      >
        {props => (
          <Form>
            <Button
              style={{ width: "30%", marginRight: "auto", marginBottom: "20px" }}
              type="button"
              onClick={() => {
                loadLENSProfile()
              }}
            >
              Import LENS profile binded with the address
            </Button>
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
            <Button
              style={{ width: "30%", marginLeft: "auto" }}
              type="submit"
              disabled={!props.dirty}
            >
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </PageContainer>
  )
}
