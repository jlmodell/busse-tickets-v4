import { type Ticket } from "@/types/ticket.type";
import TableRenderer from "@/components/tickets/hydrated";
// import getBaseUrl from "@/lib/baseURL";
import { Suspense } from "react";
import { getTickets } from "@/lib/server/getTickets";

export const revalidate = 30;

const getData = async (type: "it" | "maintenance") => {
  // const url = new URL(`${getBaseUrl()}/api/tickets`);
  // url.searchParams.append("type", "it");

  // const res = await fetch("/api/tickets?type=it", {
  //   next: { tags: ["it-tickets"], revalidate: 30 },
  // });

  // if (!res.ok) throw new Error("Failed to fetch data");

  // return res.json();
  return getTickets({
    type,
  });
};

const TicketsITDashboard = async () => {
  const tickets = (await getData("it")) as Ticket[];

  return (
    <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
      <Suspense fallback={<div>Loading...</div>}>
        <TableRenderer data={tickets} />
      </Suspense>
    </div>
  );
};

export default TicketsITDashboard;
