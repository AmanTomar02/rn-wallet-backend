import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import "dotenv/config";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(), // ✅ correct key name
  limiter: Ratelimit.slidingWindow(100, "60 s"), // optional: space before s
});

export default ratelimit;
