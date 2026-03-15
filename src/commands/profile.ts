import chalk from "chalk";
import ora from "ora";
import { api } from "../lib/api.js";
import { config } from "../lib/config.js";

export async function profileCommand(username?: string) {
  const target = username ?? config.username;
  if (!target) {
    console.error(chalk.red("Not logged in. Run: skillhub login"));
    process.exit(1);
  }

  const spinner = ora(`Loading @${target}…`).start();
  try {
    const user = await api.get<{
      username: string;
      displayName: string;
      bio: string | null;
      tier: string;
      skills: { name: string; level: string; isVerified: boolean; endorsementCount: number }[];
    }>(`/users/${target}`);
    spinner.stop();

    console.log(`\n${chalk.bold(user.displayName)} (@${user.username})`);
    if (user.bio) console.log(chalk.dim(user.bio));
    console.log(`Plan: ${chalk.cyan(user.tier)}`);
    console.log(`\n${chalk.bold("Skills:")}`);
    for (const s of user.skills) {
      const v = s.isVerified ? chalk.green("✓") : " ";
      console.log(`  ${v} ${s.name} [${s.level}] — ${s.endorsementCount} endorsements`);
    }
    console.log();
  } catch (e: unknown) {
    spinner.fail(e instanceof Error ? e.message : String(e));
    process.exit(1);
  }
}
