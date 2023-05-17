import client from "@/lib/aws";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getPresignedUrl({ key }: { key: string }) {
  const presignedPost = await createPresignedPost(client, {
    Bucket: process.env.AWS_BUCKET as string,
    Key: key,
    Fields: {
      key,
    },
    Expires: 60 * 10, // seconds
    Conditions: [["content-length-range", 0, 1048576 * 50]],
  });

  return presignedPost;
}

export async function getPresignedDownloadUrl({ key }: { key: string }) {
  const presignedGet = await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET as string,
      Key: key,
    }),
    { expiresIn: 3600 }
  );

  return presignedGet;
}
