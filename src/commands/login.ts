import chalk from "chalk";
import ora from "ora";
import open from "open";
import * as readline from "node:readline/promises";
import { config } from "../lib/config.js";
import { api } from "../lib/api.js";

export async function loginCommand() {
  console.log(chalk.bold("\nSkillHub Login\n"));
  console.log("1. Go to your SkillHub settings to generate an API key:");
  console.log(chalk.cyan(`   ${config.apiUrl}/settings/api-keys\n`));

  const shouldOpen = process.stdout.isTTY;
  if (shouldOpen) await open(`${config.apiUrl}/settings/api-keys`);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const key = (await rl.question("Paste your API key (sh_...): ")).trim();
  rl.close();

  if (!key.startsWith("sh_")) {
    console.error(chalk.red("Invalid API key format. Keys start with sh_"));
    process.exit(1);
  }

  config.set("apiKey", key);

  const spinner = ora("Verifying key…").start();
  try {
    const user = await api.get<{ username: string; displayName: string }>("/me");
    config.set("username", user.username);
    spinner.succeed(chalk.green(`Logged in as ${user.displayName} (@${user.username})`));
  } catch (e: unknown) {
    config.set("apiKey", undefined);
    spinner.fail(chalk.red(`Login failed: ${e instanceof Error ? e.message : String(e)}`));
    process.exit(1);
  }
}
