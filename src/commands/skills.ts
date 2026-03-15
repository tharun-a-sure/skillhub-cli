import chalk from "chalk";
import ora from "ora";
import { api } from "../lib/api.js";
import * as readline from "node:readline/promises";

interface Skill {
  id: string;
  name: string;
  level: string;
  isVerified: boolean;
  endorsementCount: number;
}

export async function skillsListCommand() {
  const spinner = ora("Fetching skills…").start();
  try {
    const skills = await api.get<Skill[]>("/skills");
    spinner.stop();
    if (!skills.length) {
      console.log(chalk.dim("No skills yet. Run: skillhub skills add"));
      return;
    }
    console.log();
    for (const s of skills) {
      const verified = s.isVerified ? chalk.green(" ✓") : "";
      const level = chalk.dim(`[${s.level}]`);
      const endorsements = chalk.cyan(`${s.endorsementCount} endorsements`);
      console.log(`  ${chalk.bold(s.name)}${verified} ${level} — ${endorsements}`);
    }
    console.log();
  } catch (e: unknown) {
    spinner.fail(e instanceof Error ? e.message : String(e));
    process.exit(1);
  }
}

export async function skillsAddCommand() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const name = (await rl.question("Skill name: ")).trim();
  const levelInput = (await rl.question("Level (beginner/intermediate/advanced/expert) [intermediate]: ")).trim();
  const level = levelInput || "intermediate";
  const yearsInput = (await rl.question("Years of experience (optional): ")).trim();
  rl.close();

  const spinner = ora("Adding skill…").start();
  try {
    await api.post("/skills", {
      name,
      level,
      yearsExperience: yearsInput ? Number(yearsInput) : undefined,
    });
    spinner.succeed(chalk.green(`Skill '${name}' added!`));
  } catch (e: unknown) {
    spinner.fail(e instanceof Error ? e.message : String(e));
    process.exit(1);
  }
}
