import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import GlobalStyle from "./GlobalStyle"
import CreateProfile from "./pages/CreateProfile"
import CreateProject from "./pages/CreateProject"
import Navbar from "./components/Navbar"
import Landing from "./pages/Landing"

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
            </>
          }
        />
        <Route
          path="/create-profile"
          element={
            <>
              <Navbar />
              <CreateProfile />
            </>
          }
        />
        <Route
          path="/create-project"
          element={
            <>
              <Navbar />
              <CreateProject />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
