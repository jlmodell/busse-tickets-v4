import { type Ticket, ticketSchema } from "@/types/ticket.type";
import TableRenderer from "@/components/tickets/hydrated";
import { Suspense } from "react";
import { getTickets } from "@/lib/server/getTickets";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { User } from "@/types/user.type";

export const revalidate = 30;

const getData = async (user: User, type: "it" | "maintenance") => {
  return getTickets({
    user: user?.email,
    role: user?.role ?? "user",
    type,
  });
};

const TicketsITDashboard = async () => {
  const user = await getCurrentUser();

  console.log(user);

  if (!user) redirect("/api/auth/signin?callbackUrl=/tickets/it");

  const data = (await getData(user, "it")) as Ticket[];
  const parsedData = z.array(ticketSchema).parse(data);

  return (
    <div className="flex place-items-center max-w-100vw overflow-x-scroll">
      <Suspense fallback={<div>Loading...</div>}>
        <TableRenderer data={parsedData} />
      </Suspense>
    </div>
  );
};

export default TicketsITDashboard;
