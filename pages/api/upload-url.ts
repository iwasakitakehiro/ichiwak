import { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const s3 = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
      region: process.env.REGION,
    });
    const post = await s3.createPresignedPost({
      Bucket: process.env.S3_BUCKET_NAME || "",
      Fields: {
        key: req.query.file,
      },
      Expires: 30, // seconds
      Conditions: [
        ["content-length-range", 0, 1048576], // up to 1 MB
      ],
    });
    res.status(200).json(post);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
