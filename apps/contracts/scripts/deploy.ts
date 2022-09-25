import { poseidon_gencontract as poseidonContract } from "circomlibjs"
import { ethers } from "hardhat"

async function main() {
  const poseidonT3ABI = poseidonContract.generateABI(2)
  const poseidonT3Bytecode = poseidonContract.createCode(2)

  const [signer] = await ethers.getSigners()

  const PoseidonLibT3Factory = new ethers.ContractFactory(poseidonT3ABI, poseidonT3Bytecode, signer)
  const poseidonT3Lib = await PoseidonLibT3Factory.deploy()

  await poseidonT3Lib.deployed()

  console.log(`PoseidonT3 library has been deployed to: ${poseidonT3Lib.address}`)

  const IncrementalBinaryTreeLibFactory = await ethers.getContractFactory("IncrementalBinaryTree", {
    libraries: {
      PoseidonT3: poseidonT3Lib.address,
    },
  })
  const incrementalBinaryTreeLib = await IncrementalBinaryTreeLibFactory.deploy()

  await incrementalBinaryTreeLib.deployed()

  console.log(
    `IncrementalBinaryTree library has been deployed to: ${incrementalBinaryTreeLib.address}`
  )

  const ProjectFactory = await ethers.getContractFactory("ProjectFactory", {
    libraries: {
      IncrementalBinaryTree: incrementalBinaryTreeLib.address,
    },
  })

  const projectFactory = await ProjectFactory.deploy()
  await projectFactory.deployed()
  console.log(`ProjectFactory deployed to ${projectFactory.address}`)

  /**
  const Verifier16 = await ethers.getContractFactory("Verifier16")
  const verifier = await Verifier16.deploy()
  await verifier.deployed()
  console.log(`Verifier16 deployed to ${verifier.address}`)
  */

  /**
  const Project = await ethers.getContractFactory("Project")
  const project = await Project.deploy()
  await project.deployed()
  console.log(`ProjectFactory deployed to ${project.address}`)

  const Review = await ethers.getContractFactory("Review")
  const review = await Review.deploy()
  await review.deployed()
  console.log(`ProjectFactory deployed to ${review.address}`)

  const ProjectManager = await ethers.getContractFactory("ProjectManager")
  const projectManager = await ProjectManager.deploy()
  await projectManager.deployed()
  console.log(`ProjectFactory deployed to ${projectManager.address}`)
   */
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
