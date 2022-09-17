import styled from "styled-components"

const FooterContainer = styled.div`
  display: flex;
  width: 100%;
  place-content: space-between;
  position: abosolute;
  bottom: 0;
`

const Footer = () => (
  <FooterContainer>
    <h3>LENKEDin</h3>
    <p>Let your reputation speak for you.</p>
  </FooterContainer>
)

export default Footer
