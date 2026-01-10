import { command_logger, CommandPermissions, type Axo, type Command } from "@/utils";
import type { WAMessage } from "baileys";

export default {
  name: "mute",
  description: "",
  examples: (axo: Axo) => [`${axo.prefix}mute ${axo.default_example}`],
  perms: [CommandPermissions.ADMIN, CommandPermissions.MODERATOR],
  aliases: ["silenciar"],
  execute: async ({ axo, m, args }: { axo: Axo; m: WAMessage; args: string[] }) => {
    if (!args[0]) return;

    const user = axo.find({ axo, m, t: args[0] });
    command_logger.info({ module: "groups/mute.ts", user }, "user received");
  },
} satisfies Command;
