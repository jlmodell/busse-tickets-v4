import { getCurrentUser } from "@/lib/session";
import ListOfFiles from "@/components/files/hydrated";
import { type FileList } from "@/types/file.type";
import { redirect } from "next/navigation";
// import getBaseUrl from "@/lib/baseURL";
import { Suspense } from "react";
import { getKeysFromBucket } from "@/lib/server/getKeysFromBucket";

export const revalidate = 30;

const getData = async (email: string) => {
  return getKeysFromBucket({ prefix: email });
};

export default async function FilesDashboard() {
  const user = await getCurrentUser();

  if (!user) redirect("/api/auth/signin?callbackUrl=/files");

  const filesArray = (await getData(user?.email)) as {
    key: string;
    date: string;
  }[];

  const fileList = filesArray
    .map(({ key, date }) => {
      const _key = key;
      const url = `/api/files/download?key=${_key}`;
      const splitFile = _key.split("/");
      const filename = splitFile.pop();
      const id = splitFile.pop();

      if (!filename) return;

      return {
        key,
        url,
        filename,
        id,
        date,
      };
    })
    .filter((file) => file !== undefined);

  return (
    <div className="flex place-items-center max-w-100vw overflow-x-scroll">
      <Suspense fallback={<div>Loading...</div>}>
        <ListOfFiles data={fileList as unknown as FileList[]} />
      </Suspense>
    </div>
  );
}
