import { create } from "ipfs-http-client"
import { v4 as uuid } from "uuid"
import { Buffer } from "buffer"
import { IPFS_INFURA_ID, IPFS_INFURA_SECRET } from "../constant"

const auth = "Basic " + Buffer.from(`${IPFS_INFURA_ID}:${IPFS_INFURA_SECRET}`).toString("base64")

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
})

export const formDataToMeta = (prevProfile: any, formData: any) => {
  console.log(formData)
  const metaData = {
    ...prevProfile,
    name: formData.name,
    bio: formData.introduction,
    // get original profile attributes
    version: "1.0.0",
    metadata_id: uuid(),
    createOn: new Date().toISOString(),
    appId: "LenkedIn",
  }
  console.log(metaData)
  return metaData
}

export const uploadProfileToIpfs = async (metaData: any) => {
  const added = await client.add(JSON.stringify(metaData))
  const URI = `https://ipfs.infura.io/ipfs/${added.path}`
  return URI
}
