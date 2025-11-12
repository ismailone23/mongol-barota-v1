import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.string().nonempty(),

    DATABASE_URL: z.string().nonempty(),
  },
  runtimeEnv: process.env,
});
