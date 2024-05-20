import InitialModal from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

export default async function SetupPage() {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  //Also check if where: {profileId: profile.id works for the upper query or not}

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
}
