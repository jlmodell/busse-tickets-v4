import { getCurrentUser } from "@/lib/session";
import ListOfFiles from "@/components/files/hydrated";
import { type FileList } from "@/types/file.type";
import { redirect } from "next/navigation";
// import getBaseUrl from "@/lib/baseURL";
import { Suspense } from "react";
import { getKeysFromBucket } from "@/lib/server/getKeysFromBucket";

export const revalidate = 30;

const getData = async () => {
  const user = "jmodell@busseinc.com";

  // const url = new URL(`${getBaseUrl()}/api/files/list`);
  // url.searchParams.append("prefix", encodeURI(user));

  return getKeysFromBucket({ prefix: user });

  // const res = await fetch(`/api/files/list?prefix=${user}`, {
  //   next: { tags: ["files"], revalidate: 60 },
  // });

  // return res.json() as Promise<T>;
};

export default async function FilesDashboard() {
  const user = await getCurrentUser();

  if (!user) redirect("/api/auth/signin?callbackUrl=/files");

  const filesArray = (await getData()) as string[];

  const fileList = filesArray.map((file) => {
    return {
      key: file,
      url: `/api/files/download?key=${file}`,
      filename: file.split("/").pop(),
    };
  });

  return (
    <div className="flex flex-col gap-y-2">
      <Suspense fallback={<div>Loading...</div>}>
        <ListOfFiles data={fileList as unknown as FileList[]} />
      </Suspense>
    </div>
  );
}
