import type { WAMessage } from "baileys";
import {
  type Axo,
  type Command,
  CommandPermissions,
  command_logger,
} from "@/utils";

const normalize_time = (time: string): number => {
  const units: Record<string, number> = {
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24,
  };

  const unit = time.slice(-1);
  const value = parseFloat(time.slice(0, -1));

  if (!units[unit] || Number.isNaN(value)) {
    throw new Error(`Invalid time format: ${time}`);
  }

  return value * units[unit];
};

export default {
  name: "mute",
  description: "Mute a user for a specific duration",
  examples: (axo: Axo) => [
    `${axo.prefix}mute ${axo.default_example} 5m reason`,
  ],
  perms: [CommandPermissions.ADMIN],
  aliases: ["silenciar"],
  execute: async ({
    axo,
    m,
    args,
  }: {
    axo: Axo;
    m: WAMessage;
    args: string[];
  }) => {
    command_logger.info(args[0]);

    if (!args[0]) return;

    const user = axo.find({ axo, m, t: args[0] });

    if (!m.key.remoteJid) {
      command_logger.info("chat not found");
      return;
    }

    if (!user) {
      command_logger.info("user not found");
      await axo.socket.sendMessage(m.key.remoteJid, {
        text: "User not found.",
      });
      return;
    }

    const muted_until = BigInt(Date.now() + normalize_time(args[1] ?? "1m"));
    const reason = args[2] ?? "Desobedeceu o papai.";

    await axo.prisma.mutedUser.upsert({
      where: { jid: user },
      update: {
        muted_until,
        reason,
      },
      create: {
        jid: user,
        muted_until,
        reason,
      },
    });

    await axo.socket.sendMessage(m.key.remoteJid, {
      text: `User ${user} muted successfully until ${new Date(Number(muted_until))}.`,
    });
  },
} satisfies Command;
