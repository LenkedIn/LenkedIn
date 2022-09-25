import styled from "styled-components"
import { Field as FField, FieldConfig } from "formik"

const FieldLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
`

export const Label = styled.label`
  font-size: 14px;
  font-family: "TitilliumWebSemiBold";
  margin-bottom: 8px;
`

const StyledField = styled(FField)`
  border: var(--primary-green-lofi) solid 1px;
  font-size: 14px;
  font-family: "TitilliumWebSemiNormal";
  padding: 15px 10px;
  border-radius: 5px;
  &:focus {
    outline: var(--primary-green-bright) solid 1px;
  }
  ::placeholder {
    color: var(--primary-green-lofi);
  }
  :input {
    height: 30px;
  }
  textarea {
    height: 90px;
  }
`

interface Props extends FieldConfig {
  label?: string
  placeholder?: string
}

const TextField = ({ name, label, type, placeholder, ...props }: Props) => (
  <FieldLabelContainer>
    {label && <Label htmlFor={name}>{label}</Label>}
    <StyledField name={name} placeholder={placeholder} type={type} {...props}></StyledField>
  </FieldLabelContainer>
)

export default TextField
