import type { WASocket } from "baileys";

export enum CommandPermissions {
  ALL,
  USER,
  MODERATOR,
  ADMIN,
};

export type MutedUser = {
  key: string;
  value: string;
}

export type Command = {
  name: string;
  aliases?: string[];
  description: string;
  perms: CommandPermissions[];
  examples: string[];
  execute: () => Promise<void>;
}

export interface Axo {
  commands: Map<string, Command>;
  timeouts: Map<string, number>;
  muteds: MutedUser[];
  prefix: string;
  socket: WASocket;
  default_example: string; // default number to show on examples: .mute {default_example}
}

