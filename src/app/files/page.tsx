import { getCurrentUser } from "@/lib/session";
import ListOfFiles from "./components/hydrated";
import { type FileList } from "@/types/file.type";
import { redirect } from "next/navigation";
import getBaseUrl from "@/lib/baseURL";

async function getData<T>() {
  const user = "jmodell@busseinc.com";

  const url = new URL(`${getBaseUrl()}/api/files/list`);
  url.searchParams.append("prefix", encodeURI(user));

  const res = await fetch(url.href, {
    next: { tags: ["files"], revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch data");

  return res.json() as Promise<T>;
}

export default async function FilesDashboard() {
  const user = await getCurrentUser();

  if (!user) redirect("/api/auth/signin?callbackUrl=/files");

  const filesArray = await getData<string[]>();

  const fileList = filesArray.map((file) => {
    const url = new URL(`${getBaseUrl()}/api/files/download`);
    url.searchParams.append("key", encodeURI(file));

    return { key: file, url: url.href, filename: file.split("/").pop() };
  });

  return (
    <div className="flex flex-col gap-y-2">
      <ListOfFiles data={fileList as unknown as FileList[]} />
    </div>
  );
}
