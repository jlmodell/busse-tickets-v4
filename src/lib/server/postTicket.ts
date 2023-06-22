import { type PostTicket } from "@/types/ticket.type";
import clientPromise from "@/lib/mongodb";

export async function postTicket(ticket: PostTicket) {
  const client = await clientPromise;
  const db = client.db(process.env.TICKETS_DATABASE);

  const _ticket = {
    ...ticket,
    updatedAt: new Date(),
    createdAt: new Date(),
    completed: false,
    respondedTo: false,
    followedUp: false,
    notes: "",
    assignedTo: "",
  };

  const result = await db.collection("tickets").insertOne(_ticket);

  return result.insertedId.toString();
}
