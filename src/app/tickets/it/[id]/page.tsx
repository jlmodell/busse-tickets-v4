export default function ITTicketDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return `i am a ticket, here is my id ${params.id}`;
}
