import { PutTicket, S3File, S3FileFields, Ticket } from "@/types/ticket.type";
import { DEPARTMENTS } from "@/lib/departments";
import Submit from "@/components/mainpage/submit";
import { Input } from "@/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import SwitchClient from "./switchComponents";
import { Textarea } from "@/components/textarea";
import { User } from "@/types/user.type";
import Responses from "@/components/ticket/responses";
import Link from "next/link";
import DownloadIcon from "../files/download";
import { nanoid } from "nanoid";
import { getPresignedUrl } from "@/lib/server/getPresignedUrl";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { putTicket } from "@/lib/server/putTicket";
import { itAdmins, maintenanceAdmins } from "@/lib/constants/admins";

export const TicketDetails = ({
  user,
  ticket,
}: {
  user: User;
  ticket: Ticket;
}) => {
  const isAdmin =
    user.role === "admin"
      ? true
      : user.role === "maintenance-admin" && ticket.type === "maintenance"
      ? true
      : false;

  async function uploadS3Files(submittedBy: string, files: File[]) {
    "use server";

    const s3Files: S3File[] = [];

    for (const file of files) {
      const key = `${submittedBy}/${nanoid()}/${file.name}`;

      const { url, fields } = (await getPresignedUrl({
        key,
      })) as { url: string; fields: S3FileFields };

      const uploadFormData = new FormData();

      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        uploadFormData.append(key, value as string | Blob);
      });

      await fetch(url, {
        method: "POST",
        body: uploadFormData,
      });

      s3Files.push({
        url,
        fields,
        filename: file.name,
        filetype: file.type,
      });
    }
    return s3Files;
  }

  async function sendTicket(formData: FormData) {
    "use server";

    const type = formData.get("type") as string;
    const _id = formData.get("_id") as string;

    const ticket = {
      type,
      department: formData.get("department") as string,
      submittedBy: formData.get("submittedBy") as string,
      contactInfo: formData.get("contactInfo") as string,
      description: formData.get("description") as string,
      completed: formData.get("completed") === "on",
      respondedTo: formData.get("respondedTo") === "on",
      followedUp: formData.get("followedUp") === "on",
    } as PutTicket;

    const _files = formData.getAll("files") as File[];

    let files: S3File[] = [];

    if (_files.length > 0 && _files[0].size > 0) {
      files = await uploadS3Files(
        formData.get("submittedBy") as string,
        _files
      );
    }

    if (isAdmin) {
      ticket.notes = (formData.get("notes") as string) || "";
      ticket.assignedTo = (formData.get("assignedTo") as string) || "";
    }

    await putTicket(_id, ticket, files);

    if (type === "it") {
      revalidatePath(`/tickets/it/${_id}`);
      redirect(`/tickets/it/${_id}`);
    } else if (type === "maintenance") {
      revalidatePath(`/tickets/maintenance/${_id}`);
      redirect(`/tickets/maintenance/${_id}`);
    }
  }

  return (
    <div className="flex flex-col space-y-3">
      {/* @ts-expect-error Async Server Component */}
      <Responses
        _id={ticket._id}
        identifier={user.email}
        submittedBy={ticket.submittedBy}
        responses={ticket.responses || []}
      />

      <div className="flex justify-around items-center">
        <Link href="/tickets/it" className="text-blue-500 hover:underline">
          Back to Tickets
        </Link>
      </div>

      <form
        action={sendTicket}
        className="relative gap-y-2 grid grid-cols-2 place-items-center min-w-3/4 p-5 border border-gray-300 bg-slate-50 rounded-md overflow-auto"
      >
        <h1 className="col-span-2 font-semibold tracking-tighter mb-5 text-3xl italic">
          {ticket._id}
        </h1>
        <input type="hidden" name="_id" value={ticket._id} />
        <label className="w-1/2 font-semibold text-left underline">Type</label>
        <Select name="type" required defaultValue={ticket.type}>
          <SelectTrigger className="w-full border border-gray-300 rounded-md pl-3 py-2">
            <SelectValue placeholder="Select a ticket type..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="it">IT</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <label className="w-1/2 font-semibold text-left underline">
          Department
        </label>
        <Select
          name="department"
          required
          defaultValue={ticket?.department || "general"}
        >
          <SelectTrigger className="w-full border border-gray-300 rounded-md pl-3 py-2 capitalize">
            <SelectValue placeholder="Select a department..." />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENTS.map((department, idx) => (
              <SelectItem key={idx} value={department} className="capitalize">
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="w-1/2 font-semibold text-left underline">
          Submitted By
        </label>
        <Input
          defaultValue={ticket.submittedBy}
          name="submittedBy"
          required
          className="w-full border border-gray-300 rounded-md pl-3 py-2"
          type="text"
        />
        <label className="w-1/2 font-semibold text-left underline">
          Contact Info
        </label>
        <Input
          name="contactInfo"
          defaultValue={ticket.contactInfo}
          required
          className="w-full border border-gray-300 rounded-md pl-3 py-2"
          type="text"
        />
        <label className="w-1/2 font-semibold text-left underline">
          Description
        </label>
        <Textarea
          name="description"
          defaultValue={ticket.description}
          required
          className="w-full border border-gray-300 rounded-md pl-3 py-2 text-sm"
          rows={10}
        />
        <label className="w-1/2 font-semibold text-left underline">Files</label>
        <div className="flex flex-col space-x-3 w-full">
          <Input
            name="files"
            className="w-full border border-gray-300 rounded-md pl-3 py-2"
            type="file"
            multiple
          />
          <ul className="w-full flex flex-col space-y-1 mt-2">
            {ticket?.files && ticket?.files.length > 0
              ? ticket.files.map((file, idx) => (
                  <li className="flex items-center" key={idx}>
                    <div className="mr-2">{file.filename} </div>
                    <a href={`/api/files/download?key=${file.fields.key}`}>
                      <DownloadIcon />
                    </a>
                  </li>
                ))
              : "No files attached"}
          </ul>
        </div>
        {isAdmin && (
          <>
            <label className="w-1/2 font-semibold text-left underline">
              Notes
            </label>
            <Textarea
              name="notes"
              defaultValue={ticket.notes}
              className="w-full border border-gray-300 rounded-md pl-3 py-2 text-sm"
              rows={5}
            />
            <label className="w-1/2 font-semibold text-left underline">
              Assignment
            </label>
            <Select name="assignedTo" defaultValue={ticket.assignedTo || ""}>
              <SelectTrigger className="w-full border border-gray-300 rounded-md pl-3 py-2">
                <SelectValue placeholder="Choose a person to assign the ticket to..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=""> </SelectItem>
                {ticket.type === "it" &&
                  itAdmins.map((admin, idx) => (
                    <SelectItem key={`it-${idx}`} value={admin.email}>
                      {admin.name}
                    </SelectItem>
                  ))}
                {ticket.type === "maintenance" &&
                  maintenanceAdmins.map((admin, idx) => (
                    <SelectItem key={`maintenance-${idx}`} value={admin.email}>
                      {admin.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <SwitchClient
              name="respondedTo"
              ticket={ticket}
              label={"Responded To"}
            />
            <SwitchClient
              name="followedUp"
              ticket={ticket}
              label={"Followed Up"}
            />
            <SwitchClient
              name="completed"
              ticket={ticket}
              label={"Completed"}
            />
          </>
        )}
        <Submit value="Update Ticket" />
      </form>
    </div>
  );
};

export default TicketDetails;
