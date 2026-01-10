import type { MutedUser } from "@/utils";
import { axo } from "..";
import type { MessageHandlerType } from "@/handlers";
import { jidNormalizedUser } from "baileys";

export const mute_job = async ({ messages, type }: MessageHandlerType) => {
  const muted_users = axo.db.query(`SELECT * FROM muted_users`).all() as MutedUser[];

  for (const message of messages) {
    const participant = jidNormalizedUser(message.key.participant || undefined);
    const jid = message.key.remoteJid!;
    if (!participant) continue;

    const user_muted = muted_users.some((u) => jidNormalizedUser(u.user) === participant);
    if (!user_muted) continue;

    await axo.socket.sendMessage(jid, {
      delete: message.key,
    });
  }
};
