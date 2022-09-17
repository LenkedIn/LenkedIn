import styled from "styled-components"
import { Link, NavLink } from "react-router-dom"
import Button from "./Button"
import { useWeb3 } from "../context/Web3Context"

const Logo = styled.div`
  display: inline-block;
`

const NavbarContainer = styled.div`
    display: flex;
    position: absolute:
    width: 100%;
    justify-content: space-between;
    align-items: center;
    ul{
        list-style: none;
        display:flex;
        font-family: 'TitilliumWebSemiBold';
        font-size: 16px;
        align-items: center;
    }
    li{
        margin-right: 30px;
        a{
            text-decoration: none;
            color: black;
        }
        a:hover{
            color: var(--primary-green-neutral);
        }
        a.current-page{
            color: var(--primary-green-neutral) !important;
            font-family: 'TitilliumWebBold' !important;
        }
    }
`
const isCurrentPage = (path: string): string => {
  return String(window.location).includes(path) ? "current-page" : ""
}

const Navbar = () => {
  const { connectWallet, web3Info } = useWeb3()
  return (
    <NavbarContainer>
      <Logo>
        <Link style={{ textDecoration: "none", color: "black" }} to={{ pathname: "/" }}>
          <h1>LENKEDin</h1>
        </Link>
      </Logo>
      <ul>
        <li>
          <NavLink
            to={{ pathname: "/create-project" }}
            className={isCurrentPage("/create-project")}
          >
            Create Project
          </NavLink>
        </li>
        <li>
          <NavLink
            to={{ pathname: "/create-profile" }}
            className={isCurrentPage("/create-profile")}
          >
            Create Profile
          </NavLink>
        </li>
        <li>
          <Button bgColor="--primary-green-lofi" textColor="black" onClick={() => connectWallet()}>
            {web3Info?.account ? web3Info.account.substr(0, 10) + "..." : "Connect Wallet"}
          </Button>
        </li>
      </ul>
    </NavbarContainer>
  )
}
export default Navbar
