import { type Ticket } from "@/types/ticket.type";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function getTicketById({ _id }: { _id: string }) {
  const client = await clientPromise;
  const db = client.db(process.env.TICKETS_DATABASE);

  let filter: {
    _id: ObjectId;
  } = { _id: new ObjectId(_id) };

  const ticket = (await db
    .collection("tickets")
    .findOne(filter)) as unknown as Ticket;

  return ticket;
}
