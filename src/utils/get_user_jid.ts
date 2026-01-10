import { jidNormalizedUser } from "baileys";
import type { MessageType } from ".";

export const get_user_jid = ({ axo, m, t }: MessageType): string | undefined => {
  const jid_quoted = m.message?.extendedTextMessage?.contextInfo?.participant;
  const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  const is_group = m.key.remoteJid?.endsWith("@g.us");

  if (jid_quoted) return jidNormalizedUser(jid_quoted);
  if (mentions.length) return jidNormalizedUser(mentions[0]);
  if (!m.key.remoteJid?.endsWith("@g.us")) return jidNormalizedUser(m.key.remoteJid!);

  const phone_match = t.match(/(?:\+?\d{10,15})/);

  if (phone_match) {
    const number = phone_match[0].replace(/\D/g, "");
    return jidNormalizedUser(`${number}@s.whatsapp.net`);
  }

  if (t && is_group) {
    const chat = axo.store.chats.get(m.key.remoteJid!);

    if (chat?.participant) {
      const found = Object.keys(chat.participant).find((p) => p);

      if (found) return jidNormalizedUser(found);
    }
  }

  return undefined;
};
