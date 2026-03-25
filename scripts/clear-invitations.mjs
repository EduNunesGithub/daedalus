import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL);
await sql`DELETE FROM invitation WHERE status = 'pending'`;
console.log("Deleted pending invitations");
