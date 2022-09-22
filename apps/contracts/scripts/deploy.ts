import { ethers } from "hardhat"

async function main() {
  const ProjectFactory = await ethers.getContractFactory("ProjectFactory")
  const Project = await ethers.getContractFactory("Project")
  const Review = await ethers.getContractFactory("Review")
  const ProjectManager = await ethers.getContractFactory("ProjectManager")
  const Verifier16 = await ethers.getContractFactory("Verifier16")

  const verifier = await Verifier16.deploy()
  await verifier.deployed()
  console.log(`Verifier16 deployed to ${verifier.address}`)

  const projectFactory = await ProjectFactory.deploy()
  await projectFactory.deployed()
  console.log(`ProjectFactory deployed to ${projectFactory.address}`)

  const project = await Project.deploy()
  await project.deployed()
  console.log(`ProjectFactory deployed to ${project.address}`)

  const review = await Review.deploy()
  await review.deployed()
  console.log(`ProjectFactory deployed to ${review.address}`)

  const projectManager = await ProjectManager.deploy()
  await projectManager.deployed()
  console.log(`ProjectFactory deployed to ${projectManager.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
