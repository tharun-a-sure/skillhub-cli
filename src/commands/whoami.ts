import chalk from "chalk";
import ora from "ora";
import { api } from "../lib/api.js";

export async function whoamiCommand() {
  const spinner = ora("Fetching profile…").start();
  try {
    const user = await api.get<{
      username: string;
      displayName: string;
      tier: string;
    }>("/me");
    spinner.stop();
    console.log(`\n${chalk.bold(user.displayName)} (@${user.username})`);
    console.log(`Plan: ${chalk.cyan(user.tier)}\n`);
  } catch (e: unknown) {
    spinner.fail(e instanceof Error ? e.message : String(e));
    process.exit(1);
  }
}
