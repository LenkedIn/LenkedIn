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
    value !== null && 
      typeof value.admin_address === "string" && 
      typeof value.project_name === "string" &&
      typeof value.project_image_link === "string" &&
      typeof value.project_description === "string" &&
      typeof value.project_github_repo === "string"
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
  const data = event.body;

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
  const abi = [];
  const lenkedin_SC = new ethers.Contract(address, abi, relayer);

  // create project(group) on SC
  try {
    const group_id = (await lenkedin_SC.getMaxGroupID()).toNumber() + 1;
    const create_group_tx = await lenkedin_SC.createProject(
      group_id, 
      data.project_name, 
      data.project_github_repo,
      data.project_image_link,
      data.project_description
    );
    await create_group_tx.wait();
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

  // save project data to DB
  // init db and update expression
  const timestamp = new Date().getTime();
  const dynamoDb = new DynamoDB.DocumentClient();
  const params = {
    TableName: process.env.PROJECT_DYNAMODB_TABLE_NAME,
    Item: {
      group_id: data.group_id,
      project_name: data.project_name,
      invitation_code: uuidv4(),
      updated_at: timestamp,
    },
  }
  console.log(`project update expression:${params}`);

  // update function
  try {
    const response = await dynamoDb.put(params).promise()
    console.log(response)

    // return update successfully message
    return {
      statusCode: 200,
      body: JSON.stringify({
          message: "Project Update Successfully!",
      })
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: err.statusCode || 501,
      body: JSON.stringify(
        {
          message: "Error Occured when updating project data!",
          details: err,
        },
        null,
        2
      ),
    }
  }
}
