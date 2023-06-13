"use client";
import { Switch } from "@/components/switch";
import { type Ticket } from "@/types/ticket.type";
import { useState } from "react";

export default function SwitchClient({
  ticket,
  label,
  name,
}: {
  ticket: Ticket;
  label: string;
  name: "respondedTo" | "followedUp" | "completed";
}) {
  const [state, setState] = useState(ticket[name] === "true" ? true : false);
  return (
    <>
      <label className="w-1/2 font-semibold text-left underline">{label}</label>
      <Switch
        name={name}
        checked={state}
        onCheckedChange={() => setState((state) => !state)}
      />
    </>
  );
}
