import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { CreateServerSchema } from "@/lib/validators/server";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrl, name } = CreateServerSchema.parse(body);

    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const newServer = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: "general",
              profileId: profile.id,
            },
          ],
        },

        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(newServer);
  } catch (error) {
    console.log("SERVER POST, ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
