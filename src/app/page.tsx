import NewTicketForm from "@/components/mainpage/newTicket";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Index() {
  const user = await getCurrentUser();

  if (!user) redirect("/api/auth/signin");

  return <NewTicketForm user={user?.email} />;
}
