import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import Submit from "./components/submit";

import {
  type S3File,
  type S3FileFields,
  type PostTicket,
} from "@/types/ticket.type";

import { postTicket } from "@/lib/server/postTicket";
import { getPresignedUrl } from "@/lib/server/getPresignedUrl";

const departments = [
  "packaging",
  "manufacturing",
  "accounting",
  "order processing",
  "purchasing",
  "shipping",
  "traffic",
  "receiving",
  "quality control",
  "long island sterilization",
];

export default function Index() {
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

    const files: S3File[] = await uploadS3Files(
      formData.get("submittedBy") as string,
      formData.getAll("files") as File[]
    );

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
      <h1 className="col-span-2 font-semibold mb-5 text-3xl">New Ticket...</h1>

      <label className="w-1/2 font-semibold text-left underline">Type</label>
      <select
        name="type"
        className="w-full border border-gray-300 rounded-md pl-3 py-2"
        required
      >
        <option value=""></option>
        <option value="it">IT</option>
        <option value="maintenance">MAINTENANCE</option>
      </select>

      <label className="w-1/2 font-semibold text-left underline">
        Department
      </label>
      <select
        name="department"
        className="w-full border border-gray-300 rounded-md pl-3 py-2"
        required
      >
        <option value=""></option>
        {departments.map((department, idx) => (
          <option key={idx} value={department}>
            {department.toLocaleUpperCase()}
          </option>
        ))}
      </select>

      <label className="w-1/2 font-semibold text-left underline">
        Submitted By
      </label>
      <input
        name="submittedBy"
        required
        className="w-full border border-gray-300 rounded-md pl-3 py-2"
        type="text"
      />

      <label className="w-1/2 font-semibold text-left underline">
        Contact Info
      </label>
      <input
        name="contactInfo"
        required
        className="w-full border border-gray-300 rounded-md pl-3 py-2"
        type="text"
      />

      <label className="w-1/2 font-semibold text-left underline">
        Description
      </label>
      <textarea
        name="description"
        required
        className="w-full border border-gray-300 rounded-md pl-3 py-2"
        rows={5}
      />

      <label className="w-1/2 font-semibold text-left underline">Files</label>
      <input
        name="files"
        className="w-full border border-gray-300 rounded-md pl-3 py-2"
        type="file"
        multiple
      />

      <Submit />
    </form>
  );
}
