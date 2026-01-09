import { axo } from "@/index";
import { CommandPermissions, type Command } from "@/utils/axo";

export default {
  name: "mute",
  description: "",
  examples: [`${axo.prefix}mute ${axo.default_example}`],
  perms: [CommandPermissions.ADMIN, CommandPermissions.MODERATOR],
  aliases: ["silenciar"],
  execute: async () => {

  }
} satisfies Command;
