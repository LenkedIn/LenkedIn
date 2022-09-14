"use strict"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { DynamoDB } from "aws-sdk"
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof } from "@semaphore-protocol/proof"
import { ethers } from "ethers"

// dynamoDB example code:
// https://github.com/serverless/examples/tree/v3/aws-node-http-api-typescript-dynamodb
// --------
// import { DynamoDB } from "aws-sdk"
// const dynamoDb = new DynamoDB.DocumentClient()
// const params = {
//   TableName: process.env.DYNAMODB_TABLE,
// }

// .env variables usage
// directly call process.env.{variable_name}

export const add_member = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v3.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  }
}
