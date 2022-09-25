// 1.create item with idcommitment
// 2.store attributes to db:
//   a.group_id
//   b.lens handle
// 3.send tx to contract to link idcommitment with lens handle

"use strict"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
// import { Context, APIGatewayEvent } from "aws-lambda"
import { DynamoDB } from "aws-sdk"
// import { resolve } from "path"
// import { Identity } from "@semaphore-protocol/identity"
// import { Group } from "@semaphore-protocol/group"
// import { generateProof } from "@semaphore-protocol/proof"
import { ethers } from "ethers"
// import { config as dotenvConfig } from "dotenv"
// import ProjectFactory from "../../contracts/build/contracts/contracts/ProjectFactory.sol/ProjectFactory.json"
// dotenvConfig({ path: resolve(__dirname, "../../../.env") })

interface UserInfo {
  idcommitment: number
  group_id: number
  lens_profile: string
}

// Decode input event to useful user infomation.
// format: "idcommitment=aowiejfa;group_id=123"
// decoded user info should have property: idcommitment and group_id
// example: `serverless invoke local --function update_profile --data "idcommitment=aowiejfa;group_id=123"`
function decode_data(input_data_to_decode: string): UserInfo {
  const userInfoList: string[] = input_data_to_decode.split(';')
  let userInfoMap: Map<string, string> = new Map<string, string>();

  for (let entry of userInfoList) {
    const key: string = entry.split('=')[0]
    const val: string = entry.split('=')[1]
    userInfoMap.set(key, val)
  }

  const userInfo: UserInfo = {
    idcommitment: Number(userInfoMap.get('idcommitment')),
    group_id: Number(userInfoMap.get('group_id')),
    lens_profile: userInfoMap.get('lens_profile')
  }
  return userInfo;
}


// input profile data validation
function user_info_is_valid(value: UserInfo): boolean {
  return (
    value !== null &&
    typeof value.idcommitment === "number" &&
    typeof value.group_id === "number" &&
    typeof value.lens_profile === "string"
  )
}

export const update_profile = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(`Event = ${event}`)

  const timestamp = new Date().getTime()
  const data = event.toString(); // data should have id_commitment and group_id in it.
  console.log(`Data = ${data}`)

  // const userInfo: UserInfo = {
  //   idcommitment: data.id_commitment,
  //   group_id: data.group_id,
  //   lens_profile: data.lens_profile,
  // }

  let userInfo: UserInfo = decode_data(data)
  console.log(`userInfo.get('idcommitment') = ${userInfo.idcommitment}`)
  console.log(`userInfo.get('group_id') = ${userInfo.group_id}`)
  console.log(`userInfo.get('lens_profile') = ${userInfo.lens_profile}`)
  if (!user_info_is_valid(userInfo)) {
    console.error("Validation Failed")
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: "Validation Failed!",
          input: event,
        },
        null,
        2
      ),
    }
  }

  // init blockchain network provider
  const network = process.env.BLOCK_CHAIN_NETWORK
  // const provider = ethers.getDefaultProvider(network, {
  //   alchemy: process.env.ALCHEMY_API_KEY,
  // })
  const provider = new ethers.providers.AlchemyProvider(network, process.env.ALCHEMY_API_KEY)

  // init relayer
  const relayer_wallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY)
  console.log(`Relayer address: ${await relayer_wallet.getAddress()}`)
  const relayer = relayer_wallet.connect(provider)

  // init contract
  const address = process.env.CONTRACT_ADDR
  const abi = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "InvalidTime",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidTreeDepth",
      type: "error",
    },
    {
      inputs: [],
      name: "Semaphore__GroupAlreadyExists",
      type: "error",
    },
    {
      inputs: [],
      name: "Semaphore__GroupDoesNotExist",
      type: "error",
    },
    {
      inputs: [],
      name: "Semaphore__GroupIdIsNotLessThanSnarkScalarField",
      type: "error",
    },
    {
      inputs: [],
      name: "Semaphore__YouAreUsingTheSameNillifierTwice",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "groupId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "merkleTreeDepth",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "zeroValue",
          type: "uint256",
        },
      ],
      name: "GroupCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "groupId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "identityCommitment",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "merkleTreeRoot",
          type: "uint256",
        },
      ],
      name: "MemberAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "groupId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "identityCommitment",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "merkleTreeRoot",
          type: "uint256",
        },
      ],
      name: "MemberRemoved",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "groupId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "identityCommitment",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newIdentityCommitment",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "merkleTreeRoot",
          type: "uint256",
        },
      ],
      name: "MemberUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "nullifierHash",
          type: "uint256",
        },
      ],
      name: "NullifierHashAdded",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "groupId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "identityCommitment",
          type: "uint256",
        },
      ],
      name: "addMember",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "claimReviews",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint8",
          name: "depth",
          type: "uint8",
        },
        {
          internalType: "uint256",
          name: "zeroValue",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "identityCommitment",
          type: "uint256",
        },
      ],
      name: "createProject",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "groupId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "projectName",
          type: "string",
        },
        {
          internalType: "string",
          name: "githubRepository",
          type: "string",
        },
        {
          internalType: "string",
          name: "projectImageLink",
          type: "string",
        },
        {
          internalType: "string",
          name: "projectDescription",
          type: "string",
        },
      ],
      name: "editProjectInfo",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "groupId",
          type: "uint256",
        },
      ],
      name: "endProject",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "idCommitment",
          type: "uint256",
        },
      ],
      name: "getLeafByIDCommitment",
      outputs: [
        {
          internalType: "uint256[]",
          name: "projectList",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "idCommitment",
          type: "uint256",
        },
      ],
      name: "getLensConnect",
      outputs: [
        {
          internalType: "string",
          name: "_lensProfile",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "groupId",
          type: "uint256",
        },
      ],
      name: "getMerkleTreeDepth",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "groupId",
          type: "uint256",
        },
      ],
      name: "getMerkleTreeRoot",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "groupId",
          type: "uint256",
        },
      ],
      name: "getNumberOfMerkleTreeLeaves",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "idCommitment",
          type: "uint256",
        },
      ],
      name: "getOngoingProjectsByIDCommitment",
      outputs: [
        {
          internalType: "uint256[]",
          name: "projectList",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getProjectCount",
      outputs: [
        {
          internalType: "uint256",
          name: "projectCount",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "groupId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "identityCommitment",
          type: "uint256",
        },
        {
          internalType: "uint256[]",
          name: "proofSiblings",
          type: "uint256[]",
        },
        {
          internalType: "uint8[]",
          name: "proofPathIndices",
          type: "uint8[]",
        },
      ],
      name: "removeMember",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "idCommitment",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "lensProfile",
          type: "string",
        },
      ],
      name: "setLensConnect",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "groupId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "toIdCommitment",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "nullifierHash",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "reviewContent",
          type: "string",
        },
        {
          internalType: "uint256[8]",
          name: "proof",
          type: "uint256[8]",
        },
      ],
      name: "submitReviews",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ]
  const lenkedin_SC = new ethers.Contract(address, abi, relayer)

  // Connects idcommitment with lens profile on SC
  try {
    const set_lens_connect_tx = await lenkedin_SC.setLensConnect(
      userInfo.idcommitment,
      userInfo.lens_profile
    )
    await set_lens_connect_tx.wait()

    console.log(`set lens profile transaction result: ${set_lens_connect_tx}`)
  } catch (err) {
    console.error(err)
    return {
      statusCode: err.statusCode || 501,
      body: JSON.stringify({
        message: "Error Occured when sending tx to smart contract!",
        details: err,
      }),
    }
  }

  // store profile data to profile table
  // init db and update expression
  const dynamoDb = new DynamoDB.DocumentClient()
  const params = {
    TableName: process.env.PROFILE_DYNAMODB_TABLE_NAME,
    Item: {
      idcommitment: (userInfo.idcommitment).toString(),
      group_id: userInfo.group_id,
      updated_at: timestamp,
    },
  }
  console.log(params)

  // write user info to DynamoDB
  try {
    const response = await dynamoDb.put(params).promise()

    console.log(`Write user info to DynamoDB result: ${response}`)
  } catch (err) {
    console.error(err)
    return {
      statusCode: err.statusCode || 501,
      body: JSON.stringify(
        {
          message: "Error Occured when writing profile data to DynamoDB!",
          details: err,
        },
        null,
        2
      ),
    }
  }

  // return update successfully message
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Update Profile Success!",
      },
      null,
      2
    ),
  }
}
