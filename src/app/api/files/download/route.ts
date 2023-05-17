// import { getServerSession } from "next-auth";
import { getPresignedDownloadUrl } from "@/lib/server/getPresignedUrl";
import { NextRequest, NextResponse } from "next/server";
// import { BusseUser, authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  // const session = await getServerSession(authOptions);

  const params = req.nextUrl.searchParams;

  const key = params.get("key") as string;

  if (key) {
    const url = await getPresignedDownloadUrl({ key: decodeURI(key) });
    return NextResponse.redirect(url);
  }
}
