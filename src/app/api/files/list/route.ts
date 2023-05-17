// import { getServerSession } from "next-auth";
import { getKeysFromBucket } from "@/lib/server/getKeysFromBucket";
import { NextRequest, NextResponse } from "next/server";
// import { BusseUser, authOptions } from "../../auth/[...nextauth]/route";
import { type FileList } from "@/types/file.type";

export async function GET(req: NextRequest) {
  // const session = await getServerSession(authOptions);

  const params = req.nextUrl.searchParams;

  const prefix = params.get("prefix") as string;

  if (prefix) {
    const s3Keys = await getKeysFromBucket({ prefix });

    return NextResponse.json(s3Keys);
  }

  return NextResponse.json({ keys: [] });
}
