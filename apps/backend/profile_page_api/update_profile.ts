"use strict"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { DynamoDB } from "aws-sdk"
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof } from "@semaphore-protocol/proof"
import { ethers } from "ethers"

export const update_profile = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event)
  const data = event.body
  const timestamp = new Date().getTime()

  // input profile data validation
  function is_valid(value: any): boolean {
    return (
      value !== null && typeof value.idcommitment === "string" && typeof value.group_id === "number"
    )
  }

  if (!is_valid(data)) {
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
      idcommitment: data.idcommitment,
      group_id: data.group_id,
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
