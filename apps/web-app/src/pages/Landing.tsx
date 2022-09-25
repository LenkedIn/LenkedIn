import styled from "styled-components"
import logo from "../assets/logo.svg"
import left from "../assets/left_lofi.svg"
import right from "../assets/right_lofi.svg"

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 200vh;
`

const BannerContainer = styled.div`
  display: block;
  margin: 100px 0;
  text-align: center;
  img {
    width: 40%;
    margin-left: auto;
    margin-right: auto;
  }
`

const ParagraphContainer = styled.div`
  width: 50%;
  margin: 50px auto;
`

const LeftImgBkg = styled.img`
  height: 300px;
  z-index: -1;
  position: absolute;
  top: 300px;
`

const RightImgBkg = styled.img`
  height: 200px;
  z-index: -1;
  position: absolute;
  top: 1200px;
  right: 0px;
`

const Landing = () => (
  <PageContainer>
    <BannerContainer>
      <img src={logo} alt="LenkedIn Logo" />
      <p>
        <b>Let your reputation speak for you</b>
      </p>
    </BannerContainer>
    <LeftImgBkg src={left} alt="LenkedIn Logo left" />
    <RightImgBkg src={right} alt="LenkedIn Logo left" />

    <ParagraphContainer>
      <h2>What's the mission</h2>
      <p>
        Finding someone to partner with on a serious and cool business or side project is sometimes
        difficult. Working with someone you don’t know before while not knowing their credibility is
        a nightmare, let alone you plan to stay anon for the project. Furthermore, for people who
        wish to separate what they’ve built from who they are, it’s challenging to prove their
        abilities just by claiming what they’ve done. This is where this project, LenkedIn, comes
        into play.
        <br />
        <br />
        <b>There are three main functions in the project: </b>
        <br />
        <b>Profile</b> - where you could specify your skills set, and Github handle (optional). The
        profile page also shows a list of your previous projects along with their corresponding
        duration, contents, and feedback from verified previous coworkers.
        <br />
        <b>Networking</b> - where you could search and find a person to work with
        <br />
        <b>Start a collab</b> - where you could start a project on the platform once you find your
        teammate(s). By including the team member’s wallet address in the form, we’ll connect the
        team member’s account with the Lens Profile, and generate identities with Semaphore.
        <br />
        <br />
        <b>How the platform works:</b>
        <br />
        When users start a collab on our platform, we will create a Merkle tree group with Semaphore
        and record who are involved in the project. Once a collab ends, users can go to their
        profile page to “claim” what they contributed to the project. The users under the same
        Merkle tree group can then “verify” the “claim” and give further feedback on the users’
        work. It is noteworthy that with zero-knowledge proof technology, we can verify whether a
        user is in a specific Merkle tree group without disclosing the user’s identity.
      </p>
    </ParagraphContainer>

    <ParagraphContainer>
      <h2>How it's made</h2>
      <p>
        In a high level, we use the LENS protocol for the social network handle and utilize it's
        onchain profile capability to make profiles protable and easy to make connections. We also
        used the Semaphore protocol, a zero-knowledge proof protocol to verify the identity of
        members to accomplish anonymous comment on our platform. Our smart contracts are coded in
        solidity, our backend utilize lambda functions as relayers, and the frontend is using React
        framework and typescript.
      </p>
    </ParagraphContainer>
  </PageContainer>
)
export default Landing
