"use client";
import { Switch } from "@/components/switch";
import { useState } from "react";

export default function SendEmailSwitchClient({
  label,
  name,
}: {
  label: string;
  name: "sendEmail";
}) {
  const [state, setState] = useState(false);
  return (
    <>
      <label className="mt-4 w-full col-span-2 font-semibold text-left underline text-red-500 text-sm">
        {label}
      </label>
      <Switch
        name={name}
        className="mt-4 col-span-3"
        checked={state}
        onCheckedChange={() => setState((state) => !state)}
      />
    </>
  );
}
