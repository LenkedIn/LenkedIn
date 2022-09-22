// 1.create item with idcommitment
// 2.store attributes to db:
//   a.group_id
//   b.lens handle
// 3.send tx to contract to link idcommitment with lens handle

"use strict"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Context, APIGatewayEvent } from 'aws-lambda';
import { DynamoDB } from "aws-sdk"
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof } from "@semaphore-protocol/proof"
import { ethers } from "ethers"


interface UserInfo {
  idcommitment: string;
  group_id: number;
}
 

export const update_profile = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(`Event = ${event}`)

  const timestamp = new Date().getTime()
  const input_data = event.toString(); // data should have id_commitment and group_id in it.
  // const data = JSON.parse(event.toString());
  // console.log(`Data = ${data}`)

  // input profile data validation
  function user_info_is_valid(value: any): boolean {
    return (
      value !== null && typeof value.idcommitment === "string" && typeof value.group_id === "number"
    )
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
      idcommitment: userInfoMap.get('idcommitment'),
      group_id: Number(userInfoMap.get('group_id'))
    }
    return userInfo;
  }

  let userInfo: UserInfo = decode_data(input_data)
  console.log(`userInfo.get('idcommitment') = ${userInfo.idcommitment}`)
  console.log(`userInfo.get('group_id') = ${userInfo.group_id}`)
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

  // store profile data to profile table
  // init db and update expression
  const dynamoDb = new DynamoDB.DocumentClient()
  const params = {
    TableName: process.env.PROFILE_DYNAMODB_TABLE_NAME,
    Item: {
      idcommitment: userInfo.idcommitment,
      group_id: userInfo.group_id,
      updated_at: timestamp,
    },
  }
  console.log(params)

  // update function
  try {
    const response = await dynamoDb.put(params).promise()
    console.log(response)

    // return update successfully message
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Update Successfully!",
        },
        null,
        2
      ),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: err.statusCode || 501,
      body: JSON.stringify(
        {
          message: "Error Occured when updating profile data!",
          details: err,
        },
        null,
        2
      ),
    }
  }
}
