import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import GlobalStyle from "./GlobalStyle"
import CreateProfile from "./pages/CreateProfile"
import CreateProject from "./pages/CreateProject"
import Navbar from "./components/Navbar"
import Landing from "./pages/Landing"
import Footer from "./components/Footer"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Landing />
              <Footer />
            </>
          }
        />
        <Route
          path="/create-profile"
          element={
            <>
              <Navbar />
              <CreateProfile />
              <Footer />
            </>
          }
        />
        <Route
          path="/create-project"
          element={
            <>
              <Navbar />
              <CreateProject />
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
