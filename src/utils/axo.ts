import type { WASocket } from "baileys";

export enum CommandPermissions {
  ALL,
  USER,
  MODERATOR,
  ADMIN,
};

export type Command = {
  name: string;
  aliases?: string[];
  description: string;
  perms: CommandPermissions;
  examples: string[];
  execute: () => Promise<void>;
}

export interface Axo {
  commands: Record<string, Command>,
  socket: WASocket,
  timeouts: Record<string, number>
}
