import { connectDb } from "../src/config/db.js";
import { env } from "../src/config/env.js";
import { User } from "../src/models/User.js";

async function makeAdmin() {
  const email = process.argv[2]?.toLowerCase();

  if (!email) {
    console.error("Usage: npm run make-admin -- user@example.com");
    process.exit(1);
  }

  await connectDb(env.mongoUri);

  const user = await User.findOneAndUpdate(
    { email },
    { role: "admin" },
    { new: true },
  ).select("email username role");

  if (!user) {
    console.error(`No user found for ${email}`);
    process.exit(1);
  }

  console.log(`Updated ${user.username} <${user.email}> to role=${user.role}`);
  process.exit(0);
}

makeAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
