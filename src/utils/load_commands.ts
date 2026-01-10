import path from "path";
import fs from "fs";
import type { Axo, Command } from ".";
import { pathToFileURL } from "bun";
import { command_logger } from ".";

const commands_folder = path.resolve(path.join(__dirname, "../commands"));

export const load_commands_recursive = async ({ dir = commands_folder, axo }: { dir?: string; axo: Axo }) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      await load_commands_recursive({ dir: fullPath, axo });
      continue;
    }

    if (!file.name.endsWith(".ts") && !file.name.endsWith(".js")) continue;

    try {
      const fileUrl = pathToFileURL(fullPath).href;
      const imported = await import(fileUrl);

      const command: Command = imported.default;
      if (!command || !command.name) continue;

      axo.commands.set(command.name, command);

      if (command.aliases?.length) {
        for (const alias of command.aliases) {
          axo.commands.set(alias, command);
        }
      }

      command_logger.info({ module: "command loader", name: command.name.toLowerCase() }, "command loaded");
    } catch (err) {
      command_logger.error({ module: "command loader", error: err, path: fullPath }, "failed to load command");
    }
  }
};
