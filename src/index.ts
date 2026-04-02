import { Command } from "commander";
import { loginCommand } from "./commands/login.js";
import { logoutCommand } from "./commands/logout.js";
import { whoamiCommand } from "./commands/whoami.js";
import { skillsListCommand, skillsAddCommand } from "./commands/skills.js";
import { profileCommand } from "./commands/profile.js";

const program = new Command();

program
  .name("skillhub")
  .description("SkillHub CLI — manage your developer skills from the terminal")
  .version("0.1.0");

program
  .command("login")
  .description("Authenticate with an API key")
  .action(loginCommand);

program
  .command("logout")
  .description("Remove stored credentials")
  .action(logoutCommand);

program
  .command("whoami")
  .description("Show the current logged-in user")
  .action(whoamiCommand);

const skills = program.command("skills").description("Manage your skills");
skills.command("list").description("List all your skills").action(skillsListCommand);
skills.command("add").description("Add a new skill interactively").action(skillsAddCommand);

program
  .command("profile [username]")
  .description("View a public profile (defaults to yours)")
  .action((username?: string) => profileCommand(username));

program.parseAsync(process.argv).catch((e) => {
  console.error(e.message);
  process.exit(1);
});
