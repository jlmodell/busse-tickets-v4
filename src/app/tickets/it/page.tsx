import { type Ticket } from "@/types/ticket.type";
import TableRenderer from "../components/table/hydrated";

async function getData() {
  const url = new URL("/api/tickets");
  url.searchParams.append("type", "it");

  const res = await fetch(url.href, {
    next: { tags: ["it-tickets"], revalidate: 30 },
  });

  if (!res.ok) throw new Error("Failed to fetch data");

  return res.json();
}

export default async function TicketsITDashboard() {
  const { tickets } = (await getData()) as { count: number; tickets: Ticket[] };

  return (
    <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
      <TableRenderer data={tickets} />
    </div>
  );
}
