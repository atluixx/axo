/** biome-ignore-all lint/style/noNonNullAssertion: ... */
import type { WAMessage } from "baileys";
import { type Axo, type Command, CommandPermissions } from "@/utils";

export default {
  name: "unmute",
  description: "Unmute a user manually or after expiration",
  examples: (axo: Axo) => [`${axo.prefix}unmute ${axo.default_example}`],
  perms: [CommandPermissions.ADMIN],
  aliases: ["desilenciar"],
  execute: async ({
    axo,
    m,
    args,
  }: {
    axo: Axo;
    m: WAMessage;
    args: string[];
  }) => {
    if (!args[0]) {
      await axo.socket.sendMessage(m.key.remoteJid!, {
        text: "Please specify a user to unmute.",
      });
      return;
    }

    const user = axo.find({ axo, m, t: args[0] });

    if (!user) {
      await axo.socket.sendMessage(m.key.remoteJid!, {
        text: "User not found.",
      });
      return;
    }

    const deleted = await axo.prisma.mutedUser.deleteMany({
      where: { jid: user },
    });

    if (deleted.count === 0) {
      await axo.socket.sendMessage(m.key.remoteJid!, {
        text: `User ${user} is not muted.`,
      });
    } else {
      await axo.socket.sendMessage(m.key.remoteJid!, {
        text: `User ${user} has been unmuted successfully.`,
      });
    }
  },
} satisfies Command;
