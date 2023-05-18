import { type Ticket } from "@/types/ticket.type";
import clientPromise from "@/lib/mongodb";

export async function getTickets({
  user,
  role,
  type,
}: {
  user: string;
  role: "admin" | "user";
  type: "it" | "maintenance";
}) {
  const client = await clientPromise;
  const db = client.db(process.env.TICKETS_DATABASE);

  let filter: {
    type: "it" | "maintenance";
    $or?: ({ submittedBy: string } | { contactInfo: string })[];
  } = { type };

  if (role === "user") {
    filter = { ...filter, $or: [{ submittedBy: user }, { contactInfo: user }] };
  }

  const tickets = (await db
    .collection("tickets")
    .find(filter, { sort: { completed: 1, updatedAt: -1 } })
    .toArray()) as unknown as Ticket[];

  return tickets;
}
