import { type Ticket } from "@/types/ticket.type";
import clientPromise from "@/lib/mongodb";

export async function getTickets({ type }: { type: "it" | "maintenance" }) {
  const client = await clientPromise;
  const db = client.db(process.env.TICKETS_DATABASE);

  const tickets = (await db
    .collection("tickets")
    .find({ type }, { sort: { completed: 1, updatedAt: -1 } })
    .toArray()) as unknown as Ticket[];

  return tickets;
}
