import type { WAMessage } from "baileys";
import type { Axo } from "@/utils";

export const command_handler = async ({ axo, m, text }: { axo: Axo; m: WAMessage; text: string }) => {
  if (!text.startsWith(axo.prefix)) return;

  const [raw, ...args] = text.slice(axo.prefix.length).trim().split(/\s+/);

  if (!raw) return;

  const name = raw.toLowerCase();
  const command = axo.commands.get(name) || [...axo.commands.values()].find((c) => c.aliases?.includes(name));

  if (!command) return;

  await command.execute({ axo, m, args });
};
