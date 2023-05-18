import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import Submit from "@/components/mainpage/submit";
import { Input } from "@/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { Textarea } from "@/components/textarea";

import {
  type S3File,
  type S3FileFields,
  type PostTicket,
} from "@/types/ticket.type";

import { postTicket } from "@/lib/server/postTicket";
import { getPresignedUrl } from "@/lib/server/getPresignedUrl";

import { DEPARTMENTS } from "@/lib/departments";

const NewTicketForm = ({ user }: { user?: string }) => {
  const uploadS3Files = async (submittedBy: string, files: File[]) => {
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
  };

  const sendTicket = async (formData: FormData) => {
    "use server";

    const _files = formData.getAll("files") as File[];

    let files: S3File[] = [];

    if (_files.length > 0 && _files[0].size > 0) {
      files = await uploadS3Files(
        formData.get("submittedBy") as string,
        _files
      );
    }

    const ticket = {
      type: formData.get("type"),
      department: formData.get("department"),
      submittedBy: formData.get("submittedBy"),
      contactInfo: formData.get("contactInfo"),
      description: formData.get("description"),
      files,
    } as PostTicket;

    await postTicket(ticket);

    const type = formData.get("type") as string;

    if (type === "it") {
      revalidatePath("/tickets/it");
      redirect("/tickets/it");
    } else if (type === "maintenance") {
      revalidatePath("/tickets/maintenance");
      redirect("/tickets/maintenance");
    }
  };

  return (
    <form
      action={sendTicket}
      className="relative gap-y-2 grid grid-cols-2 place-items-center w-3/4 p-5 border border-gray-300 bg-slate-50 rounded-md"
    >
      <h1 className="col-span-2 font-semibold tracking-tighter mb-5 text-3xl italic">
        New Ticket...
      </h1>

      <label className="w-1/2 font-semibold text-left underline">Type</label>
      <Select name="type" required>
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
      <Select name="department" required>
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

      <input
        hidden
        defaultValue={user}
        name="submittedBy"
        required
        className="w-full border border-gray-300 rounded-md pl-3 py-2"
        type="text"
      />
      <input
        hidden
        name="contactInfo"
        defaultValue={user}
        required
        className="w-full border border-gray-300 rounded-md pl-3 py-2"
        type="text"
      />

      <label className="w-1/2 font-semibold text-left underline">
        Description
      </label>
      <Textarea
        name="description"
        required
        className="w-full border border-gray-300 rounded-md pl-3 py-2 text-sm"
        rows={10}
      />

      <label className="w-1/2 font-semibold text-left underline">Files</label>
      <Input
        name="files"
        className="w-full border border-gray-300 rounded-md pl-3 py-2"
        type="file"
        multiple
      />

      <Submit />
    </form>
  );
};

export default NewTicketForm;
