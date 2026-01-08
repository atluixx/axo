import pino from "pino";

export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? "info",
  },
  pino.transport({
    target: "pino-pretty",
    options: {
      colorize: true,
      messageFormat: ":: [{time}] {level} ({module}): {msg}",
      translateTime: "HH:MM:ss",
      ignore: "pid,hostname",
    },
  })
);
