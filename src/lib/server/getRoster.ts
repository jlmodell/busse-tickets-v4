import clientPromise from "@/lib/atlasConnection";
import { Document } from "mongodb";

export async function getRoster(
  searchTerm: string | undefined,
  territories: string[] = [],
  gpos: string[] = []
) {
  const client = await clientPromise;
  const db = client.db("busserebatetraces");
  const collection = db.collection("roster");

  const pipeline: Document[] | undefined = [];

  let $match: Document = {
    $and: [],
  };

  if (territories.length > 0) {
    $match = {
      ...$match,
      $and: [
        ...$match.$and,
        { state: { $regex: territories.join("|"), $options: "i" } },
      ],
    };
  }

  if (gpos.length > 0) {
    $match = {
      ...$match,
      $and: [
        ...$match.$and,
        { group_name: { $regex: gpos.join("|"), $options: "i" } },
      ],
    };
  }

  if (searchTerm) {
    $match = {
      ...$match,
      $and: [...$match.$and, { name: { $regex: searchTerm, $options: "i" } }],
    };
  }

  if ($match.$and.length > 0) {
    pipeline.push({
      $match,
    });
  }

  pipeline.push({
    $limit: 10,
  });

  //   pipeline.push({
  //     $lookup: {
  //       from: "tracings",
  //       localField: "member_id",
  //       foreignField: "license",
  //       as: "tracings",
  //     },
  //   });

  //   pipeline.push({
  //     $addFields: {
  //       totalSales: {
  //         $sum: "$tracings.cost",
  //       },
  //       totalRebates: {
  //         $sum: "$tracings.rebate",
  //       },
  //     },
  //   });

  console.log($match.$and);

  const members = await collection.aggregate(pipeline).toArray();

  return members;
}

export async function updateRosterFields() {
  const client = await clientPromise;
  const db = client.db("busserebatetraces");
  const collection = db.collection("roster");

  const pipeline: Document[] | undefined = [];

  //   pipeline.push({
  //     $limit: 1,
  //   });

  pipeline.push({
    $lookup: {
      from: "tracings",
      localField: "member_id",
      foreignField: "license",
      as: "tracings",
    },
  });

  pipeline.push({
    $addFields: {
      totalSales: {
        $sum: "$tracings.cost",
      },
      totalRebates: {
        $sum: "$tracings.rebate",
      },
    },
  });

  console.log("building pipeline");

  const members = await collection.aggregate(pipeline).toArray();

  console.log("updating members");

  for (let i = 0; i < members.length; i++) {
    const member = members[i];

    console.log(i, member.name, member._id);

    await collection.updateOne(
      {
        _id: member._id,
      },
      {
        $set: {
          totalSales: member.totalSales,
          totalRebates: member.totalRebates,
          state_lower: member.state.toLowerCase(),
          group_name_lower: member.group_name.toLowerCase(),
          name_lower: member.name.toLowerCase(),
        },
      }
    );
  }

  console.log("done updating members");

  return members.slice(0, 1);
}
