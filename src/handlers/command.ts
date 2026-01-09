import type { WAMessage } from "baileys";
import { axo } from "..";

export const command = async ({ m, text }: { m: WAMessage, text: string }) => {
  const [command, ...args] = text.split(/ +/g);

  if (!axo.commands.get(command!)) return;


}
