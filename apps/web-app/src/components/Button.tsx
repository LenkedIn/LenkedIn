import styled from "styled-components"

interface Props {
  bgColor?: string
  textColor?: string
}

const Button = styled.button<Props>`
  background-color: var(${p => p.bgColor});
  color: ${p => p.textColor};
  font-family: "TitilliumWebSemiBold";
  font-size: 16px;
  border-radius: 6px;
  border: none;
  padding: 5px 10px;
  :hover {
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
`

Button.defaultProps = {
  bgColor: "--primary-green-dark",
  textColor: "white",
}

export default Button
