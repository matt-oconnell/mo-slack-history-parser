import { Command } from "@oclif/core";
import chalk = require("chalk");
import configCreator from "../../core/config";

export default class Config extends Command {
  static description =
    "Manage locally stored Slack tokens (Required to use other commands)";

  static examples = [
    `
    $ slparse config"
    `,
  ];

  async run(): Promise<void> {
    const config = configCreator.create();

    this.log(chalk.greenBright("Successfully retrieved tokens:"));
    this.log("SLACK_BOT_TOKEN", config.get("SLACK_BOT_TOKEN"));
    this.log("SLACK_SIGNING_SECRET", config.get("SLACK_SIGNING_SECRET"));

    this.exit();
  }
}
