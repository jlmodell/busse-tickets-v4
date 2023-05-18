import { type Response } from "@/types/ticket.type";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function addResponseToTicket({
  _id,
  response,
}: {
  _id: string;
  response: Response;
}) {
  const client = await clientPromise;
  const db = client.db(process.env.TICKETS_DATABASE);

  let filter: {
    _id: ObjectId;
  } = { _id: new ObjectId(_id) };

  await db.collection("tickets").updateOne(filter, {
    $push: {
      responses: {
        ...response,
        createdAt: new Date(response.createdAt),
      },
    },
  });

  return 1;
}
