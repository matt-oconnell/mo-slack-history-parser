import { Command } from "@oclif/core";
import chalk = require("chalk");
import Conf from "conf";

export default class Config extends Command {
  static description =
    "Manage locally stored Slack tokens (Required to use other commands)";

  static examples = [
    `
    $ slparse config"
    `,
  ];

  async run(): Promise<void> {
    const config = new Conf();

    this.log(chalk.greenBright("Successfully retrieved tokens:"));
    this.log("SLACK_BOT_TOKEN", config.get("SLACK_BOT_TOKEN"));
    this.log("SLACK_SIGNING_SECRET", config.get("SLACK_SIGNING_SECRET"));

    this.exit();
  }
}
