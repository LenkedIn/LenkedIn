"use strict"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { DynamoDB } from "aws-sdk"
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof } from "@semaphore-protocol/proof"
import { ethers } from "ethers"
import {v4 as uuidv4} from 'uuid';


function is_valid(value: any): boolean {
  return (
    value !== null && typeof value.identityCommitment === "string"
      // typeof value.project_name === "string" &&
      // typeof value.admin_address === "string" && 
      // typeof value.project_image_link === "string" &&
      // typeof value.project_description === "string" &&
      // typeof value.project_github_repo === "string"
  )
}

// input params:
// - admin_address : address of admin's wallet
// - project_name : name of project
// - project_image_link : url of project image
// - project_description : description of project
// - project_github_repo : url of project github
export const create_project = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);
  const data = JSON.parse(event.body);

  // input profile data validation
  if (!is_valid(data)) {
    console.error("Validation Failed");
    return {
      statusCode: 400,
      body: JSON.stringify({
          message: "Validation Failed!",
          input: event,
        })
    }
  }

  // init blockchain network provider
  const network = process.env.BLOCK_CHAIN_NETWORK;
  const provider = ethers.getDefaultProvider(network, {
    alchemy: process.env.ALCHEMY_API_KEY,
  });

  // init relayer 
  const relayer_wallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY);
  console.log(`Relayer address: ${await relayer_wallet.getAddress()}`);
  const relayer = relayer_wallet.connect(provider);

  // init contract
  const address = process.env.CONTRACT_ADDR;
  const abi = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "InvalidTime", "type": "error" }, { "inputs": [], "name": "InvalidTreeDepth", "type": "error" }, { "inputs": [], "name": "Semaphore__GroupAlreadyExists", "type": "error" }, { "inputs": [], "name": "Semaphore__GroupDoesNotExist", "type": "error" }, { "inputs": [], "name": "Semaphore__GroupIdIsNotLessThanSnarkScalarField", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "groupId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "merkleTreeDepth", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "zeroValue", "type": "uint256" } ], "name": "GroupCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "groupId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "identityCommitment", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "merkleTreeRoot", "type": "uint256" } ], "name": "MemberAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "groupId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "identityCommitment", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "merkleTreeRoot", "type": "uint256" } ], "name": "MemberRemoved", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "groupId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "identityCommitment", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "newIdentityCommitment", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "merkleTreeRoot", "type": "uint256" } ], "name": "MemberUpdated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "nullifierHash", "type": "uint256" } ], "name": "NullifierHashAdded", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "groupId", "type": "uint256" }, { "internalType": "uint256", "name": "identityCommitment", "type": "uint256" } ], "name": "addMember", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimReviews", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint8", "name": "depth", "type": "uint8" }, { "internalType": "uint256", "name": "zeroValue", "type": "uint256" }, { "internalType": "uint256", "name": "identityCommitment", "type": "uint256" } ], "name": "createProject", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "groupId", "type": "uint256" }, { "internalType": "string", "name": "projectName", "type": "string" }, { "internalType": "string", "name": "githubRepository", "type": "string" }, { "internalType": "string", "name": "projectImageLink", "type": "string" }, { "internalType": "string", "name": "projectDescription", "type": "string" } ], "name": "editProjectInfo", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "groupId", "type": "uint256" } ], "name": "endProject", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "idCommitment", "type": "uint256" } ], "name": "getLeafByIDCommitment", "outputs": [ { "internalType": "uint256[]", "name": "projectList", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "idCommitment", "type": "uint256" } ], "name": "getLensConnect", "outputs": [ { "internalType": "string", "name": "_lensProfile", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "groupId", "type": "uint256" } ], "name": "getMerkleTreeDepth", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "groupId", "type": "uint256" } ], "name": "getMerkleTreeRoot", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "groupId", "type": "uint256" } ], "name": "getNumberOfMerkleTreeLeaves", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "idCommitment", "type": "uint256" } ], "name": "getOngoingProjectsByIDCommitment", "outputs": [ { "internalType": "uint256[]", "name": "projectList", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getProjectCount", "outputs": [ { "internalType": "uint256", "name": "projectCount", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "groupId", "type": "uint256" }, { "internalType": "uint256", "name": "identityCommitment", "type": "uint256" }, { "internalType": "uint256[]", "name": "proofSiblings", "type": "uint256[]" }, { "internalType": "uint8[]", "name": "proofPathIndices", "type": "uint8[]" } ], "name": "removeMember", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "idCommitment", "type": "uint256" }, { "internalType": "string", "name": "lensProfile", "type": "string" } ], "name": "setLensConnect", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "groupId", "type": "uint256" }, { "internalType": "uint256", "name": "fromIdCommitment", "type": "uint256" }, { "internalType": "uint256", "name": "toIdCommitment", "type": "uint256" }, { "internalType": "string", "name": "reviewContent", "type": "string" }, { "internalType": "uint256[8]", "name": "proof", "type": "uint256[8]" } ], "name": "submitReviews", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];
  const lenkedin_SC = new ethers.Contract(address, abi, relayer);

  // create project(group) on SC
  try {
    const create_group_tx = await lenkedin_SC.createProject(
      process.env.GROUP_DEPTH,
      process.env.ZERO_VALUE,
      data.identityCommitment
    );
    await create_group_tx.wait();

    console.log("transaction result:",create_group_tx);
  } catch (error){
    console.error(error)
    return {
      statusCode: error.statusCode || 501,
      body: JSON.stringify({
          message: "Error Occured when sending tx to smart contract!",
          details: error,
      })
    }
  }

  // get group_id from contract
  const group_id = await lenkedin_SC.getProjectCount() -1 ;

  // return result and group_id
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          tx_status : "Project created",
          group_id: group_id,
        },
        null,
        2
      ),
    }



  // save project data to DB
  // init db and update expression
  // const timestamp = new Date().getTime();
  // const dynamoDb = new DynamoDB.DocumentClient();
  // const params = {
  //   TableName: process.env.PROJECT_DYNAMODB_TABLE_NAME,
  //   Item: {
  //     group_id: data.group_id,
  //     project_name: data.project_name,
  //     invitation_code: uuidv4(),
  //     updated_at: timestamp,
  //   },
  // }
  // console.log(`project update expression:${params}`);

  // update function
  // try {
  //   const response = await dynamoDb.put(params).promise()
  //   console.log(response)

  //   // return update successfully message
  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify({
  //         message: "Project Update Successfully!",
  //     })
  //   }
  // } catch (err) {
  //   console.error(err)
  //   return {
  //     statusCode: err.statusCode || 501,
  //     body: JSON.stringify(
  //       {
  //         message: "Error Occured when updating project data!",
  //         details: err,
  //       },
  //       null,
  //       2
  //     ),
  //   }
  // }
}
