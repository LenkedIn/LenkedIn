import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { createGlobalStyle } from 'styled-components'
import TitilliumWebBold from './assets/fonts/TitilliumWebBold.ttf'
import TitilliumWebRegular from './assets/fonts/TitilliumWebRegular.ttf'
import TitilliumWebSemiBold from './assets/fonts/TitilliumWebSemiBold.ttf' 
import Landing from "./pages/Landing"

const GlobalStyle = createGlobalStyle`
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

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <GlobalStyle/>
    <BrowserRouter>
    <Routes>
      <Route path='/'
      element={
        <Landing/>
      }/>
    </Routes>
    </BrowserRouter>
    
  </React.StrictMode>
)
