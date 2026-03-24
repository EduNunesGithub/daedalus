import * as authSchema from "@/db/schemas/auth-schema";
import { db } from "@/db/index";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  emailAndPassword: { enabled: true },
  plugins: [organization()],
});
