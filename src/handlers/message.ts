import { jidNormalizedUser, type WAMessage } from "baileys";
import { handlers_logger } from ".";
import { axo, skt } from "..";
import { command } from "./command";

export const message = async ({ m }: { m: WAMessage }): Promise<void> => {
  const chat_jid = m.key.remoteJid!;
  const is_group = chat_jid.endsWith("@g.us");
  const text =
    m.message?.conversation ??
    m.message?.extendedTextMessage?.text ??
    "";

  const sender_jid = jidNormalizedUser(m.key.participant ?? chat_jid ?? m.key.remoteJidAlt);
  const sender_name = m.pushName || sender_jid.split("@")[0];

  const group_name = is_group
    ? (await skt.groupMetadata(chat_jid)).subject
    : "DMs";

  if (text.startsWith(axo.prefix)) {
    const text_without_prefix = text.slice(axo.prefix.length);
    return await command({ m, text: text_without_prefix });
  }

  handlers_logger.info({ text, sender: `${sender_name} (${sender_jid})`, group: `${is_group} | ${group_name}` }, "message received");
};

