import { getTicketById } from "@/lib/server/getTicketById";
import { ticketSchema } from "@/types/ticket.type";
import TicketDetails from "@/components/ticket/hydrated";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

const getData = async (_id: string) => {
  return getTicketById({ _id });
};

export default async function ITTicketDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  let user = await getCurrentUser();

  // console.log(user);

  if (!user) {
    redirect("/api/auth/signin");
  }

  const data = await getData(params.id);
  const parsedData = ticketSchema.parse(data);
  const type = "it";

  return <TicketDetails user={user} ticket={parsedData} type={type} />;
}
