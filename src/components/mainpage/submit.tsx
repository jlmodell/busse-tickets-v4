"use client";

import clsx from "clsx";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

const Submit = ({ value }: { value?: string }) => {
  const { pending } = useFormStatus();
  return (
    <button
      className={clsx(
        "col-span-2 mt-5 border border-gray-300 bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300",
        pending ? "cursor-not-allowed bg-gray-200/50" : "cursor-pointer"
      )}
      type="submit"
      disabled={pending}
    >
      {value ? value : "Submit Ticket"}
    </button>
  );
};

export default Submit;
