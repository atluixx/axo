import { logger } from "@/utils";

let interval;

const job_logger = logger.child({ module: "jobs" });

export const start_cron_jobs = async () => {
  interval = setInterval(() => {
    job_logger.info({ job: "fire" }, "firing cron jobs");
  }, 10000)
}
