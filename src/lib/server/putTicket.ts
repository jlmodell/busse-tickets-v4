import { S3File, type PutTicket } from "@/types/ticket.type";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function putTicket(
  _id: string,
  ticket: PutTicket,
  files?: S3File[]
) {
  const client = await clientPromise;
  const db = client.db(process.env.TICKETS_DATABASE);

  try {
    if (files) {
      await db.collection("tickets").updateOne(
        {
          _id: new ObjectId(_id),
        },
        {
          $push: {
            files: {
              $each: files,
            },
          },
        }
      );
    }
  } catch (err) {
    throw err;
  }

  try {
    await db.collection("tickets").updateOne(
      {
        _id: new ObjectId(_id),
      },
      {
        $set: {
          ...ticket,
          updatedAt: new Date(),
        },
      }
    );
  } catch (err) {
    throw err;
  }

  return 1;
}
