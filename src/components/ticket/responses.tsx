import clsx from "clsx";
import { Response } from "@/types/ticket.type";
import { Input } from "@/components/input";
import { addResponseToTicket } from "@/lib/server/addResponseToTicket";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import MailIcon from "@/components/ticket/mailIcon";

export default async function Responses({
  _id,
  identifier,
  submittedBy,
  responses,
}: {
  _id: string;
  identifier: string;
  submittedBy: string;
  responses: Response[];
}) {
  const sendResponse = async (formData: FormData) => {
    "use server";
    const _id = formData.get("_id") as string;

    const message = formData.get("response") as string;
    const identifier = formData.get("identifier") as string;
    const createdAt = new Date().toISOString();

    await addResponseToTicket({
      _id,
      response: {
        identifier,
        message,
        createdAt,
      },
    });

    revalidatePath(`/tickets/it/${_id}`);
    redirect(`/tickets/it/${_id}`);
  };

  return (
    <form id="response-div" action={sendResponse}>
      <input type="hidden" name="identifier" value={identifier} />
      <input type="hidden" name="_id" value={_id} />
      <div className="w-full flex flex-col space-y-2 divide-y-2 py-4 px-1">
        {responses && responses.length > 0 ? (
          responses.map((response, idx) => (
            <div
              key={idx}
              className={clsx(
                "w-full my-1",
                response.identifier === submittedBy && "text-right"
              )}
            >
              <label className="font-semibold mt-2">
                {response.identifier}
              </label>
              <p className="">{response.message}</p>
            </div>
          ))
        ) : (
          <div className="w-full italic">No messages</div>
        )}
      </div>
      <div className="flex justify-center items-center space-x-2 mt-4 mb-2">
        <Input
          name="response"
          placeholder="Enter a message..."
          required
          className="w-full border border-gray-300 rounded-md pl-3 py-2 text-sm"
        />

        <button
          type="submit"
          className="border border-gray-300 bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300"
        >
          <MailIcon />
        </button>
      </div>
    </form>
  );
}
