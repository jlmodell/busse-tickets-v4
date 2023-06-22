import { getRoster, updateRosterFields } from "@/lib/server/getRoster";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let territories: string[] = [];
  let gpos: string[] = [];
  let searchTerm: string | undefined = undefined;

  const params = req.nextUrl.searchParams;

  const search = params.get("search") as string;
  const terr = params.get("terr") as string;
  const gpo = params.get("gpo") as string;

  if (terr) {
    territories = terr.split(",");
  }

  if (gpo) {
    gpos = gpo.split(",");
  }

  if (search) {
    searchTerm = search;
  }

  console.log({
    searchTerm,
    territories,
    gpos,
  });

  // const members = await getRoster(
  //   (searchTerm = searchTerm),
  //   (territories = territories),
  //   (gpos = gpos)
  // );

  const members = await updateRosterFields();

  return NextResponse.json(members);
}
