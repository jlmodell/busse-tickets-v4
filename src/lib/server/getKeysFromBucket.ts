import { ListObjectsCommand } from "@aws-sdk/client-s3";
import client from "../aws";

export async function getKeysFromBucket({ prefix }: { prefix: string }) {
  const { Contents } = await client.send(
    new ListObjectsCommand({
      Bucket: process.env.AWS_BUCKET as string,
      Prefix: prefix,
    })
  );

  if (!Contents) return [];

  return Contents.map((content) => content.Key as string);
}
