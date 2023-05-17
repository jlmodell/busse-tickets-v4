// import { getServerSession } from "next-auth";
import { getTickets } from "@/lib/server/getTickets";
import { NextRequest, NextResponse } from "next/server";
// import { BusseUser, authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  // const session = await getServerSession(authOptions);

  const type = req.nextUrl.searchParams;

  const tickets = await getTickets({
    type: type.get("type") as "it" | "maintenance",
  });

  return NextResponse.json({ count: tickets.length, tickets });
}
