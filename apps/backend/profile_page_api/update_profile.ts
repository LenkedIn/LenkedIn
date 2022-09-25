// 1.create item with idcommitment
// 2.store attributes to db:
//   a.group_id
//   b.lens handle
// 3.send tx to contract to link idcommitment with lens handle

"use strict"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { DynamoDB } from "aws-sdk"
import { ethers } from "ethers"
import PROJECT_FACTORY_ABI from "../abi/project_factory.json"

interface UserInfo {
  idcommitment: number
  group_id: number
  lens_profile: string
}

// Decode input event to useful user infomation.
// format: "idcommitment=aowiejfa;group_id=123"
// decoded user info should have property: idcommitment and group_id
// example: `serverless invoke local --function update_profile --data "idcommitment=9873;group_id=123;lens_profile=oiajelfja"`
function decode_data(input_data_to_decode: string): UserInfo {
  const userInfoList: string[] = input_data_to_decode.split(";")
  const userInfoMap: Map<string, string> = new Map<string, string>()

  for (const entry of userInfoList) {
    const key: string = entry.split("=")[0]
    const val: string = entry.split("=")[1]
    userInfoMap.set(key, val)
  }

  const userInfo: UserInfo = {
    idcommitment: Number(userInfoMap.get("idcommitment")),
    group_id: Number(userInfoMap.get("group_id")),
    lens_profile: userInfoMap.get("lens_profile"),
  }
  return userInfo
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
  const data = event.toString() // data should have id_commitment and group_id in it.
  console.log(`Data = ${data}`)

  // const userInfo: UserInfo = {
  //   idcommitment: data.id_commitment,
  //   group_id: data.group_id,
  //   lens_profile: data.lens_profile,
  // }

  const userInfo: UserInfo = decode_data(data)
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
  const provider = new ethers.providers.AlchemyProvider(network, process.env.ALCHEMY_API_KEY)

  // init relayer
  const relayer_wallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY)
  console.log(`Relayer address: ${await relayer_wallet.getAddress()}`)
  const relayer = relayer_wallet.connect(provider)

  // init contract
  const address = process.env.CONTRACT_ADDR
  const abi = PROJECT_FACTORY_ABI
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
      idcommitment: userInfo.idcommitment.toString(),
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
