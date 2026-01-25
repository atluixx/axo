import { jidNormalizedUser } from "baileys";
import type { MessageHandlerType } from "@/handlers";
import { axo } from "..";

export const mute_job = async ({ messages }: MessageHandlerType) => {
  const now = BigInt(Date.now());

  const expired = await axo.prisma.mutedUser.findMany({
    where: {
      muted_until: { lt: now },
    },
  });

  if (expired.length > 0) {
    await axo.prisma.mutedUser.deleteMany({
      where: {
        muted_until: { lt: now },
      },
    });
  }

  const mutedUsers = await axo.prisma.mutedUser.findMany({
    where: {
      muted_until: { gte: now },
    },
  });

  for (const message of messages) {
    const participant = jidNormalizedUser(message.key.participant || undefined);
    const jid = message.key.remoteJid;
    if (!participant || !jid) continue;

    const isMuted = mutedUsers.some(
      (u) => jidNormalizedUser(u.jid) === participant,
    );
    if (!isMuted) continue;

    await axo.socket.sendMessage(jid, {
      delete: message.key,
    });
  }
};
