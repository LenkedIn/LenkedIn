import { createGlobalStyle } from "styled-components"
import TitilliumWebBold from "./assets/fonts/TitilliumWebBold.ttf"
import TitilliumWebRegular from "./assets/fonts/TitilliumWebRegular.ttf"
import TitilliumWebSemiBold from "./assets/fonts/TitilliumWebSemiBold.ttf"

const GlobalStyle = createGlobalStyle`
:root{
    --primary-green-bright: #57DD4B;
    --primary-green-neutral: #006c67;
    --primary-green-dark: #003844;
    --primary-green-lofi: #BCD2CB;
}
@font-face{
  font-family: 'TitilliumWebBold';
  src: url(${TitilliumWebBold}) format('truetype');
}
@font-face{
  font-family: 'TitilliumWebRegular';
  src: url(${TitilliumWebRegular}) format('truetype');
}
@font-face{
  font-family: 'TitilliumWebSemiBold';
  src: url(${TitilliumWebSemiBold}) format('truetype');
}
body {
  margin: 0;
  font-family: 'TitilliumWebRegular';
  background-color: 'white';
  color: 'black';
  padding: 20px 80px; 
}
@media only screen and (max-width: 768px){
  body {
    padding: 10px 40px; 
  }  
}
@media only screen and (max-width: 600px){
  body {
    padding: 10px 20px; 
  }  
}
h1{
  font-family: 'TitilliumWebBold';
  font-size: 36px;
}
h2{
  font-family: 'TitilliumWebSemiBold';
  font-size: 24px;
}
h3{
  font-family: 'TitilliumWebRegular';
  font-size: 24px;
}
`

export default GlobalStyle
