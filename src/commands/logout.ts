import chalk from "chalk";
import { config } from "../lib/config.js";

export function logoutCommand() {
  config.clear();
  console.log(chalk.green("Logged out. API key removed."));
}
