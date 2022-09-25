"use strict"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { DynamoDB } from "aws-sdk"
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof } from "@semaphore-protocol/proof"
import { ethers } from "ethers"
import {v4 as uuidv4} from 'uuid';
import PROJECT_FACTORY_ABI from "../abi/project_factory.json"



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
  const provider = new ethers.providers.AlchemyProvider(
    process.env.BLOCK_CHAIN_NETWORK,
    process.env.ALCHEMY_API_KEY,
  );

  // init relayer 
  const relayer_wallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY);
  console.log(`Relayer address: ${await relayer_wallet.getAddress()}`);
  const relayer = relayer_wallet.connect(provider);

  // init contract
  const address = process.env.CONTRACT_ADDR;
  const lenkedin_SC = new ethers.Contract(address, PROJECT_FACTORY_ABI, relayer);

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
  console.log("gourp_id created:",group_id);

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
