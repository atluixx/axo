import pino from "pino";

export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? "info",
  },
  pino.transport({
    target: "pino-pretty",
    options: {
      colorize: true,
      messageFormat: "({module}): {msg}",
      translateTime: "HH:MM:ss",
      ignore: "pid,hostname",
    },
  }),
);
export const command_logger = logger.child({ module: "command" });
